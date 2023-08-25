import React, { Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';

import { Spin } from 'antd';
import { keyUser, routerLinks, language, languages } from '@utils';
import { useTranslation } from 'react-i18next';
import { GlobalFacade } from '@store';

const pages = [
  {
    layout: React.lazy(() => import('@layouts/auth')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Login'),
        component: React.lazy(() => import('@pages/login')),
        title: 'Login',
      },
      {
        path: routerLinks('ForgetPassword'),
        component: React.lazy(() => import('@pages/forget-password')),
        title: 'ForgetPassword',
      },
      {
        path: routerLinks('VerifyForotPassword'),
        component: React.lazy(() => import('@pages/forget-password/otp')),
        title: 'ForgetPassword',
      },
      {
        path: routerLinks('SetPassword'),
        component: React.lazy(() => import('@pages/forget-password/otp/set-password')),
        title: 'SetPassword',
      },
    ],
  },
  {
    layout: React.lazy(() => import('@layouts/admin')),
    isPublic: false,
    child: [
      {
        path: '/',
        component: routerLinks('DayOff/List'),
      },
      {
        path: routerLinks('MyProfile'),
        component: React.lazy(() => import('@pages/my-profile')),
        title: 'MyProfile',
      },
      {
        path: routerLinks('Code'),
        component: React.lazy(() => import('@pages/code')),
        title: 'Code',
      },
      {
        path: routerLinks('Code') + '/:type/add',
        component: React.lazy(() => import('@pages/code/add')),
        title: 'Code/Add',
      },
      {
        path: routerLinks('Code') + '/:type/:id/edit',
        component: React.lazy(() => import('@pages/code/add')),
        title: 'Code/Edit',
      },
      {
        path: routerLinks('Data'),
        component: React.lazy(() => import('@pages/data')),
        title: 'Data',
      },
      {
        path: routerLinks('Data') + '/:type/add',
        component: React.lazy(() => import('@pages/data/add')),
        title: 'Data/Add',
      },
      {
        path: routerLinks('Data') + '/:type/:id/edit',
        component: React.lazy(() => import('@pages/data/add')),
        title: 'Data/Edit',
      },
      {
        path: routerLinks('DataType') + '/add',
        component: React.lazy(() => import('@pages/data/type/add')),
        title: 'DataType/Add',
      },
      {
        path: routerLinks('DataType') + '/:id/edit',
        component: React.lazy(() => import('@pages/data/type/add')),
        title: 'DataType/Edit',
      },
      {
        path: routerLinks('Post'),
        component: React.lazy(() => import('@pages/post')),
        title: 'Post',
      },
      {
        path: routerLinks('Post') + '/:type/add',
        component: React.lazy(() => import('@pages/post/add')),
        title: 'Post/Add',
      },
      {
        path: routerLinks('Post') + '/:type/:id/edit',
        component: React.lazy(() => import('@pages/post/add')),
        title: 'Post/Edit',
      },
      {
        path: routerLinks('PostType') + '/add',
        component: React.lazy(() => import('@pages/post/type/add')),
        title: 'PostType/Add',
      },
      {
        path: routerLinks('PostType') + '/:id/edit',
        component: React.lazy(() => import('@pages/post/type/add')),
        title: 'PostType/Edit',
      },
      {
        path: routerLinks('User'),
        component: React.lazy(() => import('@pages/user')),
        title: 'User/List',
      },
      {
        path: routerLinks('User') + '/:roleCode/add',
        component: React.lazy(() => import('@pages/user/add')),
        title: 'User/Add',
      },
      {
        path: routerLinks('User') + '/:roleCode/:id/edit',
        component: React.lazy(() => import('@pages/user/add')),
        title: 'User/Edit',
      },
      {
        path: routerLinks('Team'),
        component: React.lazy(() => import('@pages/team')),
        title: 'Team',
      },
      {
        path: routerLinks('Team/Add'),
        component: React.lazy(() => import('@pages/team/add')),
        title: 'Team/Add',
      },
      {
        path: routerLinks('Team') + '/:id',
        component: React.lazy(() => import('@pages/team/add')),
        title: 'Team/Edit',
      },
      {
        path: routerLinks('DayOff') + '/:id',
        component: React.lazy(() => import('@pages/dayoff/add')),
        title: 'DayOff/Edit',
      },
      {
        path: routerLinks('DayOff/List'),
        component: React.lazy(() => import('@pages/dayoff')),
        title: 'DayOff/List',
      },
      {
        path: routerLinks('DayOff/Add'),
        component: React.lazy(() => import('@pages/dayoff/add')),
        title: 'DayOff/Add',
      },
      {
        path: routerLinks('DayOff/Detail') + '/:id',
        component: React.lazy(() => import('@pages/dayoff/detail')),
        title: 'DayOff/Detail',
      },
    ], // 💬 generate link to here
  },
];

const Layout = ({
  layout: Layout,
  isPublic = false,
}: {
  layout: React.LazyExoticComponent<({ children }: { children?: React.ReactNode }) => JSX.Element>;
  isPublic: boolean;
}) => {
  const lang = languages.indexOf(location.pathname.split('/')[1]) > -1 ? location.pathname.split('/')[1] : language;
  const { user } = GlobalFacade();
  if (isPublic || !!user?.email || !!JSON.parse(localStorage.getItem(keyUser) || '{}')?.email)
    return (
      <Layout>
        <Outlet />
      </Layout>
    );
  return <Navigate to={`/${lang}${routerLinks('Login')}`} />;
};

const Page = ({
  title = '',
  component: Comp,
}: {
  title: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
}) => {
  const { t } = useTranslation();
  const globalFacade = GlobalFacade();

  useEffect(() => {
    document.title = t('pages.' + title || '', globalFacade.titleOption || {});
    globalFacade.set({ title });
  }, [title, globalFacade.titleOption]);
  return <Comp />;
};
const Pages = () => {
  const lang = languages.indexOf(location.pathname.split('/')[1]) > -1 ? location.pathname.split('/')[1] : language;
  return (
    <HashRouter>
      <Routes>
        <Route path={'/:lang'}>
          {pages.map(({ layout, isPublic, child }, index) => (
            <Route key={index} element={<Layout layout={layout} isPublic={isPublic} />}>
              {child.map(({ path = '', title = '', component }, subIndex: number) => (
                <Route
                  key={path + subIndex}
                  path={'/:lang' + path}
                  element={
                    <Suspense
                      fallback={
                        <Spin>
                          <div className="w-screen h-screen" />
                        </Spin>
                      }
                    >
                      {typeof component === 'string' ? (
                        <Navigate to={'/' + lang + component} />
                      ) : (
                        <Page title={title} component={component} />
                      )}
                    </Suspense>
                  }
                />
              ))}
            </Route>
          ))}
        </Route>
        <Route path="*" element={<Navigate to={'/' + lang + '/'} />} />
      </Routes>
    </HashRouter>
  );
};

export default Pages;
