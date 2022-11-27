import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from 'pages/_app';
import { trpc } from 'utils/trpc';

import HeroIcon from 'components/base/HeroIcon';
import DashboardLayout from 'components/layout/dashboard';
import SlideOver from 'components/base/SlideOver';

const WorkspacePage: NextPageWithLayout = () => {
  const router = useRouter();
  const workspaceId = router.query.id as string;
  const workspace = trpc.useQuery([
    'workspace.getWorkspace',
    { id: workspaceId },
  ]);
  const [showSlideOver, setShowSlideOver] = React.useState(false);

  if (workspace.isLoading) {
    return <div>Loading...</div>;
  }

  if (workspace.isError) {
    return <div>{workspace.error.message}</div>;
  }

  return (
    <section>
      <header className='bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6'>
        <div className='flex items-center justify-start'>
          {workspace.data?.type === 'PERSONAL' ? (
            <HeroIcon name='HomeIcon' className='h-5 w-5' />
          ) : (
            <HeroIcon name='BuildingOffice2Icon' className='h-5 w-5' />
          )}
          <h2 className='font-semibold text-slate-900 ml-3'>
            {workspace.data?.title}
          </h2>
        </div>
      </header>
      <SlideOver
        name='New Section'
        show={showSlideOver}
        handleShow={setShowSlideOver}
      >
        <div>Form</div>
      </SlideOver>
      <ul className='bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 gap-4 text-sm leading-6'>
        <li className='flex'>
          <button
            className='hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3'
            onClick={() => setShowSlideOver(true)}
          >
            <svg
              className='group-hover:text-blue-500 mb-1 text-slate-400'
              width='20'
              height='20'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z' />
            </svg>
            Add Section
          </button>
        </li>
      </ul>
    </section>
  );
};

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WorkspacePage;
