import * as trpc from '@trpc/server';
import { z } from 'zod';
import messages from 'constants/messages/workspace';
import { createProtectedRouter } from './protected-router';

export const workspaceSectionRouter = createProtectedRouter().mutation(
  'createSection',
  {
    input: z.object({
      title: z.string(),
      position: z.number().positive(),
      workspaceId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const workspace = await ctx.prisma.workspaceSection.create({
        data: {
          title: input.title,
          position: input.position,
          workspace: { connect: { id: input.workspaceId } },
        },
      });

      return workspace;
    },
  }
);
