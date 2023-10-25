import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Spin } from 'antd';

import { DataType, DataTypeFacade, GlobalFacade } from '@store';
import { lang, routerLinks } from '@utils';
import { Button } from '@core/button';
import { Form } from '@core/form';
import { EStatusState, EFormRuleType } from '@models';

const Page = () => {
  const { id } = useParams();
  const dataTypeFacade = DataTypeFacade();
  const { set } = GlobalFacade();
  const isReload = useRef(false);
  const param = JSON.parse(dataTypeFacade.queryParams || '{}');
  useEffect(() => {
    if (id) dataTypeFacade.getById({ id });
    else dataTypeFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Data', link: '' },
        { title: id ? 'pages.Data/Edit' : 'pages.Data/Add', link: '' },
      ],
    });
    return () => {
      isReload.current && dataTypeFacade.get(param);
    };
  }, [id]);

  const navigate = useNavigate();
  const isBack = useRef(true);
  useEffect(() => {
    switch (dataTypeFacade.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
        dataTypeFacade.get(JSON.parse(dataTypeFacade.queryParams || '{}'));
        if (Object.keys(param).length > 0) isReload.current = true;

        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          navigate(`/${lang}${routerLinks('Data')}/add`);
        }
        break;
    }
  }, [dataTypeFacade.status]);

  const handleBack = () => navigate(`/${lang}${routerLinks('Data')}?${new URLSearchParams(param).toString()}`);

  const handleSubmit = (values: DataType) => {
    if (id) dataTypeFacade.put({ ...values, id });
    else dataTypeFacade.post(values);
  };

  const { t } = useTranslation();
  return (
    <div className={'max-w-3xl mx-auto bg-white p-4 shadow rounded-xl'}>
      <Spin spinning={dataTypeFacade.isLoading}>
        <Form
          values={{ ...dataTypeFacade.data }}
          className="intro-x"
          columns={[
            {
              title: 'Name',
              name: 'name',
              formItem: {
                rules: [{ type: EFormRuleType.required }],
              },
            },
            {
              title: 'Code',
              name: 'code',
              formItem: {
                rules: [{ type: EFormRuleType.required }],
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
          disableSubmit={dataTypeFacade.isLoading}
          handCancel={handleBack}
        />
      </Spin>
    </div>
  );
};
export default Page;
