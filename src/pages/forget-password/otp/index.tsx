import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'i18next';

import { Spin } from 'antd';
import { Form } from '@core/form';
import { GlobalFacade } from '@store';
import { routerLinks, language, languages } from '@utils';

const Page = () => {
  const navigate = useNavigate();
  const globalFacade = GlobalFacade();
  const { isLoading, status, data } = globalFacade;
  const lang = languages.indexOf(location.pathname.split('/')[1]) > -1 ? location.pathname.split('/')[1] : language;

  useEffect(() => {
    console.log(status);
    if (status === 'verifyForgotPassword.fulfilled') {
      navigate(`/${lang}${routerLinks('SetPassword')}`);
    }
  }, [status]);

  console.log(data);

  return (
    <Fragment>
      <div className="text-center mb-8">
        <h1 className="intro-x text-3xl mb-8 font-bold text-green-900 leading-8 md:text-5xl lg:leading-10">
          {t('routes.auth.login.Forgot Password')}
        </h1>
        <h5 className="intro-x font-normal text-green-900 ">{t('routes.auth.reset-password.subEmail')}</h5>
      </div>
      <div className="mx-auto lg:w-full">
        <Spin spinning={isLoading}>
          <Form
            values={{ ...data }}
            className="intro-x form-forgetPassword"
            columns={[
              {
                name: 'otp',
                title: 'routes.auth.reset-password.Code OTP',
                formItem: {
                  rules: [{ type: 'required' }, { type: 'min', value: 6 }, { type: 'max', value: 6 }],
                },
              },
              {
                title: '',
                name: 'uuid',
                formItem: {
                  type: 'hidden',
                },
              },
              {
                title: '',
                name: 'email',
                formItem: {
                  type: 'hidden',
                },
              },
            ]}
            textSubmit={'routes.auth.reset-password.Send code'}
            handSubmit={(values) => 'verifyForgotPassword({ ...values })'}
            disableSubmit={isLoading}
          />
        </Spin>
        <div className="mt-3 text-center">
          <button
            className={'text-sky-600 font-normal underline hover:no-underline hover:text-sky-500'}
            onClick={() => navigate(`/${lang}${routerLinks('Login')}`)}
          >
            {' '}
            {t('routes.auth.reset-password.Go back to login')}
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
