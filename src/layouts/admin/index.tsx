import React, { PropsWithChildren, useEffect, useState, Fragment } from 'react';
import { Dropdown, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { Avatar } from '@core/avatar';
import { GlobalFacade } from '@store';
import { Key, Out, User, Arrow, Logo } from '@svgs';
import { routerLinks, lang } from '@utils';
import './index.less';
import Menu from './menu';

const Layout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation();
  const globalFacade = GlobalFacade();
  const { user, title, titleOption, breadcrumbs } = globalFacade;

  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, set_isCollapsed] = useState(window.innerWidth < 1025);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 640);
  const [, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (window.innerWidth < 1025 && !isCollapsed) {
      setTimeout(() => {
        set_isCollapsed(true);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    function handleResize() {
      if (window.innerWidth < 1025 && !isCollapsed) {
        set_isCollapsed(true);
      }
      set_isDesktop(window.innerWidth > 640);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    // socket.connect();
    // socket.on('error', (message) =>
    //   api.error({
    //     message,
    //     placement: 'topRight',
    //   }),
    // );
    return () => {
      window.removeEventListener('resize', handleResize, true);
      // socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1025 && !isCollapsed) {
      set_isCollapsed(true);
    }
  }, [location]);
  useEffect(() => {
    if (globalFacade.pathname && globalFacade.pathname !== location.hash.substring(1)) {
      globalFacade.set({ pathname: '' });
      navigate(globalFacade.pathname);
    }
  }, [globalFacade.pathname]);
  useEffect(() => {
    if (!!globalFacade.language && globalFacade.title) document.title = t('pages.' + globalFacade.title || '');
  }, [globalFacade.language]);
  const Header = ({ isCollapsed, isDesktop }: { isCollapsed: boolean; isDesktop: boolean }) => (
    <header
      className={classNames(
        'bg-white w-full h-16 transition-all duration-300 ease-in-out top-0 block sm:bg-gray-100 z-20 fixed lg:relative',
        {
          'pl-64': !isCollapsed && isDesktop,
          'pl-16': isCollapsed && isDesktop,
          'pl-28': !isDesktop,
        },
      )}
    >
      <div className="flex items-center justify-end sm:justify-between px-5 h-16">
        {title !== 'Dashboard' && (
          <div>
            <h1 className={'text-xl font-bold hidden sm:block'}>{t('pages.' + title, titleOption || {})}</h1>

            <div className={'hidden sm:flex items-center text-xs mt-0.5'}>
              {breadcrumbs?.map((item, i) => (
                <Fragment key={i}>
                  <span className={classNames({ 'text-gray-400': i < breadcrumbs.length - 1 })}>
                    {t(item.title, titleOption || {})}
                  </span>{' '}
                  {i < breadcrumbs.length - 1 && <Arrow className={'w-2.5 h-2.5 mx-1.5'} />}
                </Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-5 absolute right-6">
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: '0',
                  className: 'hover:!bg-white !border-b-slate-300 border-b !rounded-none',
                  label: (
                    <div className="flex">
                      <Avatar src={user?.avatar || ''} size={8} />
                      <div className="text-left leading-none mr-3 block pl-2">
                        <div className="font-semibold text-black text-sm leading-snug mb-0.5">{user?.name}</div>
                        <div className="text-gray-500 text-[10px]">{user?.email}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: '1',
                  className: 'h-11',
                  label: (
                    <div
                      className="flex"
                      onClick={() => navigate(`/${lang}${routerLinks('MyProfile')}?tab=1`, { replace: true })}
                    >
                      <div className="flex items-center">
                        <User className="w-6 h-6 pr-2 text-black" />
                      </div>
                      <div>{t('routes.admin.Layout.My Profile')}</div>
                    </div>
                  ),
                },
                {
                  key: '2',
                  className: 'h-11 !border-b-slate-300 border-b !rounded-none',
                  label: (
                    <div
                      className="flex"
                      onClick={() => navigate(`/${lang}${routerLinks('MyProfile')}?tab=2`, { replace: true })}
                    >
                      <div className="flex items-center">
                        <Key className="w-6 h-6 pr-2 text-black" />
                      </div>
                      <div>{t('routes.admin.Layout.Change Password')}</div>
                    </div>
                  ),
                },
                {
                  key: '3',
                  className: 'h-11',
                  label: (
                    <div
                      className="flex"
                      onClick={() => navigate(`/${lang}${routerLinks('Login')}`, { replace: true })}
                    >
                      <div className="flex items-center">
                        <Out className="w-6 h-6 pr-2 text-black" />
                      </div>
                      <div>{t('routes.admin.Layout.Sign out')}</div>
                    </div>
                  ),
                },
              ],
            }}
            placement="bottomRight"
          >
            <section className="flex items-center !rounded-full" id={'dropdown-profile'}>
              <Avatar src={user?.avatar || ''} size={10} />
            </section>
          </Dropdown>
        </div>
      </div>
    </header>
  );
  return (
    <main>
      {contextHolder}
      <div className="leading-5 leading-10" />
      <div className="h-16 relative">
        <div className="absolute top-0 left-0 right-0">
          <Header isCollapsed={isCollapsed} isDesktop={isDesktop} />
        </div>
      </div>
      <div
        className={classNames(
          'flex items-center justify-between bg-white sm:bg-teal-900 text-gray-800 hover:text-gray-500 h-16 fixed top-0 left-0 pr-5 pl-3 font-bold transition-all duration-300 ease-in-out rounded-tr-3xl z-20',
          {
            'w-64': !isCollapsed && isDesktop,
            'w-16': isCollapsed && isDesktop,
            'bg-teal-900': isDesktop,
            'bg-gray-100': !isDesktop,
          },
        )}
      >
        <div className="flex">
          <div
            className={classNames('hamburger sm:!hidden', {
              'is-active': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
            })}
            onClick={() => {
              set_isCollapsed(!isCollapsed), set_isDesktop(isDesktop);
            }}
          >
            <span className="line" />
            <span className="line" />
            <span className="line" />
          </div>

          <a href="/vn/dashboard" className="flex items-center">
            <Logo
              className={classNames('w-12 mr-3 rounded bg-slate-200', {
                'opacity-100 text-lg w-12': (!isCollapsed && isDesktop) || (isCollapsed && !isDesktop),
                'opacity-0 text-[0px] hidden': isCollapsed && isDesktop,
              })}
            />
            {/* <img
              src={Logo}
              className={classNames('w-12 mr-3 rounded ', {
                'opacity-100 text-lg w-12': (!isCollapsed && isDesktop) || (isCollapsed && !isDesktop),
                'opacity-0 text-[0px] hidden': isCollapsed && isDesktop,
              })}
            ></img> */}
            <div
              id={'name-application'}
              className={classNames(
                'transition-all duration-300 ease-in-out absolute text-white left-16 overflow-ellipsis overflow-hidden ml-5',
                {
                  'opacity-100 text-2xl': !isCollapsed && isDesktop,
                  'opacity-0 text-[0px] hidden': isCollapsed || !isDesktop,
                },
              )}
            >
              Admin
            </div>
          </a>
        </div>
        <div
          className={classNames('relative', {
            'is-active': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
          })}
          onClick={() => {
            set_isCollapsed(!isCollapsed), set_isDesktop(isDesktop);
          }}
        >
          <Arrow
            className={classNames('w-9 text-white transition-all duration-300 ease-in-out', {
              'rotate-180': !isCollapsed && isDesktop,
            })}
          />
        </div>
      </div>
      <div
        className={classNames('fixed z-30 top-16 left-0 h-screen bg-teal-900 transition-all duration-300 ease-in-out', {
          'w-64': !isCollapsed,
          'w-16': isCollapsed,
          '!-left-20': isCollapsed && !isDesktop,
        })}
      >
        <Menu isCollapsed={isCollapsed} permission={user?.role?.permissions} />
      </div>
      {!isCollapsed && !isDesktop && (
        <div className={'w-full h-full fixed bg-black opacity-30 z-20'} onClick={() => set_isCollapsed(true)} />
      )}
      <section
        id={'main'}
        className={classNames(
          'px-2 sm:px-0 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-10 relative',
          {
            'ml-64': !isCollapsed && isDesktop,
            'ml-16': isCollapsed && isDesktop,
          },
        )}
      >
        <div className={' pb-10'}>
          <h1 className={'text-xl font-bold block sm:hidden'}>{t('pages.' + title, titleOption || {})}</h1>
          <div className={'flex items-center text-xs mt-0.5 pb-5 sm:hidden'}>
            {breadcrumbs?.map((item, i) => (
              <Fragment key={i}>
                <span className={classNames({ 'text-gray-400': i < breadcrumbs.length - 1 })}>
                  {t(item.title, titleOption || {})}
                </span>{' '}
                {i < breadcrumbs.length - 1 && <Arrow className={'w-2.5 h-2.5 mx-1.5'} />}
              </Fragment>
            ))}
          </div>
          {children}
        </div>

        <footer className="text-center pt-1.5 w-full -mt-8">
          {t('layout.footer', { year: new Date().getFullYear() })}
        </footer>
      </section>
    </main>
  );
};
export default Layout;
