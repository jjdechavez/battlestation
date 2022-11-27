import { z } from 'zod';
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
