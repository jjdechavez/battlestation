import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from 'components/layout/dashboard';
import HeroIcon from 'components/base/HeroIcon';
import { NextPageWithLayout } from 'pages/_app';
import { trpc } from 'utils/trpc';

const WorkspacePage: NextPageWithLayout = () => {
  const router = useRouter();
  const workspaceId = router.query.id as string;
  const workspace = trpc.useQuery([
    'workspace.getWorkspace',
    { id: workspaceId },
  ]);

  if (workspace.isLoading) {
    return <div>Loading...</div>;
  }

  if (workspace.isError) {
    return <div>{workspace.error.message}</div>;
  }

  console.log(workspace);

  return (
    <section>
      <header className='bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold text-slate-900'>
            Workspace: {workspaceId}
          </h2>
        </div>
      </header>
    </section>
  );
};

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WorkspacePage;
