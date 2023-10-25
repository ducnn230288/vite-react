import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import slug from 'slug';
import { Spin } from 'antd';

import { GlobalFacade, Post, PostFacade, PostTypeFacade } from '@store';
import { lang, routerLinks } from '@utils';
import { Button } from '@core/button';
import { Form } from '@core/form';
import { EStatusState, EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { id, type } = useParams();
  const postFacade = PostFacade();
  const { set } = GlobalFacade();
  const param = JSON.parse(postFacade.queryParams || `{"filter":"{\\"type\\":\\"${type}\\"}"}`);
  useEffect(() => {
    if (id) postFacade.getById({ id });
    else postFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Post', link: '' },
        { title: id ? 'pages.Post/Edit' : 'pages.Post/Add', link: '' },
      ],
    });
  }, [id]);

  const navigate = useNavigate();
  const isBack = useRef(true);
  useEffect(() => {
    switch (postFacade.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          if (id) navigate(`/${lang}${routerLinks('Post')}/${type}/add`);
          else postFacade.set({ data: {} });
        }
        break;
    }
  }, [postFacade.status]);

  const handleBack = () => {
    postFacade.set({ status: EStatusState.idle });
    navigate(`/${lang}${routerLinks('Post')}?${new URLSearchParams(param).toString()}`);
  };

  const handleSubmit = (values: Post) => {
    if (id) postFacade.put({ ...values, id, type });
    else postFacade.post({ ...values, type });
  };

  const postTypeFacade = PostTypeFacade();
  useEffect(() => {
    if (!postTypeFacade.result?.data?.length) postTypeFacade.get({});
  }, []);
  useEffect(() => {
    if (postTypeFacade.result?.data?.length) {
      set({ titleOption: { type: postTypeFacade.result?.data?.filter((item) => item.code === type)[0]?.name } });
      if (!postTypeFacade?.result?.data?.filter((item) => item.code === type).length) {
        navigate({
          pathname: location.hash
            .substring(1)
            .replace(`/${type}/`, id && postFacade.data?.type ? `/${postFacade.data?.type}/` : '/projects/'),
        });
      }
    }
  }, [postTypeFacade.result]);
  const { t } = useTranslation();
  return (
    <div className={'max-w-3xl mx-auto bg-white p-4 shadow rounded-xl relative'}>
      <Spin spinning={postFacade.isLoading}>
        <Form
          values={{ ...postFacade.data }}
          className="intro-x"
          columns={[
            {
              title: 'Created At',
              name: 'createdAt',
              formItem: {
                col: 6,
                type: EFormType.date,
              },
            },
            {
              title: 'Thumbnail Url',
              name: 'thumbnailUrl',
              formItem: {
                col: 6,
                type: EFormType.upload,
              },
            },
            {
              name: 'translations',
              title: '',
              formItem: {
                type: EFormType.tab,
                tab: 'language',
                list: [
                  { label: 'English', value: 'en' },
                  { label: 'Vietnam', value: 'vn' },
                ],
                column: [
                  { title: 'id', name: 'id', formItem: { type: EFormType.hidden } },
                  {
                    title: 'Name',
                    name: 'name',
                    formItem: {
                      col: 6,
                      rules: [{ type: EFormRuleType.required }],
                      onBlur: (e, form, name) => {
                        if (e.target.value && !form.getFieldValue(['translations', name[0], 'slug'])) {
                          form.setFieldValue(['translations', name[0], 'slug'], slug(e.target.value));
                        }
                      },
                    },
                  },
                  {
                    title: 'Slug',
                    name: 'slug',
                    formItem: {
                      col: 6,
                      rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.max, value: 100 }],
                    },
                  },
                  {
                    title: 'Description',
                    name: 'description',
                    formItem: {
                      type: EFormType.textarea,
                    },
                  },
                  {
                    title: 'Content',
                    name: 'content',
                    formItem: {
                      type: EFormType.editor,
                    },
                  },
                ],
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
          disableSubmit={postFacade.isLoading}
          handCancel={handleBack}
        />
      </Spin>
    </div>
  );
};
export default Page;
