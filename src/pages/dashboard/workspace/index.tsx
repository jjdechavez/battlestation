import React, { ReactElement } from 'react';
import Link from 'next/link';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { z } from 'zod';
import {
  Controller,
  DefaultValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from 'components/layout/dashboard';
import HeroIcon from 'components/base/HeroIcon';
import SlideOver from 'components/base/SlideOver';
import { NextPageWithLayout } from 'pages/_app';
import { trpc } from 'utils/trpc';
import { useQueryClient } from 'react-query';

const WorkspacePage: NextPageWithLayout = () => {
  const [showSlideOver, setShowSlideOver] = React.useState(false);
  const workspaces = trpc.useQuery(['workspace.getWorkspaces']);

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
            className='focus:ring-1 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 border border-gray-200 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm'
            type='text'
            aria-label='Filter projects'
            placeholder='Filter projects...'
          />
        </form>
      </header>
      <SlideOver
        name='New Workspace'
        show={showSlideOver}
        handleShow={setShowSlideOver}
      >
        <WorkspaceForm handleShowSlideOver={setShowSlideOver} />
      </SlideOver>
      {!workspaces.isLoading && workspaces.data ? (
        <ul className='bg-slate-50 p-4 sm:px-8 sm:pt-6 sm:pb-8 lg:p-4 xl:px-8 xl:pt-6 xl:pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 text-sm leading-6'>
          {workspaces.data?.map((workspace) => (
            <li
              key={workspace.id}
              className='group cursor-pointer rounded-md p-3 bg-white ring-1 ring-slate-200 shadow-sm hover:bg-blue-500 hover:ring-blue-500 hover:shadow-md'
            >
              <Link href={`/dashboard/workspace/${workspace.id}`}>
                <a className='hover:bg-blue-500 hover:shadow-md group rounded-md bg-white shadow-sm'>
                  <dl className='grid sm:block lg:grid xl:block grid-cols-2 grid-rows-2 items-center'>
                    <div>
                      <dt className='sr-only'>Title</dt>
                      <dd className='group-hover:text-white font-semibold text-slate-900'>
                        {workspace.title}
                      </dd>
                    </div>
                    <div>
                      <dt className='sr-only'>Category</dt>
                      <dd className='group-hover:text-blue-200 capitalize'>
                        {workspace.type.toLowerCase()}
                      </dd>
                    </div>
                    <div className='col-start-2 row-start-1 row-end-3 sm:mt-4 lg:mt-0 xl:mt-4'>
                      <dt className='sr-only'>Created At</dt>
                      <dd className='group-hover:text-blue-200 text-slate-500'>
                        {workspace.updatedAt.toLocaleString('default', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </dd>
                    </div>
                  </dl>
                </a>
              </Link>
            </li>
          ))}
          <li
            className={clsx(
              'flex',
              !!!workspaces.data.length ? 'col-span-2' : ''
            )}
          >
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
      ) : (
        <div>Loading...</div>
      )}
    </section>
  );
};

interface WorkspaceTypes {
  Personal: 'PERSONAL';
  Work: 'WORK';
}

type WorkspaceTypeKey = keyof WorkspaceTypes;

const WORKSPACE_TYPES = {
  Personal: 'PERSONAL',
  Work: 'WORK',
};

const WorkspaceSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  type: z.enum(['PERSONAL', 'WORK']),
});

type WorkspaceSchemaType = z.infer<typeof WorkspaceSchema>;

const defaultValues: DefaultValues<WorkspaceSchemaType> = {
  title: '',
  type: 'PERSONAL',
};

const WorkspaceForm = ({
  handleShowSlideOver,
}: {
  handleShowSlideOver: (state: boolean) => void;
}) => {
  const qc = useQueryClient();
  const createWorkspace = trpc.useMutation(['workspace.createWorkspace'], {
    onSuccess: () => {
      qc.invalidateQueries('workspace.getWorkspaces');
      handleShowSlideOver(false);
    },
  });
  const methods = useForm<WorkspaceSchemaType>({
    resolver: zodResolver(WorkspaceSchema),
    defaultValues,
  });

  const { handleSubmit, register, formState, control } = methods;
  const { errors, isSubmitting } = formState;
  const onSubmit: SubmitHandler<WorkspaceSchemaType> = (data) => {
    createWorkspace.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='grid gap-y-4'>
        <div>
          <label
            htmlFor='title'
            className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm mb-2"
          >
            Title
          </label>
          <div className='relative'>
            <input
              id='title'
              {...register('title')}
              className={clsx(
                errors?.title
                  ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
                'py-3 px-4 block w-full border rounded-md text-sm disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none'
              )}
              disabled={isSubmitting}
              aria-describedby='title-error'
            />
            <div
              className={clsx(
                errors?.title ? 'flex items-start' : 'hidden',
                'absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3'
              )}
            >
              <svg
                className='h-5 w-5 text-red-500'
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 16 16'
                aria-hidden='true'
              >
                <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' />
              </svg>
            </div>
          </div>
          <p
            className={clsx(
              errors?.title ? '' : 'hidden',
              'text-xs text-red-600 mt-2'
            )}
            id='title-error'
          >
            {errors?.title?.message}
          </p>
        </div>
        <div className='relative'>
          <Controller
            control={control}
            name='type'
            render={({ field }) => (
              <Listbox
                value={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm capitalize font-medium text-gray-700">
                      {field.name}
                    </Listbox.Label>
                    <div className='relative mt-1'>
                      <Listbox.Button className='disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 px-4 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm'>
                        <span className='block truncate capitalize'>
                          {field.value.toLowerCase()}
                        </span>
                        <span className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
                          <HeroIcon
                            name='ChevronUpDownIcon'
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={React.Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                          {Object.keys(WORKSPACE_TYPES).map((type) => (
                            <Listbox.Option
                              key={type}
                              className={({ active }) =>
                                clsx(
                                  active
                                    ? 'text-white bg-blue-600'
                                    : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-3 pr-9'
                                )
                              }
                              value={WORKSPACE_TYPES[type as WorkspaceTypeKey]}
                            >
                              {({ selected, active }) => (
                                <>
                                  <div className='flex items-center'>
                                    <span
                                      className={clsx(
                                        selected
                                          ? 'font-semibold'
                                          : 'font-normal',
                                        'ml-3 block truncate'
                                      )}
                                    >
                                      {type}
                                    </span>
                                  </div>

                                  {selected ? (
                                    <span
                                      className={clsx(
                                        active ? 'text-white' : 'text-blue-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <HeroIcon
                                        name='CheckIcon'
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            )}
          />
          <p
            className={clsx(
              errors?.type ? '' : 'hidden',
              'text-xs text-red-600 mt-2'
            )}
            id='type-error'
          >
            {errors?.type?.message}
          </p>
        </div>
        <button
          type='submit'
          className={clsx(
            isSubmitting ? 'cursor-not-allowed hover:bg-blue-400' : '',
            'py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm'
          )}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <svg
              className='w-5 h-5 mr-3 -ml-1 text-white animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              ></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
          ) : null}
          {isSubmitting ? 'Saving ...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

WorkspacePage.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default WorkspacePage;
