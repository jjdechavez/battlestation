import { ReactElement } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DashboardLayout from 'components/layout/dashboard';
import { NextPageWithLayout } from 'pages/_app';

const workspaces = [
  {
    name: 'API Integration',
    category: 'Engineering',
    createdAt: new Date(),
  },
  {
    name: 'New Benefits Plan',
    category: 'Human Resources',
    createdAt: new Date(),
  },
  {
    name: 'Onboarding Emails',
    category: 'Customer Success',
    createdAt: new Date(),
  },
];

const WorkspacePage: NextPageWithLayout = () => {
  return (
    <section>
      <header className='bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold text-slate-900'>Workspace</h2>
          <a
            href='/new'
            className='hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm'
          >
            <svg
              width='20'
              height='20'
              fill='currentColor'
              className='mr-2'
              aria-hidden='true'
            >
              <path d='M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z' />
            </svg>
            New
          </a>
        </div>
        <form className='group relative'>
          <svg
            width='20'
            height='20'
            fill='currentColor'
            className='absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
            />
          </svg>
          <input
            className='focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm'
            type='text'
            aria-label='Filter projects'
            placeholder='Filter projects...'
          />
        </form>
      </header>
      <ul className='bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6'>
        {workspaces.map((workspace) => (
          <li
            key={workspace.name}
            className='group cursor-pointer rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md'
          >
            <Link href='#'>
              <a className='hover:bg-blue-500 hover:shadow-md group rounded-md bg-white shadow-sm'>
                <dl className='grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center'>
                  <div>
                    <dt className='sr-only'>Title</dt>
                    <dd className='group-hover:text-white font-semibold text-slate-900'>
                      {workspace.name}
                    </dd>
                  </div>
                  <div>
                    <dt className='sr-only'>Category</dt>
                    <dd className='group-hover:text-blue-200'>
                      {workspace.category}
                    </dd>
                  </div>
                  <div className='col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-0 xl:mt-4'>
                    <dt className='sr-only'>Created At</dt>
                    <dd className='group-hover:text-blue-200 text-slate-500'>
                      {workspace.createdAt.toString()}
                    </dd>
                  </div>
                </dl>
              </a>
            </Link>
          </li>
        ))}
        <li className='flex'>
          <a
            href='/new'
            className='hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3'
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
            New project
          </a>
        </li>
      </ul>
    </section>
  );
};
WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WorkspacePage;
