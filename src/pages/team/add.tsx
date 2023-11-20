import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@core/button';
import { Form } from '@core/form';
import { GlobalFacade, UserFacade, UserTeamFacade } from '@store';
import { routerLinks, lang } from '@utils';
import { Spin } from 'antd';
import { EStatusState, EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { id } = useParams();
  const userTeamFacade = UserTeamFacade();
  const { set } = GlobalFacade();
  const param = JSON.parse(userTeamFacade.queryParams || '{}');
  useEffect(() => {
    if (id) userTeamFacade.getById({ id });
    else userTeamFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Team', link: '' },
        { title: id ? 'pages.Team/Edit' : 'pages.Team/Add', link: '' },
      ],
    });
  }, [id]);

  const navigate = useNavigate();
  const isBack = useRef(true);
  useEffect(() => {
    switch (userTeamFacade.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          if (id) navigate(`/${lang}${routerLinks('Team/Add')}`);
          else userTeamFacade.set({ data: {} });
        }
        break;
    }
  }, [userTeamFacade.status]);

  const handleBack = () => {
    userTeamFacade.set({ status: EStatusState.idle });
    navigate(`/${lang}${routerLinks('Team')}?${new URLSearchParams(param).toString()}`);
  };
  const handleSubmit = (values: any) => {
    if (id) userTeamFacade.put({ ...values, id });
    else userTeamFacade.post(values);
  };

  const { t } = useTranslation();
  return (
    <div className={'max-w-2xl mx-auto bg-white p-4 shadow rounded-xl'}>
      <Spin spinning={userTeamFacade.isLoading}>
        <Form
          values={{ ...userTeamFacade.data }}
          className="intro-x"
          columns={[
            {
              title: 'routes.admin.team.Name',
              name: 'name',
              formItem: {
                rules: [{ type: EFormRuleType.required }],
              },
            },
            {
              title: 'routes.admin.user.Description',
              name: 'description',
              formItem: {
                type: EFormType.textarea,
              },
            },
            {
              title: 'routes.admin.dayoff.Manager',
              name: 'managerId',
              formItem: {
                rules: [{ type: EFormRuleType.required }],
                type: EFormType.select,
                get: {
                  facade: UserFacade,
                  params: (fullTextSearch) => ({
                    fullTextSearch,
                    filter: { roleCode: 'manager' },
                    extend: {},
                  }),
                  format: (item: any) => ({
                    label: item.name,
                    value: item.id,
                  }),
                },
              },
            },
          ]}
          extendButton={(form) => (
            <Button
              text={t('components.button.Save and Add new')}
              className={'md:min-w-[12rem] w-full justify-center out-line'}
              onClick={() => {
                form.submit();
                isBack.current = false;
              }}
            />
          )}
          handSubmit={handleSubmit}
          disableSubmit={userTeamFacade.isLoading}
          handCancel={handleBack}
        />
      </Spin>
    </div>
  );
};
export default Page;
