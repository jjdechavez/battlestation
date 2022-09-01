import * as trpc from "@trpc/server";
import { createRouter } from "./context";
import { z } from "zod";
import { env } from "../../env/server.mjs";

export const userRouter = createRouter().mutation("summonUser", {
  input: z.object({
    code: z.string(),
    email: z.string(),
    password: z.string(),
  }),
  resolve({ input, ctx }) {
    if (input.code !== env.SUMMON_SECRET) {
      throw new trpc.TRPCError({ code: "FORBIDDEN" });
    }

    return "OK";
  },
});
