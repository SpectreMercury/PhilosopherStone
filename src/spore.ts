import { BI, Cell, Indexer, OutPoint, RPC, Script } from '@ckb-lumos/lumos';
import {
  SporeConfig,
  SporeData,
  getCellCapacityMargin,
  getSporeScript,
  predefinedSporeConfigs,
} from '@spore-sdk/core';
import pick from 'lodash-es/pick';
import { isSupportedMIMEType } from './utils/mime';
import { uniqBy } from 'lodash-es';
import { sporeConfig } from '@/utils/config';

export interface Spore {
  id: string;
  clusterId: string | null;
  content?: string;
  contentType: string;
  cell: Pick<Cell, 'outPoint' | 'cellOutput'>;
  // cluster?: Cluster;
}

export interface QueryOptions {
  skip?: number;
  limit?: number;
  contentTypes?: string[];
  includeContent?: boolean;
}

export default class SporeService {
  private config: SporeConfig;
  private indexer: Indexer;
  private rpc: RPC;

  constructor(config: SporeConfig) {
    this.config = config;
    this.indexer = new Indexer(this.config.ckbIndexerUrl);
    this.rpc = new RPC(this.config.ckbNodeUrl);
  }

  public static shared = new SporeService(sporeConfig);

  private static getSporeFromCell(cell: Cell, includeContent?: boolean): Spore {
    const unpacked = SporeData.unpack(cell.data);
    const spore: Spore = {
      id: cell.cellOutput.type!.args,
      contentType: Buffer.from(unpacked.contentType.slice(2), 'hex').toString(),
      clusterId: unpacked.clusterId ?? null,
      cell: pick(cell, ['cellOutput', 'outPoint']),
    };
    if (includeContent) {
      spore.content = unpacked.content;
    }
    return spore;
  }

  public get script() {
    return getSporeScript(this.config, 'Spore').script;
  }
  
  public isSporeScript(script: Script | undefined) {
    if (!script) {
      return false;
    }
    return (
      script.codeHash === this.script.codeHash &&
      script.hashType === this.script.hashType
    );
  }

  public setConfig(config: SporeConfig) {
    this.config = config;
    this.indexer = new Indexer(this.config.ckbIndexerUrl);
    this.rpc = new RPC(this.config.ckbNodeUrl);
  }

  public async get(
    id: string,
    options?: QueryOptions,
  ): Promise<Spore | undefined> {
    if (!id) {
      return undefined;
    }
    const collector = this.indexer.collector({
      type: { ...this.script, args: id },
    });
    for await (const cell of collector.collect()) {
      return SporeService.getSporeFromCell(cell, options?.includeContent);
    }
    return undefined;
  }

  public async getCapacityMargin(id: string) {
    const collector = this.indexer.collector({
      type: { ...this.script, args: id },
    });
    for await (const cell of collector.collect()) {
      return getCellCapacityMargin(cell);
    }
    return BI.from(0);
  }

  public async getNewOmnilock() {
    const collector = this.indexer.collector({
      type: {
        "codeHash": "0x00000000000000000000000000000000000000000000000000545950455f4944",
        "args": "0x761f51fc9cd6a504c32c6ae64b3746594d1af27629b427c5ccf6c9a725a89144",
        "hashType": "type"
      }
    })
    let cells:Cell[] = []
    for await(const cell of collector.collect()) {
      cells.push(cell)
    }
    return cells
  }

  public async list(clusterIds: string[] = [], options?: QueryOptions) {
    const collector = this.indexer.collector({
      type: { ...this.script, args: '0x' },
      order: 'desc',
      skip: options?.skip,
    });

    let spores: Spore[] = [];
    let collected = 0;
    for await (const cell of collector.collect()) {
      collected += 1;
      const spore = SporeService.getSporeFromCell(
        cell,
        options?.includeContent,
      );
      if (
        options?.contentTypes &&
        !options.contentTypes.includes(spore.contentType)
      ) {
        continue;
      }

      if (clusterIds.length > 0 && !clusterIds.includes(spore.clusterId!)) {
        continue;
      }

      spores.push(spore);
      if (options?.limit && spores.length === options.limit) {
        break;
      }
    }

    return {
      items: spores,
      collected,
    };
  }

  public async listByLock(
    lock: Script,
    clusterIds: string[] = [],
    options?: QueryOptions,
  ) {
    const collector = this.indexer.collector({
      lock,
      type: { ...this.script, args: '0x' },
      order: 'desc',
      skip: options?.skip,
    });

    let spores: Spore[] = [];
    let collected = 0;
    for await (const cell of collector.collect()) {
      collected += 1;
      const spore = SporeService.getSporeFromCell(
        cell,
        options?.includeContent,
      );
      if (isSupportedMIMEType(spore.contentType)) {
        if (
          options?.contentTypes &&
          !options.contentTypes.includes(spore.contentType)
        ) {
          continue;
        }

        if (clusterIds.length > 0 && !clusterIds.includes(spore.clusterId!)) {
          continue;
        }

        spores.push(spore);
        if (options?.limit && spores.length === options.limit) {
          break;
        }
      }
    }
    return {
      items: spores,
      collected,
    };
  }

  public async recent(limit: number, withClusterId?: boolean) {
    let recentSpores: Spore[] = [];
    let cursor: string = '';

    while (recentSpores.length < limit) {
      const transactions = await this.rpc.getTransactions(
        {
          script: { ...this.script, args: '0x' },
          scriptType: 'type',
        },
        'desc',
        BI.from(limit * 2).toBigInt(),
        ...(cursor ? [cursor] : []),
      );

      cursor = transactions.lastCursor;

      const txs = await Promise.all(
        transactions.objects.map(async (tx) => {
          const { transaction } = await this.rpc.getTransaction(tx.txHash);
          return transaction;
        }),
      );

      const spores = await Promise.all(
        txs
          .filter((tx) =>
            tx.outputs.some((output) =>
              SporeService.shared.isSporeScript(output.type),
            ),
          )
          .map(async (tx) => {
            const index = tx.outputs.findIndex((output) =>
              SporeService.shared.isSporeScript(output.type),
            )!;
            const outPoint: OutPoint = {
              txHash: tx.hash!,
              index: BI.from(index).toHexString(),
            };
            const liveCell = await this.rpc.getLiveCell(outPoint, true);
            if (liveCell.status !== 'live') {
              return undefined;
            }

            const cell: Cell = {
              data: liveCell!!.cell!!.data.content,
              cellOutput: liveCell!!.cell!!.output,
              outPoint,
            };

            return SporeService.getSporeFromCell(cell);
          }),
      );
      recentSpores.push(
        ...(spores.filter(
          (spore) =>
            spore !== undefined && (!withClusterId || !!spore.clusterId),
        ) as Spore[]),
      );
      recentSpores = uniqBy(recentSpores, 'id');
    }

    return recentSpores.slice(0, limit);
  }
}
