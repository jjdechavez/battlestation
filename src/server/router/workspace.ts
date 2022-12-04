import * as trpc from '@trpc/server';
import { z } from 'zod';
import messages from 'constants/messages/workspace';
import { createProtectedRouter } from './protected-router';

export const workspaceRouter = createProtectedRouter()
  .query('getWorkspaces', {
    async resolve({ ctx }) {
      const userId = ctx.session.user.id;

      const workspaces = await ctx.prisma.workspace.findMany({
        where: { authorId: userId },
      });
      return workspaces;
    },
  })
  .query('getWorkspace', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      const workspace = await ctx.prisma.workspace.findFirst({
        where: { id: input.id, authorId: userId },
        include: {
          workspaceSection: true,
        },
      });

      if (!workspace) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: messages.workspaceNotFound,
        });
      }

      return workspace;
    },
  })
  .mutation('createWorkspace', {
    input: z.object({
      title: z.string(),
      type: z.enum(['PERSONAL', 'WORK']),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      const workspace = await ctx.prisma.workspace.create({
        data: {
          title: input.title,
          type: input.type,
          author: { connect: { id: userId } },
        },
      });

      return workspace;
    },
  });
