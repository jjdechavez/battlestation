import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { DefaultValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import clsx from 'clsx';
import { trpc } from '../utils/trpc';
import Card from '../components/module/Card';

const SummonSchema = z
  .object({
    code: z.string().min(1, { message: 'Code is required' }),
    email: z.string().email({ message: 'Email is invalid' }),
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 character(s)' })
      .regex(/(?=.*\d)(?=.*[A-Z]).{6,}/, {
        message: 'Please follow the guide below.',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password does not match the password',
    path: ['confirmPassword'],
  });

type SummonSchemaType = z.infer<typeof SummonSchema>;

const defaultValues: DefaultValues<SummonSchemaType> = {
  code: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SummonPage: NextPage = () => {
  const summonUser = trpc.useMutation(['user.summon']);
  const methods = useForm<SummonSchemaType>({
    resolver: zodResolver(SummonSchema),
    defaultValues,
  });

  const { handleSubmit, register, formState } = methods;
  const { errors } = formState;

  const onSubmit: SubmitHandler<SummonSchemaType> = (data) => {
    summonUser.mutate(data);
  };

  return (
    <>
      <Head>
        <title>Summon</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main
        id='content'
        role='main'
        className='container max-w-md min-h-screen flex flex-col items-center justify-center mx-auto p-6'
      >
        <Card>
          <div className='text-center'>
            <h1 className='block text-2xl font-bold text-gray-800'>Summon</h1>
            <p className='mt-2 text-sm text-gray-600'>
              {summonUser.isSuccess ? (
                <>
                  You're already setup! Time to move{' '}
                  <Link href='/'>
                    <a
                      className='text-blue-600 decoration-2 hover:underline font-medium'
                      href='#'
                    >
                      here
                    </a>
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link href='/'>
                    <a
                      className='text-blue-600 decoration-2 hover:underline font-medium'
                      href='#'
                    >
                      Sign in here
                    </a>
                  </Link>
                </>
              )}
            </p>

            {summonUser.isError ? (
              <p className='text-red-600 text font-semibold'>
                {summonUser.error.message}
              </p>
            ) : null}
          </div>

          <div className={clsx(summonUser.isSuccess && 'hidden', 'mt-5')}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-y-4'>
                <div>
                  <label
                    htmlFor='code'
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm mb-2"
                  >
                    Code
                  </label>
                  <div className='relative'>
                    <input
                      type='password'
                      id='code'
                      {...register('code')}
                      className={clsx(
                        errors?.code
                          ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
                        'py-3 px-4 block w-full rounded-md text-sm'
                      )}
                      aria-describedby='code-error'
                    />
                    <div
                      className={clsx(
                        errors?.code ? 'flex items-start' : 'hidden',
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
                      errors?.code ? '' : 'hidden',
                      'text-xs text-red-600 mt-2'
                    )}
                    id='code-error'
                  >
                    {errors?.code?.message}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor='email'
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm mb-2"
                  >
                    Email address
                  </label>
                  <div className='relative'>
                    <input
                      type='email'
                      id='email'
                      {...register('email')}
                      className={clsx(
                        errors?.email
                          ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
                        'py-3 px-4 block w-full rounded-md text-sm'
                      )}
                      aria-describedby='email-error'
                    />
                    <div
                      className={clsx(
                        errors?.email ? 'flex items-start' : 'hidden',
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
                      errors?.email ? '' : 'hidden',
                      'text-xs text-red-600 mt-2'
                    )}
                    id='email-error'
                  >
                    {errors?.email?.message}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm mb-2"
                  >
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      type='password'
                      id='password'
                      {...register('password')}
                      className={clsx(
                        errors?.password
                          ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
                        'py-3 px-4 block w-full rounded-md text-sm'
                      )}
                      aria-describedby='password-error'
                    />
                    <div
                      className={clsx(
                        errors?.password ? 'flex items-start' : 'hidden',
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
                    className='text-xs text-slate-500 mt-2'
                    id='password-guide'
                  >
                    Password must contain at least one number, one uppercase
                    letter and at least 8 or more character(s)
                  </p>
                  <p
                    className={clsx(
                      errors?.password ? '' : 'hidden',
                      'text-xs text-red-600 mt-2'
                    )}
                    id='password-error'
                  >
                    {errors?.password?.message}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor='confirm-password'
                    className='block text-sm mb-2'
                  >
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <input
                      type='password'
                      id='confirm-password'
                      {...register('confirmPassword')}
                      className={clsx(
                        errors?.confirmPassword
                          ? 'border-red-500 text-red-600 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500',
                        'py-3 px-4 block w-full rounded-md text-sm'
                      )}
                      aria-describedby='confirm-password-error'
                    />
                    <div
                      className={clsx(
                        errors?.confirmPassword ? 'flex items-start' : 'hidden',
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
                      errors?.confirmPassword ? '' : 'hidden',
                      'text-xs text-red-600 mt-2'
                    )}
                    id='confirm-password-error'
                  >
                    {errors?.confirmPassword?.message}
                  </p>
                </div>

                <button
                  type='submit'
                  className='py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm'
                >
                  Summon
                </button>
              </div>
            </form>
          </div>
        </Card>
      </main>
    </>
  );
};

export default SummonPage;
