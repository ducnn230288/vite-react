import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Form as AntForm, Tabs } from 'antd';

import { User } from '@svgs';
import { Form } from '@core/form';
import { Button } from '@core/button';
import { GlobalFacade } from '@store';
import { languages, language, routerLinks } from '@utils';

const Page = () => {
  const { t } = useTranslation();
  const { user, isLoading, profile, status } = GlobalFacade();
  const globalFacade = GlobalFacade();
  const navigate = useNavigate();
  const lang = languages.indexOf(location.pathname.split('/')[1]) > -1 ? location.pathname.split('/')[1] : language;

  const [forms] = AntForm.useForm();
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  const [activeKey, setActiveKey] = useState<string>(localStorage.getItem('activeStoreTab') || '1');

  useEffect(() => {
    profile();
  }, []);

  useEffect(() => {
    switch (status) {
      case 'putProfile.fulfilled':
        profile();
        break;
    }
  }, [status]);

  useEffect(() => {
    if (tab) {
      setActiveKey(tab);
    }
    const navList = document.querySelector<HTMLElement>('.ant-tabs-nav-list')!;
    const mediaQuery = window.matchMedia('(max-width: 375px)');

    if (tab === '2' && mediaQuery.matches) {
      navList.style.transform = 'translate(-49px, 0px)';
    } else {
      navList.style.transform = 'translate(0px, 0px)';
    }
  }, [tab]);

  const onChangeTab = (key: string) => {
    setActiveKey(key);
    localStorage.setItem('activeStoreTab', key);
    navigate(`/${lang}${routerLinks('MyProfile')}?tab=${key}`);
  };

  const [image, setImage] = useState('globalFacade.user?.profileImage');
  const handleSubmit = (values: any) => {
    globalFacade.putProfile({ ...values, image });
  };

  return (
    <Fragment>
      <div className="flex lg:flex-row flex-col w-full">
        <div className="flex-initial lg:w-[350px] mr-5 lg:rounded-xl w-full">
          <Form
            values={{ ...user }}
            formAnt={forms}
            className="text-center items-centers text-xl font-bold text-slate-700 form-profile form-myprofile"
            columns={[
              {
                title: '',
                name: 'avatar',
                formItem: {
                  type: 'upload',
                  mode: 'multiple',
                  render: (form, values) => {
                    return (
                      <div></div>
                      // <Upload multiple value={image} onChange={(values => setImage(values[values.length - 1]?.[0]))} />
                    );
                  },
                },
              },
              {
                title: 'routes.admin.user.Full name',
                name: 'name',
                formItem: {
                  render: (form, values) => {
                    return values.name;
                  },
                },
              },
              {
                title: 'user.role',
                name: 'userRole',
                formItem: {
                  render: (item: any, values: any, reRender) => {
                    return (
                      <div className="flex w-full flex-row justify-center pt-2 font-normal pb-3">
                        <User className="w-5 h-5 mr-2 fill-slate-500" />
                        <div className="text-base text-gray-500">{t('user.RoleUser.ADMIN')}</div>
                      </div>
                    );
                  },
                },
              },
            ]}
            disableSubmit={isLoading}
          />
        </div>
        <div className="flex-1 lg:rounded-xl w-auto form-myprofile">
          <Tabs onTabClick={(key: string) => onChangeTab(key)} activeKey={activeKey} size="large" className="profile">
            <Tabs.TabPane tab={t('routes.admin.Layout.My Profile')} key="1">
              <Form
                values={{ ...user }}
                columns={[
                  {
                    title: 'routes.admin.user.Full name',
                    name: 'name',
                    formItem: {
                      col: 12,
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
                    title: 'routes.admin.user.Phone Number',
                    name: 'phoneNumber',
                    formItem: {
                      col: 6,
                      rules: [{ type: 'required' }, { type: 'phone', min: 10, max: 15 }],
                    },
                  },
                  {
                    title: 'routes.admin.user.Description',
                    name: 'description',
                    formItem: {
                      type: 'textarea',
                    },
                  },
                ]}
                disableSubmit={isLoading}
                handSubmit={handleSubmit}
                extendButton={(form) => (
                  <Button
                    text={t('components.datatable.cancel')}
                    className={'md:w-32 justify-center out-line max-sm:w-3/5'}
                    onClick={() => {
                      navigate(`/${lang}${routerLinks('MyProfile')}`);
                    }}
                  />
                )}
              />
            </Tabs.TabPane>

            <Tabs.TabPane tab={t('routes.admin.Layout.Change Password')} key="2">
              <div className="form-profile-password">
                <Form
                  values={{ ...user }}
                  columns={[
                    {
                      title: 'columns.auth.login.password',
                      name: 'password',
                      formItem: {
                        notDefaultValid: true,
                        col: 12,
                        type: 'password',
                        rules: [{ type: 'required', message: 'components.form.ruleRequiredPassword' }],
                      },
                    },
                    {
                      title: 'columns.auth.login.New password',
                      name: 'passwordNew',
                      formItem: {
                        col: 12,
                        type: 'password',
                        rules: [{ type: 'required', message: 'components.form.ruleRequiredPassword' }],
                      },
                    },
                    {
                      title: 'columns.auth.login.Confirm Password',
                      name: 'passwordComfirm',
                      formItem: {
                        notDefaultValid: true,
                        col: 12,
                        type: 'password',
                        rules: [
                          {
                            type: 'custom',
                            validator: ({ getFieldValue }) => ({
                              validator(rule, value: string) {
                                const errorMsg = t('columns.auth.placeholder.subConfirm');
                                if (!value || getFieldValue('passwordNew') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error(errorMsg));
                              },
                            }),
                          },
                          { type: 'required', message: 'components.form.ruleRequiredPassword' },
                        ],
                      },
                    },
                  ]}
                  disableSubmit={isLoading}
                  extendButton={(form) => (
                    <Button
                      text={t('components.datatable.cancel')}
                      className={'md:min-w-[8rem] justify-center out-line max-sm:w-3/5'}
                      onClick={() => {
                        navigate(`/${lang}${routerLinks('MyProfile')}`);
                      }}
                    />
                  )}
                  textSubmit="routes.admin.Layout.Change Password"
                  handSubmit={() => 'setPassword'}
                />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
