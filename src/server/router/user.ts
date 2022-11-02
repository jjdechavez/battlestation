import * as trpc from '@trpc/server';
import { createRouter } from './context';
import { z } from 'zod';
import { env } from 'env/server.mjs';
import { hashPassword } from 'utils/auth';
import messages from 'constants/messages/auth';

export const userRouter = createRouter().mutation('summon', {
  input: z.object({
    code: z.string(),
    email: z.string(),
    password: z.string(),
  }),
  async resolve({ input, ctx }) {
    if (input.code !== env.SUMMON_SECRET) {
      throw new trpc.TRPCError({
        code: 'FORBIDDEN',
        message: messages.summonForbidden,
      });
    }

    const { email, password } = input;
    const existingUser = await ctx.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new trpc.TRPCError({
        code: 'CONFLICT',
        message: messages.summonForbidden,
      });
    }

    const hashedPassword = await hashPassword(password);

    await ctx.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  },
});
