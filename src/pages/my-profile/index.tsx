import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Form as AntForm, Tabs } from 'antd';

import { User } from '@svgs';
import { Form } from '@core/form';
import { Button } from '@core/button';
import { CodeFacade, EStatusGlobal, GlobalFacade } from '@store';
import { lang, routerLinks } from '@utils';
import { useSearchParams } from 'react-router-dom';
import { EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { user, isLoading, profile, status, putProfile, set, data } = GlobalFacade();
  useEffect(() => {
    profile();
    set({ breadcrumbs: [] });
  }, []);
  useEffect(() => {
    switch (status) {
      case EStatusGlobal.putProfileFulfilled:
        profile();
        break;
    }
  }, [status]);

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [activeKey, setActiveKey] = useState<string>(tab || '1');
  useEffect(() => {
    if (tab) setActiveKey(tab);
    const navList = document.querySelector<HTMLElement>('.ant-tabs-nav-list')!;
    const mediaQuery = window.matchMedia('(max-width: 375px)');

    if (tab === '2' && mediaQuery.matches) navList.style.transform = 'translate(-49px, 0px)';
    else navList.style.transform = 'translate(0px, 0px)';
  }, [tab]);

  const navigate = useNavigate();
  const onChangeTab = (key: string) => {
    setActiveKey(key);
    navigate(`/${lang}${routerLinks('MyProfile')}?tab=${key}`);
  };

  const [forms] = AntForm.useForm();

  const { t } = useTranslation();
  const roleName = useRef('');
  if (user?.role?.name) roleName.current = user.role.name;
  return (
    <Fragment>
      <div className="max-w-5xl mx-auto flex lg:flex-row flex-col w-full">
        <div className="flex-initial lg:w-[250px] mr-5 lg:rounded-xl w-full bg-white pt-6">
          <Form
            values={{ ...data }}
            formAnt={forms}
            className="text-center items-centers text-xl font-bold text-slate-700 profile"
            columns={[
              {
                title: '',
                name: 'avatar',
                formItem: {
                  type: EFormType.upload,
                },
              },
              {
                title: 'routes.admin.user.Full name',
                name: 'name',
                formItem: {
                  render: (form, values) => (
                    <div>
                      {values.name}
                      <div className="flex w-full flex-row justify-center pt-2 font-normal pb-3">
                        <User className="w-5 h-5 mr-2 fill-slate-500" />
                        <div className="text-base text-gray-500">{roleName.current}</div>
                      </div>
                    </div>
                  ),
                },
              },
            ]}
            disableSubmit={isLoading}
          />
        </div>
        <div className="flex-1 lg:rounded-xl w-auto">
          <Tabs
            onTabClick={(key: string) => onChangeTab(key)}
            activeKey={activeKey}
            size="large"
            className="profile"
            items={[
              {
                key: '1',
                label: t('routes.admin.Layout.My Profile'),
                children: (
                  <div className={'bg-white rounded-b-xl p-5'}>
                    <Form
                      values={{ ...data }}
                      columns={[
                        {
                          title: 'routes.admin.user.Full name',
                          name: 'name',
                          formItem: {
                            col: 12,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'Email',
                          name: 'email',
                          formItem: {
                            col: 6,
                            rules: [
                              { type: EFormRuleType.required },
                              { type: EFormRuleType.email },
                              { type: EFormRuleType.min, value: 6 },
                            ],
                          },
                        },
                        {
                          title: 'routes.admin.user.Phone Number',
                          name: 'phoneNumber',
                          formItem: {
                            col: 6,
                            rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.phone, min: 10, max: 15 }],
                          },
                        },
                        {
                          title: 'routes.admin.user.Date of birth',
                          name: 'dob',
                          formItem: {
                            col: 6,
                            type: EFormType.date,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'routes.admin.user.Position',
                          name: 'positionCode',
                          formItem: {
                            col: 6,
                            type: EFormType.select,
                            rules: [{ type: EFormRuleType.required }],
                            convert: (data) =>
                              data?.map
                                ? data.map((_item: any) => (_item?.id !== undefined ? +_item.id : _item))
                                : data,
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
                          title: 'routes.admin.user.Description',
                          name: 'description',
                          formItem: {
                            type: EFormType.textarea,
                          },
                        },
                      ]}
                      disableSubmit={isLoading}
                      handSubmit={(values) => putProfile({ ...values, avatar: forms.getFieldValue('avatar')[0].url })}
                      extendButton={() => (
                        <Button
                          text={t('components.datatable.cancel')}
                          className={'md:w-32 justify-center out-line max-sm:w-3/5'}
                          onClick={() => {
                            navigate(`/${lang}${routerLinks('MyProfile')}`);
                          }}
                        />
                      )}
                    />
                  </div>
                ),
              },
              {
                key: '2',
                label: t('routes.admin.Layout.Change Password'),
                children: (
                  <div className={'bg-white rounded-b-xl p-5'}>
                    <Form
                      values={{ ...data }}
                      columns={[
                        {
                          title: 'columns.auth.login.password',
                          name: 'passwordOld',
                          formItem: {
                            notDefaultValid: true,
                            col: 12,
                            type: EFormType.password,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'columns.auth.login.New password',
                          name: 'password',
                          formItem: {
                            col: 12,
                            type: EFormType.password,
                            rules: [{ type: EFormRuleType.required }],
                          },
                        },
                        {
                          title: 'columns.auth.login.Confirm Password',
                          name: 'retypedPassword',
                          formItem: {
                            notDefaultValid: true,
                            col: 12,
                            type: EFormType.password,
                            rules: [
                              {
                                type: EFormRuleType.custom,
                                validator: ({ getFieldValue }) => ({
                                  validator(rule, value: string) {
                                    const errorMsg = t('components.form.ruleConfirmPassword');
                                    if (!value || getFieldValue('password') === value) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(errorMsg));
                                  },
                                }),
                              },
                              { type: EFormRuleType.required },
                            ],
                          },
                        },
                      ]}
                      disableSubmit={isLoading}
                      extendButton={() => (
                        <Button
                          text={t('components.datatable.cancel')}
                          className={'md:min-w-[8rem] justify-center out-line max-sm:w-3/5'}
                          onClick={() => {
                            navigate(`/${lang}${routerLinks('MyProfile')}`);
                          }}
                        />
                      )}
                      textSubmit="routes.admin.Layout.Change Password"
                      handSubmit={(values) => {
                        const { name, email, phoneNumber, dob, positionCode, description } = user!;
                        putProfile({ name, email, phoneNumber, dob, positionCode, description, ...values });
                      }}
                    />
                  </div>
                ),
              },
            ]}
          ></Tabs>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
