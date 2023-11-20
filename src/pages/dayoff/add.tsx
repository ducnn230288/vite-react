import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Spin } from 'antd';

import { Button } from '@core/button';
import { Form } from '@core/form';
import { GlobalFacade, DayoffFacade } from '@store';
import { routerLinks, lang } from '@utils';
import { EStatusState, EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { id } = useParams();
  const dayoffFacade = DayoffFacade();
  const { user, profile, set } = GlobalFacade();
  const isBack = useRef(true);
  const param = JSON.parse(dayoffFacade.queryParams || '{}');
  useEffect(() => {
    if (id) dayoffFacade.getById({ id });
    else dayoffFacade.set({ data: undefined });
    profile();
    set({
      breadcrumbs: [
        { title: 'titles.DayOff', link: '' },
        { title: 'titles.DayOff/List', link: '' },
        { title: id ? 'pages.DayOff/Edit' : 'pages.DayOff/Add', link: '' },
      ],
    });
  }, [id]);

  const navigate = useNavigate();
  useEffect(() => {
    switch (dayoffFacade.status) {
      case EStatusState.putFulfilled:
      case EStatusState.postFulfilled:
        if (isBack.current) handleBack();
        else {
          isBack.current = true;
          if (id) navigate(`/${lang}${routerLinks('DayOff/Add')}`);
          else dayoffFacade.set({ data: undefined });
        }
        profile();
        break;
    }
  }, [dayoffFacade.status]);

  const handleBack = () => {
    dayoffFacade.set({ status: EStatusState.idle });
    navigate(`/${lang}${routerLinks('DayOff/List')}?${new URLSearchParams(param).toString()}`);
  };
  const handleSubmit = (values: any) => {
    if (id) dayoffFacade.put(values);
    else dayoffFacade.post(values);
  };

  const { t } = useTranslation();
  const listType = [
    {
      value: 1,
      label: t('routes.admin.dayoff.register.Annual Leave'),
      disabled: user!.dateLeave! - user!.dateOff! <= 0,
    },
    { value: 2, label: t('routes.admin.dayoff.register.Leave without Pay') },
    { value: 3, label: t('routes.admin.dayoff.register.Remote') },
  ];
  const listTime = [
    { value: 0, label: t('routes.admin.dayoff.register.All day'), disabled: false },
    { value: 1, label: t('routes.admin.dayoff.register.Morning') },
    { value: 2, label: t('routes.admin.dayoff.register.Afternoon') },
  ];
  return (
    <div className={'max-w-2xl mx-auto bg-white p-4 shadow rounded-xl'}>
      {!!user && (
        <Spin spinning={dayoffFacade.isLoading}>
          <div className="text-xl font-bold hidden sm:block mb-5">
            {!id
              ? t('routes.admin.Layout.Apply for leave') +
                ' ( ' +
                (user!.dateLeave! - user!.dateOff! > 0 ? user!.dateLeave! - user!.dateOff! : 0) +
                ' ' +
                t('routes.admin.Layout.Day') +
                ') '
              : ''}
          </div>
          <Form
            values={{ ...dayoffFacade.data }}
            className="intro-x"
            columns={[
              {
                name: 'type',
                title: 'routes.admin.dayoff.register.Leave Type',
                formItem: {
                  type: EFormType.select,
                  col: 6,
                  rules: [{ type: EFormRuleType.required }],
                  list: listType || [],
                  onChange: (value: number, form: any) => {
                    const dateLeave = form.getFieldValue('dateLeave');
                    if (
                      value === 1 &&
                      dateLeave &&
                      user.dateLeave! > user.dateOff! &&
                      dateLeave[1].diff(dateLeave[0], 'days') > user.dateLeave! - user.dateOff!
                    ) {
                      listTime[0].disabled = value === 1 ? user.dateLeave! - user.dateOff! < 1 : false;
                      form.resetFields(['dateLeave', 'time']);
                    }
                  },
                },
              },
              {
                name: 'time',
                title: 'routes.admin.dayoff.register.Time',
                formItem: {
                  type: EFormType.select,
                  col: 6,
                  rules: [{ type: EFormRuleType.required }],
                  disabled: (values: any, form: any) =>
                    form.getFieldValue('date') &&
                    form.getFieldValue('date')[1].diff(form.getFieldValue('date')[0], 'days') > 0,
                  onChange: (value: number, form: any) => {
                    form.resetFields(['dateLeave']);
                  },
                  list: listTime || [],
                },
              },
              {
                title: 'routes.admin.dayoff.Leave Date',
                name: 'dateLeave',
                formItem: {
                  type: EFormType.dateRange,
                  rules: [{ type: EFormRuleType.required }],
                  disabledDate: (current, form) => {
                    if (
                      current.startOf('day').toString() !== current.startOf('week').toString() &&
                      current.endOf('day').toString() !== current.endOf('week').toString()
                    ) {
                      const dateLeave = form.getFieldValue('dateLeave');
                      if (dateLeave && !dateLeave[0]) {
                        return false;
                      }
                      const type = form.getFieldValue('type');
                      if (dateLeave && (!type || type === 1)) {
                        let number;
                        const floorLeave = Math.floor(user.dateLeave! - user.dateOff!);

                        if (floorLeave < 7 && dateLeave[0].get('day') + floorLeave < 7) number = -1;
                        else number = Math.floor((dateLeave[0].get('day') + 1 + floorLeave) / 7);
                        if (number > 1) {
                          number = number - 1 + (number - 1) * 2;
                        }
                        const day = dateLeave[0].add(floorLeave + number, 'days').get('day');
                        if (day === 6 || day === 0) {
                          number += day === 6 ? 2 : 1;
                        }

                        if (floorLeave > 12 && floorLeave < 15 && dateLeave[0].get('day') === 5) {
                          number += 1;
                        }
                        if (floorLeave > 13 && floorLeave < 15 && dateLeave[0].get('day') === 5) {
                          number += 1;
                        }
                        if (floorLeave > 14 && floorLeave < 17 && dateLeave[0].get('day') === 5) {
                          number -= 1;
                        }

                        if (floorLeave > 13 && floorLeave < 16 && dateLeave[0].get('day') === 4) {
                          number += 1;
                        }
                        if (floorLeave > 14 && floorLeave < 16 && dateLeave[0].get('day') === 4) {
                          number += 1;
                        }
                        if (floorLeave > 15 && dateLeave[0].get('day') === 4) {
                          number -= 1;
                        }
                        if (floorLeave > 16 && dateLeave[0].get('day') === 4) {
                          number -= 1;
                        }

                        if (floorLeave > 14 && floorLeave < 17 && dateLeave[0].get('day') === 3) {
                          number += 1;
                        }
                        if (floorLeave > 15 && floorLeave < 17 && dateLeave[0].get('day') === 3) {
                          number += 1;
                        }
                        if (floorLeave > 16 && dateLeave[0].get('day') === 3) {
                          number -= 1;
                        }

                        if (floorLeave > 15 && dateLeave[0].get('day') === 2) {
                          number += 1;
                        }
                        if (floorLeave > 16 && dateLeave[0].get('day') === 2) {
                          number += 1;
                        }

                        if (floorLeave > 16 && dateLeave[0].get('day') === 1) {
                          number += 1;
                        }

                        return dateLeave[0] && current.diff(dateLeave[0], 'days') > floorLeave + number;
                      }
                      return false;
                    }
                    return true;
                  },
                  onChange: (value: any[], form) => {
                    if (value && value.length === 2 && value[1].diff(value[0], 'days') > 0) {
                      form.setFieldValue('time', 0);
                    }
                  },
                },
              },
              {
                name: 'reason',
                title: 'routes.admin.dayoff.Reason',
                formItem: {
                  // col: 8,
                  type: EFormType.textarea,
                  rules: [{ type: EFormRuleType.required }],
                },
              },
              // {
              //   name: 'image',
              //   title: 'dayoff.register.Upload screenshot',
              //   formItem: {
              //     col: 4,
              //     type: 'upload',
              //   },
              // },
            ]}
            extendButton={(form) => (
              <div className="flex">
                <Button
                  text={t('components.form.modal.cancel')}
                  className="md:min-w-[12rem] !bg-red-600 w-full justify-center mr-2"
                  onClick={handleBack}
                />
                <Button
                  text={t('components.button.Save and Add new')}
                  className={'md:min-w-[12rem] w-full justify-center out-line'}
                  onClick={() => {
                    form.submit();
                    isBack.current = false;
                  }}
                />
              </div>
            )}
            handSubmit={handleSubmit}
            disableSubmit={dayoffFacade.isLoading}
          />
        </Spin>
      )}
    </div>
  );
};
export default Page;
