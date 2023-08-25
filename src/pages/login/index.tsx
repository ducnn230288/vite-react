import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Spin } from 'antd';
import { Form } from '@core/form';
import { GlobalFacade } from '@store';
import { routerLinks, language, languages } from '@utils';

const Page = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const globalFacade = GlobalFacade();
  const { isLoading, status, user, data, login, profile } = globalFacade;
  const lang = languages.indexOf(location.pathname.split('/')[1]) > -1 ? location.pathname.split('/')[1] : language;

  useEffect(() => {
    if (status === 'login.fulfilled' && user && Object.keys(user).length > 0) {
      navigate('/' + lang + '/dashboard', { replace: true });
      profile();
    }
  }, [status]);

  return (
    <Fragment>
      <div className="text-center mb-8">
        <h1
          className="intro-x text-3xl mb-8 font-bold text-teal-900 leading-8 md:text-5xl md:leading-10 lg:leading-10"
          id={'title-login'}
        >
          {t('routes.auth.login.title')}
        </h1>
        <h5 className="intro-x font-normal text-teal-900 ">{t('routes.auth.login.subTitle')}</h5>
      </div>
      <div className="mx-auto w-3/4 relative">
        <Spin spinning={isLoading}>
          <Form
            values={{ ...data }}
            className="intro-x form-login"
            columns={[
              {
                name: 'email',
                title: t('columns.auth.login.Username'),
                formItem: {
                  placeholder: 'columns.auth.login.Enter Username',
                  rules: [{ type: 'required' }, { type: 'email' }],
                },
              },
              {
                name: 'password',
                title: t('columns.auth.login.password'),
                formItem: {
                  placeholder: 'columns.auth.login.Enter Password',
                  type: 'password',
                  notDefaultValid: true,
                  rules: [{ type: 'required' }],
                },
              },
            ]}
            textSubmit={'routes.auth.login.Log In'}
            handSubmit={login}
            disableSubmit={isLoading}
          />
        </Spin>
        <div className="absolute  top-2/3 right-0 text-right">
          <button
            className={'text-teal-900 font-normal underline hover:no-underline mt-2'}
            onClick={() => navigate(`/${lang}${routerLinks('ForgetPassword')}`)}
          >
            {t('routes.auth.login.Forgot Password')}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
