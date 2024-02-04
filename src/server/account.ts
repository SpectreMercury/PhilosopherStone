import { publicProcedure, router } from '@/server/trpc';
import { sporeConfig } from '@/utils/config';
import { BI, Indexer, helpers } from '@ckb-lumos/lumos';
import { predefinedSporeConfigs } from '@spore-sdk/core';
import z from 'zod';

export const accountRouter = router({
  balance: publicProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { address } = input;

      if (!address) {
        return '0x0';
      }

      const config = sporeConfig;
      const indexer = new Indexer(sporeConfig.ckbIndexerUrl);
      const collector = indexer.collector({
        lock: helpers.parseAddress(address as string, { config: config.lumos }),
        data: '0x',
      });

      let capacities = BI.from(0);
      for await (const cell of collector.collect()) {
        capacities = capacities.add(cell.cellOutput.capacity);
      }

      return capacities.toHexString();
    }),
});
