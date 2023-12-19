// import ClusterService from '@/cluster';
import { publicProcedure, router } from '@/server/trpc';
import SporeService from '@/spore';
import { BI, config, helpers } from '@ckb-lumos/lumos';
import z from 'zod';

export const sporeRouter = router({
  get: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      if (!input.id) {
        return undefined;
      }
      const spore = SporeService.shared.get(input.id);
      return spore;
    }),
  list: publicProcedure
    .input(
      z
        .object({
          clusterIds: z.array(z.string()).optional(),
          owner: z.string().optional(),
          skip: z.number().optional(),
          limit: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { clusterIds, owner, skip, limit } = input ?? {};
      const options = { skip, limit };

      const getSpores = async () => {
        if (owner) {
          const lock = helpers.parseAddress(owner, {
            config: config.predefined.AGGRON4,
          });
          return await SporeService.shared.listByLock(
            lock,
            clusterIds,
            options,
          );
        }
        return await SporeService.shared.list(clusterIds, options);
      };

      const { items: spores } = await getSpores();
      return spores;
    }),
  infiniteList: publicProcedure
    .input(
      z
        .object({
          cursor: z.number().optional(),
          limit: z.number().optional(),
          owner: z.string().optional(),
          contentTypes: z.array(z.string()).optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { owner, cursor = 0, limit = 10, contentTypes } = input ?? {};
      const options = { skip: cursor, limit, contentTypes };

      const getSpores = async () => {
        if (owner) {
          const lock = helpers.parseAddress(owner, {
            config: config.predefined.AGGRON4,
          });
          return await SporeService.shared.listByLock(lock, undefined, options);
        }
        return await SporeService.shared.list(undefined, options);
      };

      const { items: spores, collected } = await getSpores();

      const items = await Promise.all(
        spores.map(async (spore) => {
          if (!spore.clusterId) {
            return spore;
          }

          // const cluster = await ClusterService.shared.get(spore.clusterId);
          return {
            ...spore,
            // cluster,
          };
        }),
      );

      return {
        items,
        nextCursor: spores.length === 0 ? undefined : cursor + collected,
      };
    }),
  getCapacityMargin: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      if (!id) {
        return BI.from(0).toHexString();
      }

      const margin = await SporeService.shared.getCapacityMargin(id);
      return margin.toHexString();
    }),
});
