import React, { Fragment, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'i18next';

import { Spin } from 'antd';
import { Form } from '@core/form';
import { EStatusGlobal, GlobalFacade } from '@store';
import { lang, routerLinks } from '@utils';
import { EFormRuleType, EFormType } from '@models';

const Page = () => {
  const navigate = useNavigate();
  const { isLoading, status, data, otpConfirmation } = GlobalFacade();

  useEffect(() => {
    if (status === EStatusGlobal.otpConfirmationFulfilled) {
      navigate(`/${lang}${routerLinks('SetPassword')}`, { replace: true });
    }
  }, [status]);

  useEffect(() => {
    if (!data?.email) navigate(`/${lang}${routerLinks('ForgetPassword')}`, { replace: true });
  }, []);

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
                  rules: [
                    { type: EFormRuleType.required },
                    { type: EFormRuleType.min, value: 6 },
                    { type: EFormRuleType.max, value: 6 },
                  ],
                },
              },
              {
                title: '',
                name: 'email',
                formItem: {
                  type: EFormType.hidden,
                },
              },
            ]}
            textSubmit={'routes.auth.reset-password.Send code'}
            handSubmit={(values) => otpConfirmation({ ...values })}
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
