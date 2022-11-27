// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { protectedExampleRouter } from './protected-example-router';
import { userRouter } from './user';
import { workspaceRouter } from './workspace';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('user.', userRouter)
  .merge('example.', exampleRouter)
  .merge('auth.', protectedExampleRouter)
  .merge('workspace.', workspaceRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
