import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import DashboardLayout from 'components/layout/dashboard';
import HeroIcon from 'components/base/HeroIcon';
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
  const [showSlideOver, setShowSlideOver] = React.useState(false);

  return (
    <section>
      <header className='bg-white space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6'>
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold text-slate-900'>Workspace</h2>
          <button
            className='hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm'
            onClick={() => setShowSlideOver(true)}
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
            New Workspace
          </button>
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
      <WorkspaceSlideOver show={showSlideOver} handleShow={setShowSlideOver} />
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
        <li className={clsx('flex', !!!workspaces.length ? 'col-span-2' : '')}>
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
            New workspace
          </button>
        </li>
      </ul>
    </section>
  );
};

type WorkspaceSlideOverType = {
  show: boolean;
  handleShow: (state: boolean) => void;
};

const WorkspaceSlideOver = ({ show, handleShow }: WorkspaceSlideOverType) => {
  return (
    <Transition.Root show={show} as={React.Fragment}>
      <Dialog as='div' className='relative z-10' onClose={handleShow}>
        <Transition.Child
          as={React.Fragment}
          enter='ease-in-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in-out duration-500'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
              <Transition.Child
                as={React.Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='translate-x-full'
              >
                <Dialog.Panel className='pointer-events-auto relative w-screen max-w-md'>
                  <Transition.Child
                    as={React.Fragment}
                    enter='ease-in-out duration-500'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-500'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4'>
                      <button
                        type='button'
                        className='rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white'
                        onClick={() => handleShow(false)}
                      >
                        <span className='sr-only'>Close panel</span>
                        <HeroIcon
                          name='XMarkIcon'
                          className='h-6 w-6'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl'>
                    <div className='px-4 sm:px-6'>
                      <Dialog.Title className='text-lg font-medium text-gray-900'>
                        New Workspace
                      </Dialog.Title>
                    </div>
                    <div className='relative mt-6 flex-1 px-4 sm:px-6'>
                      {/* Replace with your content */}
                      <div className='absolute inset-0 px-4 sm:px-6'>
                        <div
                          className='h-full border-2 border-dashed border-gray-200'
                          aria-hidden='true'
                        />
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WorkspacePage;
