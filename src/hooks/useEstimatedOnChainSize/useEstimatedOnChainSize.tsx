import { useEffect, useState } from 'react';
import { useConnect } from './useConnect';
import { createSpore, getSporeScript, predefinedSporeConfigs } from '@spore-sdk/core';
import { BI } from '@ckb-lumos/lumos';
import { isSameScript } from '@/utils/script';
import { sporeConfig } from '@/utils/config';

export default function useEstimatedOnChainSize(
  clusterId: string | undefined,
  content: Blob | null,
  useCapacityMargin = false,
) {
  const { address, lock } = useConnect();
  const [onChainSize, setOnChainSize] = useState(0);

  useEffect(() => {
    if (!content || !address || !lock) {
      setOnChainSize(0);
      return;
    }

    const estimate = async () => {
      try {
        const contentBuffer = await content.arrayBuffer();
        const { txSkeleton } = await createSpore({
          data: {
            contentType: content.type,
            content: new Uint8Array(contentBuffer),
            clusterId,
          },
          fromInfos: [address],
          toLock: lock,
          config: sporeConfig,
          // @ts-ignore
          capacityMargin: useCapacityMargin ? BI.from(100_000_000) : BI.from(0),
        });

        const outputs = txSkeleton.get('outputs');
        const cell = outputs
          .filter((output) => isSameScript(output.cellOutput.lock, lock))
          .find((output) => {
            const { type } = output.cellOutput;
            const { script: sporeScript } = getSporeScript(predefinedSporeConfigs.Aggron4, 'Spore');
            return (
              type?.codeHash === sporeScript.codeHash &&
              type.hashType === sporeScript.hashType
            );
          });

        const capacity = BI.from(cell?.cellOutput.capacity ?? 0);
        return Math.ceil(capacity.toNumber() / 10 ** 8);
      } catch (error) {
        return Math.ceil(content.size);
      }
    };
    estimate().then((size) => {
      setOnChainSize(size);
    });
  }, [content, address, lock, clusterId, useCapacityMargin]);

  return onChainSize;
}
