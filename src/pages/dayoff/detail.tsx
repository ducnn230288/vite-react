import React, { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Popconfirm, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { Avatar } from '@core/avatar';
import { Button } from '@core/button';
import { ModalForm } from '@core/modal/form';
import { GlobalFacade, DayoffFacade } from '@store';
import { CheckCircle, Times } from '@svgs';
import { keyRole, routerLinks, lang } from '@utils';
import { EFormRuleType, EFormType } from '@models';

const Page = () => {
  const { formatDate, user, set } = GlobalFacade();

  const { id } = useParams();
  const dayoffFacade = DayoffFacade();
  const isReload = useRef(false);
  const param = JSON.parse(dayoffFacade.queryParams || '{}');
  useEffect(() => {
    if (id) dayoffFacade.getById({ id });
    else dayoffFacade.set({ data: undefined });
    set({
      breadcrumbs: [
        { title: 'titles.DayOff', link: '' },
        { title: 'titles.DayOff/List', link: '' },
        { title: 'pages.DayOff/Detail', link: '' },
      ],
    });
    return () => {
      isReload.current && dayoffFacade.get(param);
    };
  }, [id]);

  const showDate = (dateLeaveStart?: Date, dateLeaveEnd?: Date) => {
    if (dateLeaveStart && dateLeaveEnd) {
      const startDate = dayjs(dateLeaveStart).format(formatDate);
      const endDate = dayjs(dateLeaveEnd).format(formatDate);
      return startDate + (startDate !== endDate ? ' => ' + endDate : '');
    }
  };

  const modalFormRejectRef: any = useRef();
  const { t } = useTranslation();
  const listType = [
    { value: 1, label: t('routes.admin.dayoff.register.Annual Leave'), disabled: false },
    { value: 2, label: t('routes.admin.dayoff.register.Leave without Pay') },
    { value: 3, label: t('routes.admin.dayoff.register.Remote') },
  ];
  const listTime = [
    { value: 0, label: t('routes.admin.dayoff.register.All day') },
    { value: 1, label: t('routes.admin.dayoff.register.Morning') },
    { value: 2, label: t('routes.admin.dayoff.register.Afternoon') },
  ];
  const { data } = dayoffFacade;
  const navigate = useNavigate();
  return (
    <Fragment>
      <ModalForm
        keyPut={'putStatus'}
        facade={dayoffFacade}
        keyState={'isVisibleReject'}
        ref={modalFormRejectRef}
        title={() => t('Từ chối phép')}
        columns={[
          {
            name: 'reasonReject',
            title: t('routes.admin.dayoff.Reason Reject'),
            formItem: {
              type: EFormType.textarea,
              rules: [{ type: EFormRuleType.required }],
            },
          },
        ]}
        widthModal={500}
        idElement={'dayoff'}
      />
      <div className={'max-w-4xl mx-auto bg-white p-4 shadow rounded-xl'}>
        <Spin spinning={dayoffFacade.isLoading}>
          <table className="w-full mx-auto text-sm text-left text-gray-500 border">
            <tbody>
              <tr className={'border-b'}>
                <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                  {t('titles.Code')}
                </th>
                <td className="py-4 px-6">{data?.code}</td>
              </tr>
              <tr className={'border-b'}>
                <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                  {t('routes.admin.dayoff.Fullname')}
                </th>
                <td className="py-4 px-6">
                  {data?.staff?.name && <Avatar src={data.staff!.avatar!} text={data.staff?.name} />}
                </td>
              </tr>
              <tr className={'border-b'}>
                <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                  {t('routes.admin.dayoff.Manager')}
                </th>
                <td className="py-4 px-6">
                  {data?.manager?.name && <Avatar src={data.manager!.avatar!} text={data.manager?.name} />}
                </td>
              </tr>
              <tr className={'border-b'}>
                <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                  {t('routes.admin.dayoff.Type')}
                </th>
                <td className="py-4 px-6">{listType.filter((item: any) => item.value === data?.type)[0]?.label}</td>
              </tr>
              <tr className={'border-b'}>
                <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                  {t('routes.admin.dayoff.Time')}
                </th>
                <td className="py-4 px-6">{listTime.filter((item: any) => item.value === data?.time)[0]?.label}</td>
              </tr>
              <tr className={'border-b'}>
                <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                  {t('routes.admin.dayoff.Leave Date')}
                </th>
                <td className="py-4 px-6">{showDate(data?.dateLeaveStart, data?.dateLeaveEnd)}</td>
              </tr>
              <tr className={'border-b'}>
                <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                  {t('routes.admin.dayoff.Reason')}
                </th>
                <td className="py-4 px-6 whitespace-pre">{data?.reason}</td>
              </tr>
              {data?.status !== 0 && (
                <Fragment>
                  <tr className={'border-b'}>
                    <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                      {t('routes.admin.dayoff.Status')}
                    </th>
                    <td className=" px-6">
                      {data?.status !== 0 &&
                        (data?.status === 1 ? (
                          <CheckCircle className="w-5 h-5 fill-green-500" />
                        ) : (
                          <Times className="w-5 h-5 fill-red-500" />
                        ))}
                    </td>
                  </tr>
                  <tr className={'border-b'}>
                    <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                      {t('routes.admin.dayoff.Approved At')}
                    </th>
                    <td className="py-4 px-6">{data?.approvedAt && dayjs(data.approvedAt).format(formatDate)}</td>
                  </tr>
                  <tr className={'border-b'}>
                    <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                      {t('routes.admin.dayoff.Approved By')}
                    </th>
                    <td className="py-4 px-6">
                      {data?.approvedBy?.name && (
                        <Avatar src={data?.approvedBy?.avatar} text={data?.approvedBy?.name} />
                      )}
                    </td>
                  </tr>
                </Fragment>
              )}
              {data?.status === -1 && (
                <tr className={'border-b'}>
                  <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">
                    {t('routes.admin.dayoff.Reason Reject')}
                  </th>
                  <td className="py-4 px-6">{data.reasonReject}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={'flex gap-2 justify-end mt-5'}>
            <Button
              className="right-32 md:min-w-[12rem] justify-center out-line"
              text={t('components.button.Back')}
              onClick={() => navigate(`/${lang}${routerLinks('DayOff/List')}?${new URLSearchParams(param).toString()}`)}
            />
            {user?.role?.permissions?.includes(keyRole.P_DAYOFF_UPDATE_STATUS) &&
              data?.status === 0 &&
              data.manager?.id === user.id && (
                <Popconfirm
                  placement="left"
                  title={t('Bạn có muốn duyệt?')}
                  onConfirm={() => {
                    dayoffFacade.putStatus({ id: data.id, status: 1 }),
                      navigate(`/${lang}${routerLinks('DayOff/List')}?${new URLSearchParams(param).toString()}`);
                  }}
                  okText={t('components.datatable.ok')}
                  cancelText={t('components.datatable.cancel')}
                >
                  <Button
                    className={'bg-teal-900 text-white md:min-w-[12rem] justify-center'}
                    icon={<CheckCircle className="w-5 h-5" />}
                    text={t('routes.admin.dayoff.Approve')}
                  />
                </Popconfirm>
              )}
            {user?.role?.permissions?.includes(keyRole.P_DAYOFF_UPDATE_STATUS) &&
              data?.status === 0 &&
              data.manager?.id === user.id && (
                <Button
                  className={'!bg-red-500 text-white md:min-w-[12rem] justify-center'}
                  icon={<Times className="w-5 h-5" />}
                  text={t('routes.admin.dayoff.Reject')}
                  onClick={() => modalFormRejectRef?.current?.handleEdit(data, false)}
                />
              )}
          </div>
        </Spin>
      </div>
    </Fragment>
  );
};
export default Page;
