import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import slug from 'slug';
import { Spin } from 'antd';

import { Code, CodeFacade, CodeTypeFacade, GlobalFacade } from '@store';
import { lang, routerLinks } from '@utils';
import { Button } from '@core/button';
import { Form } from '@core/form';
import { EStatusState, EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { id, type } = useParams();
  const codeFacade = CodeFacade();
  const { set } = GlobalFacade();
  const param = JSON.parse(codeFacade.queryParams || `{"filter":"{\\"type\\":\\"${type}\\"}"}`);
  useEffect(() => {
    if (id) codeFacade.getById({ id });
    else codeFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Code', link: '' },
        { title: id ? 'pages.Code/Edit' : 'pages.Code/Add', link: '' },
      ],
    });
  }, [id]);

  const navigate = useNavigate();
  const isBack = useRef(true);
  useEffect(() => {
    switch (codeFacade.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          if (id) navigate(`/${lang}${routerLinks('Code')}/${type}/add`);
          else codeFacade.set({ data: {} });
        }
        break;
    }
  }, [codeFacade.status]);

  const handleBack = () => {
    codeFacade.set({ status: EStatusState.idle });
    navigate(`/${lang}${routerLinks('Code')}?${new URLSearchParams(param).toString()}`);
  };
  const handleSubmit = (values: Code) => {
    if (id) codeFacade.put({ ...values, id, type });
    else codeFacade.post({ ...values, type });
  };

  const codeTypeFacade = CodeTypeFacade();
  useEffect(() => {
    if (!codeTypeFacade.result?.data?.length) codeTypeFacade.get({});
  }, []);
  useEffect(() => {
    if (codeTypeFacade.result?.data?.length) {
      set({ titleOption: { type: codeTypeFacade.result?.data?.filter((item) => item.code === type)[0]?.name } });
      if (!codeTypeFacade?.result?.data?.filter((item) => item.code === type).length) {
        navigate({
          pathname: location.hash
            .substring(1)
            .replace(`/${type}/`, id && codeFacade.data?.type ? `/${codeFacade.data?.type}/` : '/position/'),
        });
      }
    }
  }, [codeTypeFacade.result]);

  const { t } = useTranslation();
  return (
    <div className={'max-w-2xl mx-auto bg-white p-4 shadow rounded-xl'}>
      <Spin spinning={codeFacade.isLoading}>
        <Form
          values={{ ...codeFacade.data }}
          className="intro-x"
          columns={[
            {
              title: 'routes.admin.Code.Name',
              name: 'name',
              formItem: {
                col: 6,
                rules: [{ type: EFormRuleType.required }],
                onBlur: (e, form) => {
                  if (e.target.value && !form.getFieldValue('code')) {
                    form.setFieldValue('code', slug(e.target.value).toUpperCase());
                  }
                },
              },
            },
            {
              title: 'titles.Code',
              name: 'code',
              formItem: {
                col: 6,
                rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.max, value: 100 }],
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
          disableSubmit={codeFacade.isLoading}
          handCancel={handleBack}
        />
      </Spin>
    </div>
  );
};
export default Page;
