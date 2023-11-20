import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Spin } from 'antd';
import dayjs from 'dayjs';

import { Booking, GlobalFacade, BookingFacade, CodeFacade, CodeTypeFacade } from '@store';
import { routerLinks, lang } from '@utils';
import { Button } from '@core/button';
import { Form } from '@core/form';
import { EStatusState, EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { id, date, typeCode } = useParams();
  const bookingFacade = BookingFacade();
  const { set } = GlobalFacade();
  const isReload = useRef(false);
  const param = JSON.parse(bookingFacade.queryParams || '{}');
  useEffect(() => {
    if (id) bookingFacade.getById({ id });
    else bookingFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.Booking', link: '' },
        { title: 'titles.Booking/List', link: '' },
        { title: 'pages.Booking/Detail', link: '' },
        { title: id ? 'pages.Booking/Edit' : 'pages.Booking/Add', link: '' },
      ],
      titleOption: { date },
    });
    return () => {
      isReload.current && bookingFacade.get(param);
    };
  }, [id]);

  const navigate = useNavigate();
  const isBack = useRef(true);
  useEffect(() => {
    switch (bookingFacade.status) {
      case EStatusState.postFulfilled:
      case EStatusState.putFulfilled:
        bookingFacade.get(JSON.parse(bookingFacade.queryParams || '{}'));
        if (Object.keys(param).length > 0) isReload.current = true;

        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          navigate(`/${lang}${routerLinks('Booking')}/${date}/add`);
        }
        break;
    }
  }, [bookingFacade.status]);

  const codeTypeFacade = CodeTypeFacade();
  useEffect(() => {
    if (!codeTypeFacade.result?.data?.length) codeTypeFacade.get({});
  }, []);
  useEffect(() => {
    if (codeTypeFacade.result?.data?.length) {
      set({
        titleOption: { date, type: codeTypeFacade.result?.data?.filter((item) => item.code === typeCode)[0]?.name },
      });
      if (!codeTypeFacade?.result?.data?.filter((item) => item.code === typeCode).length) {
        navigate({
          pathname: location.hash
            .substring(1)
            .replace(`/${typeCode}/`, id && bookingFacade.data?.type ? `/${bookingFacade.data?.type}/` : '/room/'),
        });
      }
    }
  }, [codeTypeFacade.result]);
  const handleBack = () => navigate(`/${lang}${routerLinks('Booking')}/${date}`);
  const handleSubmit = (values: Booking) => {
    values.startTime = dayjs(values.time![0].format('HH:mm') + ' ' + date).toISOString();
    values.endTime = dayjs(values.time![1].format('HH:mm') + ' ' + date).toISOString();
    delete values.time;
    if (id) bookingFacade.put({ ...values, typeCode, id });
    else bookingFacade.post({ ...values, typeCode });
  };

  const { t } = useTranslation();
  return (
    <div className={'max-w-3xl mx-auto bg-white p-4 shadow rounded-xl'}>
      <Spin spinning={bookingFacade.isLoading}>
        <Form
          values={{ ...bookingFacade.data }}
          className="intro-x"
          columns={[
            {
              title: 'Time',
              name: 'time',
              formItem: {
                type: EFormType.timeRange,
                rules: [{ type: EFormRuleType.required }],
                col: 6,
              },
            },
            {
              title: 'Room',
              name: 'itemCode',
              formItem: {
                type: EFormType.select,
                rules: [{ type: EFormRuleType.required }],
                col: 6,
                get: {
                  facade: CodeFacade,
                  params: (fullTextSearch: string) => ({
                    fullTextSearch,
                    filter: { type: typeCode },
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
              title: 'Name',
              name: 'name',
              formItem: {
                rules: [{ type: EFormRuleType.required }],
              },
            },

            {
              name: 'description',
              title: 'Description',
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
          disableSubmit={bookingFacade.isLoading}
          handCancel={handleBack}
        />
      </Spin>
    </div>
  );
};
export default Page;
