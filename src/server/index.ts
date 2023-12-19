import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { accountRouter } from "./account";
import { sporeRouter } from "./spore";



export const appRouter = router({
  account: accountRouter,
  // spore: sporeRouter
});

export type AppRouter = typeof appRouter;
