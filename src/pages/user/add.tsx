import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Spin } from 'antd';

import { Avatar } from '@core/avatar';
import { UserRoleFacade, UserFacade, CodeFacade, User, GlobalFacade, UserTeamFacade, ManagerFacade } from '@store';
import { routerLinks, lang } from '@utils';
import { Button } from '@core/button';
import { Form } from '@core/form';
import { EStatusState, EFormRuleType, EFormType, EFormModeSelect } from '@models';


const Page = () => {
  const { id, roleCode } = useParams();
  const data: any = useRef();
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
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
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
    userFacade.set({ status: EStatusState.idle });
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
          pathname: location.hash
            .substring(1)
            .replace(`/${roleCode}/`, id && userFacade.data?.roleCode ? `/${userFacade.data?.roleCode}/` : '/staff/'),
        });
      }
    }
  }, [userRoleFacade.result]);
  data.current = userFacade.data;
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
                  { type:EFormRuleType.min, value: 6 }
                ],
              },
            },
            {
              title: 'columns.auth.login.password',
              name: 'password',
              formItem: {
                col: 6,
                type: EFormType.password,
                condition: (value: string, form, index: number, values: any) => !values?.id,
                rules: [
                  { type: EFormRuleType.required }, 
                  { type: EFormRuleType.min, value: 6 }
                ],
              },
            },
            {
              title: 'columns.auth.register.retypedPassword',
              name: 'retypedPassword',
              formItem: {
                placeholder: 'columns.auth.register.retypedPassword',
                col: 6,
                type: EFormType.password,
                condition: (value: string, form, index: number, values) => !values?.id,
                rules: [
                  { type: EFormRuleType.required },
                  {
                    type: EFormRuleType.custom,
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
                rules: [
                  { type: EFormRuleType.required }, 
                  { type: EFormRuleType.phone, min: 10, max: 15 }
                ],
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
                rules: [{ type: EFormRuleType.required}],
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
                type: EFormType.date,
                rules: [{ type: EFormRuleType.required }],
              },
            },
            {
              title: 'routes.admin.user.Team',
              name: 'teams',
              formItem: {
                col: 6,
                type: EFormType.select,
                mode: EFormModeSelect.multiple,
                get: {
                  facade: UserTeamFacade,
                  format: (item: any) => ({
                    label: item.name,
                    value: item.id,
                  }),
                  params: (fullTextSearch: string, getFieldValue: any) => ({
                    fullTextSearch,
                    extend: { id: getFieldValue('teamId') || undefined },
                  }),
                  data: () => data.current?.teams,
                },
              },
            },
            {
              title: 'routes.admin.team.Manager',
              name: 'managerId',
              formItem: {
                col: 6,
                type: EFormType.select,
                get: {
                  facade: ManagerFacade,
                  format: (item: any) => ({
                    label: <Avatar size={5} src={item?.avatar} text={item.name} />,
                    value: item.id,
                  }),
                  params: (fullTextSearch: string, getFieldValue: any) => ({
                    fullTextSearch,
                    filter: { roleCode: 'manager' },
                    skip: { id: getFieldValue('id') || undefined },
                  }),
                  data: () => data.current?.manager,
                },
              },
            },
            {
              name: 'dateLeave',
              title: 'routes.admin.dayoff.Leave Date',
              formItem: {
                condition: (value) => value !== undefined,
                type: EFormType.number,
                col: 6,
                mask: {
                  mask: '9{1,2}[.V{0,1}]',
                  definitions: {
                    V: {
                      validator: '[05]',
                    },
                  },
                },
                rules: [
                  { type: EFormRuleType.required },
                  {
                    type: EFormRuleType.custom,
                    validator: () => ({
                      validator(rule, value: string) {
                        if (parseFloat(value) < 17) return Promise.resolve();
                        else return Promise.reject(t('user.Leave date cannot exceed', { day: 17 }));
                      },
                    }),
                  },
                ],
              },
            },
            {
              title: 'routes.admin.user.Description',
              name: 'description',
              formItem: {
                // col: 8,
                type: EFormType.textarea,
              },
            },
            // {
            //   name: 'avatar',
            //   title: 'routes.admin.user.Upload avatar',
            //   formItem: {
            //     col: 4,
            //     type: 'upload',
            //   },
            // },
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
