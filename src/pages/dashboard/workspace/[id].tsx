import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { trpc } from 'utils/trpc';
import clsx from 'clsx';
import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Disclosure } from '@headlessui/react';
import { useQueryClient } from 'react-query';
import { NextPageWithLayout } from 'pages/_app';

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
        <WorkspaceSectionForm
          workspaceId={workspaceId}
          currentPosition={workspace.data?.workspaceSection.length ?? 0}
          handleShowSlideOver={setShowSlideOver}
        />
      </SlideOver>
      {workspace.data?.workspaceSection.map((section) => (
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                key={section.id}
                className='border divide-gray-200 flex justify-between py-2 sm:px-8 sm:py-6 lg:p-2 xl:px-8 w-full text-left text-sm font-bold text-gray-900'
              >
                {section.title}
                <HeroIcon
                  name='ChevronUpIcon'
                  className={clsx(
                    open ? 'rotate-180 transform' : '',
                    'h-5 w-5'
                  )}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='bg-white'>
                <div className='overflow-x-auto border border-gray-200'>
                  <table className='min-w-full divide-y divide-gray-200 text-sm'>
                    <tbody className='divide-y divide-gray-200'>
                      <tr>
                        <td className='whitespace-nowrap px-8 py-2 font-medium text-gray-900'>
                          John Doe
                        </td>
                        <td className='whitespace-nowrap px-8 py-2 text-gray-700'>
                          24/05/1995
                        </td>
                        <td className='whitespace-nowrap px-8 py-2 text-gray-700'>
                          Web Developer
                        </td>
                        <td className='whitespace-nowrap px-8 py-2 text-gray-700'>
                          $120,000
                        </td>
                      </tr>
                      <tr>
                        <td className='whitespace-nowrap px-8 py-2 font-medium text-gray-900'>
                          John Doe
                        </td>
                        <td className='whitespace-nowrap px-8 py-2 text-gray-700'>
                          24/05/1995
                        </td>
                        <td className='whitespace-nowrap px-8 py-2 text-gray-700'>
                          Web Developer
                        </td>
                        <td className='whitespace-nowrap px-8 py-2 text-gray-700'>
                          $120,000
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
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

const WorkspaceSectionSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  position: z.number().positive(),
  workspaceId: z.string(),
});

type WorkspaceSectionSchemaType = z.infer<typeof WorkspaceSectionSchema>;

const WorkspaceSectionForm = ({
  handleShowSlideOver,
  currentPosition,
  workspaceId,
}: {
  handleShowSlideOver: (state: boolean) => void;
  currentPosition: number;
  workspaceId: string;
}) => {
  const defaultValues: DefaultValues<WorkspaceSectionSchemaType> = {
    title: '',
    position: currentPosition + 1,
    workspaceId,
  };
  const qc = useQueryClient();
  const createWorkspaceSection = trpc.useMutation(
    ['workspace.section.createSection'],
    {
      onSuccess: () => {
        qc.invalidateQueries('workspace.getWorkspace');
        handleShowSlideOver(false);
      },
    }
  );
  const methods = useForm<WorkspaceSectionSchemaType>({
    resolver: zodResolver(WorkspaceSectionSchema),
    defaultValues,
  });

  const { handleSubmit, register, formState } = methods;
  const { errors, isSubmitting } = formState;
  const onSubmit: SubmitHandler<WorkspaceSectionSchemaType> = async (data) => {
    await createWorkspaceSection.mutateAsync(data);
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
