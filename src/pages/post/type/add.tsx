import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Spin } from 'antd';
import slug from 'slug';

import { GlobalFacade, PostType, PostTypeFacade } from '@store';
import { lang, routerLinks } from '@utils';
import { Button } from '@core/button';
import { Form } from '@core/form';
import { EStatusState, EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { id } = useParams();
  const postTypeFacade = PostTypeFacade();
  const { set } = GlobalFacade();
  const isReload = useRef(false);
  const param = JSON.parse(postTypeFacade.queryParams || '{}');
  useEffect(() => {
    if (id) postTypeFacade.getById({ id });
    else postTypeFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Post', link: '' },
        { title: id ? 'pages.Post/Edit' : 'pages.Post/Add', link: '' },
      ],
    });
    return () => {
      isReload.current && postTypeFacade.get(param);
    };
  }, [id]);

  const navigate = useNavigate();
  const isBack = useRef(true);
  useEffect(() => {
    switch (postTypeFacade.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
        postTypeFacade.get(JSON.parse(postTypeFacade.queryParams || '{}'));
        if (Object.keys(param).length > 0) isReload.current = true;

        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          navigate(`/${lang}${routerLinks('Post')}/add`);
        }
        break;
    }
  }, [postTypeFacade.status]);

  const handleBack = () => navigate(`/${lang}${routerLinks('Post')}?${new URLSearchParams(param).toString()}`);

  const handleSubmit = (values: PostType) => {
    if (id) postTypeFacade.put({ ...values, id });
    else postTypeFacade.post(values);
  };

  const { t } = useTranslation();
  return (
    <div className={'max-w-3xl mx-auto bg-white p-4 shadow rounded-xl'}>
      <Spin spinning={postTypeFacade.isLoading}>
        <Form
          values={{ ...postTypeFacade.data }}
          className="intro-x"
          columns={[
            {
              title: 'Name',
              name: 'name',
              formItem: {
                rules: [{ type: EFormRuleType.required }],
                onBlur: (e, form) => {
                  if (e.target.value && !form.getFieldValue('code'))
                    form.setFieldValue('code', slug(e.target.value).toUpperCase());
                },
              },
            },
            {
              title: 'Code',
              name: 'code',
              formItem: {
                rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.max, value: 100 }],
                type: id ? EFormType.hidden : EFormType.text,
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
          disableSubmit={postTypeFacade.isLoading}
          handCancel={handleBack}
        />
      </Spin>
    </div>
  );
};
export default Page;
