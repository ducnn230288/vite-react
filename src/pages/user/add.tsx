import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Spin } from 'antd';

import { UserFacade, CodeFacade, User, GlobalFacade, UserRoleFacade } from '@store';
import { routerLinks, lang } from '@utils';
import { Button } from '@core/button';
import { Form } from '@core/form';

const Page = () => {
  const { id, roleCode } = useParams();
  const userFacade = UserFacade();
  const param = JSON.parse(userFacade.queryParams || `{"filter":"{\\"roleCode\\":\\"${roleCode}\\"}"}`);
  const { set } = GlobalFacade();
  useEffect(() => {
    if (id) userFacade.getById({ id });
    else userFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.User', link: '' },
        { title: id ? 'pages.User/Edit' : 'pages.User/Add', link: '' },
      ],
    });
  }, [id]);

  const navigate = useNavigate();
  const isBack = useRef(true);
  useEffect(() => {
    switch (userFacade.status) {
      case 'post.fulfilled':
      case 'put.fulfilled':
        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          if (id) navigate(`/${lang}${routerLinks('User')}/${roleCode}/add`);
          else userFacade.set({ data: {} });
        }
        break;
    }
  }, [userFacade.status]);

  const handleBack = () => {
    userFacade.set({ status: 'idle' });
    navigate(`/${lang}${routerLinks('User')}?${new URLSearchParams(param).toString()}`);
  };
  const handleSubmit = (values: User) => {
    if (id) userFacade.put({ ...values, id, roleCode });
    else userFacade.post({ ...values, roleCode });
  };
  const userRoleFacade = UserRoleFacade();
  useEffect(() => {
    if (!userRoleFacade.result?.data?.length) userRoleFacade.get({});
  }, []);
  useEffect(() => {
    if (userRoleFacade.result?.data?.length) {
      set({
        titleOption: { roleCode: userRoleFacade.result?.data?.filter((item) => item.code === roleCode)[0]?.name },
      });
      if (!userRoleFacade?.result?.data?.filter((item) => item.code === roleCode).length) {
        navigate({
          pathname: location.pathname.replace(
            `/${roleCode}/`,
            id && userFacade.data?.roleCode ? `/${userFacade.data?.roleCode}/` : '/staff/',
          ),
        });
      }
    }
  }, [userRoleFacade.result]);
  const { t } = useTranslation();
  return (
    <div className={'max-w-4xl mx-auto bg-white p-4 shadow rounded-xl'}>
      <Spin spinning={userFacade.isLoading}>
        <Form
          values={{ ...userFacade.data }}
          className="intro-x"
          columns={[
            {
              title: 'routes.admin.user.Full name',
              name: 'name',
              formItem: {
                col: 6,
                rules: [{ type: 'required' }],
              },
            },
            {
              title: 'Email',
              name: 'email',
              formItem: {
                col: 6,
                rules: [{ type: 'required' }, { type: 'email' }, { type: 'min', value: 6 }],
              },
            },
            {
              title: 'columns.auth.login.password',
              name: 'password',
              formItem: {
                col: 6,
                type: 'password',
                condition: (value: string, form, index: number, values: any) => !values?.id,
                rules: [{ type: 'required' }, { type: 'min', value: 6 }],
              },
            },
            {
              title: 'columns.auth.register.retypedPassword',
              name: 'retypedPassword',
              formItem: {
                placeholder: 'columns.auth.register.retypedPassword',
                col: 6,
                type: 'password',
                condition: (value: string, form, index: number, values) => !values?.id,
                rules: [
                  { type: 'required' },
                  {
                    type: 'custom',
                    validator: ({ getFieldValue }) => ({
                      validator(rule, value: string) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(t('components.form.ruleConfirmPassword'));
                      },
                    }),
                  },
                ],
              },
            },
            {
              title: 'Số điện thoại',
              name: 'phoneNumber',
              formItem: {
                col: 6,
                rules: [{ type: 'required' }, { type: 'phone', min: 10, max: 15 }],
              },
            },
            {
              title: 'routes.admin.user.Date of birth',
              name: 'dob',
              formItem: {
                col: 6,
                type: 'date',
                rules: [{ type: 'required' }],
              },
            },
            {
              title: 'routes.admin.user.Position',
              name: 'positionCode',
              formItem: {
                col: 6,
                type: 'select',
                rules: [{ type: 'required' }],
                convert: (data) =>
                  data?.map ? data.map((_item: any) => (_item?.id !== undefined ? +_item.id : _item)) : data,
                get: {
                  facade: CodeFacade,
                  params: (fullTextSearch: string) => ({
                    fullTextSearch,
                    filter: { type: 'position' },
                    extend: {},
                  }),
                  format: (item) => ({
                    label: item.name,
                    value: item.code,
                  }),
                },
              },
            },
            {
              title: 'routes.admin.user.Start Date',
              name: 'startDate',
              formItem: {
                col: 6,
                type: 'date',
                rules: [{ type: 'required' }],
              },
            },
            {
              title: 'routes.admin.user.Description',
              name: 'description',
              formItem: {
                col: 8,
                type: 'textarea',
              },
            },
            {
              name: 'avatar',
              title: 'routes.admin.user.Upload avatar',
              formItem: {
                col: 4,
                type: 'upload',
              },
            },
          ]}
          extendButton={(form) => (
            <Button
              text={t('components.button.Save and Add new')}
              className={'md:min-w-[12rem] justify-center out-line'}
              onClick={() => {
                form.submit();
                isBack.current = false;
              }}
            />
          )}
          handSubmit={handleSubmit}
          disableSubmit={userFacade.isLoading}
          handCancel={handleBack}
        />
      </Spin>
    </div>
  );
};
export default Page;
