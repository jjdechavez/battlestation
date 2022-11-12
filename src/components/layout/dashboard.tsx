import { Fragment, ReactNode, MouseEvent, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
/* import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'; */
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { IconName } from '../../types/Icon';
import HeroIcon from '../base/HeroIcon';
import { signOut } from 'next-auth/react';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

function ActiveLink({
  href,
  icon,
  name,
}: {
  href: string;
  icon: IconName;
  name: string;
}) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href);
  };

  const isActive = router.asPath === href;

  return (
    <a
      href={href}
      onClick={handleClick}
      className={clsx(
        isActive
          ? 'bg-gray-900 transition duration-150 ease-in-out'
          : 'hover:bg-gray-700 hover:text-white',
        'flex items-center p-2 rounded-md group'
      )}
    >
      {icon && (
        <HeroIcon
          name={icon}
          className={clsx(
            isActive ? 'text-gray-300 ' : 'text-gray-400',
            'w-6 h-6 transition duration-150 ease-in-out group-hover:text-gray-300'
          )}
        />
      )}
      <span
        className={clsx(
          isActive ? 'text-gray-200' : 'text-gray-400',
          'pl-3 leading-5 transition duration-150 ease-in-out group-hover:text-gray-200'
        )}
      >
        {name}
      </span>
    </a>
  );
}

function NavLinks() {
  return (
    <nav className='px-2 mt-4 space-y-1 font-medium'>
      <ActiveLink href='/dashboard' icon='HomeIcon' name='Dashboard' />
      <ActiveLink
        href='/dashboard/workspace'
        icon='ClipboardDocumentListIcon'
        name='Workspace'
      />
      <ActiveLink href='/dashboard/users' icon='UserGroupIcon' name='Users' />
      <ActiveLink href='#' icon='FolderIcon' name='Projects' />
    </nav>
  );
}

function Brand({ children }: { children: ReactNode }) {
  return (
    <div className='flex items-center justify-between flex-shrink-0 h-16 px-4 bg-gray-900'>
      <a href='#' className='text-xl font-bold text-white flex'>
        <img
          src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
          alt='Company logo'
          className='w-auto h-8 mr-3'
        />
        workflow
      </a>
      {/* <!-- Close sidebar button --> */}
      {children}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children?: ReactNode;
}) {
  const router = useRouter();
  const [sidebarActive, setSidebarActive] = useState(false);

  return (
    <>
      <div className='flex min-h-screen bg-gray-100'>
        <div
          className={`fixed inset-0 z-40 ${
            !sidebarActive ? 'hidden' : ''
          } lg:hidden `}
        >
          <div
            onClick={() => setSidebarActive(false)}
            className='absolute inset-0 bg-gray-500 opacity-75'
          ></div>
        </div>
        <aside
          className={`fixed top-0 z-50 flex flex-col flex-shrink-0 w-64 h-screen overflow-y-hidden transition duration-150 ease-in-out transform bg-gray-800 lg:translate-x-0 lg:sticky ${
            sidebarActive ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Brand>
            {/* <!-- Close sidebar button --> */}
            <button
              onClick={() => setSidebarActive(false)}
              className='inline-flex items-center justify-center p-2 -mr-2 text-gray-300 transition duration-150 ease-in-out rounded-md hover:text-gray-100 hover:bg-gray-800 focus:outline-none focus:bg-gray-800  focus:text-gray-100 lg:hidden'
            >
              <HeroIcon name='XMarkIcon' className='block h-6 w-6' />
            </button>
          </Brand>
          <div className='flex-1 overflow-y-auto'>
            <NavLinks />
          </div>
        </aside>
        <div className='flex flex-col flex-1'>
          <header className='px-4 bg-white shadow'>
            <div className='flex items-center justify-between h-16'>
              {/* <!-- Open sidebar button --> */}
              <div className='flex items-center flex-1'>
                <button
                  onClick={() => setSidebarActive(true)}
                  className='inline-flex items-center justify-center p-2 -ml-2 text-gray-700 transition duration-150 ease-in-out rounded-md lg:hidden hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:text-gray-800'
                >
                  <HeroIcon name='Bars3Icon' className='w-6 h-6' />
                </button>
                <div className='relative w-full max-w-sm ml-4 md:max-w-md lg:ml-0'>
                  <input
                    type='text'
                    placeholder='Search'
                    className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 form-input rounded-md border-gray-300 sm:text-sm sm:leading-5'
                  />
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      className='w-5 h-5 text-gray-400'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <Menu as='div' className='relative ml-6'>
                <div>
                  <Menu.Button
                    // className="flex text-sm transition duration-150 ease-in-out border-2 border-transparent rounded-full focus:outline-none focus:border-gray-400"
                    className='max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                    id='user-menu'
                    aria-label='User menu'
                    aria-haspopup='true'
                  >
                    <span className='sr-only'>Open user menu</span>
                    <img
                      className='w-8 h-8 rounded-full'
                      src={user.imageUrl}
                      alt=''
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={clsx(
                            active ? 'bg-gray-100' : '',
                            'block w-full px-4 py-2 text-sm text-left text-gray-700 '
                          )}
                          onClick={() => router.push('/dashboard/profile')}
                        >
                          Your Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={clsx(
                            active ? 'bg-gray-100' : '',
                            'block w-full px-4 py-2 text-sm text-left text-gray-700 '
                          )}
                        >
                          Setting
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={clsx(
                            active ? 'bg-gray-100' : '',
                            'block w-full px-4 py-2 text-sm text-left text-gray-700 '
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </header>
          <main className='px-4 py-6 sm:px-6 lg:px-8'>{children}</main>
        </div>
      </div>
    </>
  );
}
