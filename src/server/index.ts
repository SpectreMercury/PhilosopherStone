import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { accountRouter } from "./account";



export const appRouter = router({
  account: accountRouter
});

export type AppRouter = typeof appRouter;
