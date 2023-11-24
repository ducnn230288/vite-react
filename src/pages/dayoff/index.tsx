import React, { useEffect, useRef } from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';

import { Avatar } from '@core/avatar';
import { Button } from '@core/button';
import { DataTable } from '@core/data-table';
import { DayoffFacade, GlobalFacade } from '@store';
import { CheckCircle, Plus, Spinner, Times, Trash } from '@svgs';
import { lang, keyRole, routerLinks, handleDownloadCSV, API } from '@utils';
import { Message } from '@core/message';
import { EStatusState, ETableFilterType, ETableAlign } from '@models';

const Page = () => {
  const { formatDate, user, set } = GlobalFacade();
  useEffect(() => {
    set({
      breadcrumbs: [
        { title: 'titles.DayOff', link: '' },
        { title: 'titles.DayOff/List', link: '' },
      ],
    });
  }, []);

  const dayoffFacade = DayoffFacade();
  useEffect(() => {
    switch (dayoffFacade.status) {
      case EStatusState.putFulfilled:
      case EStatusState.postFulfilled:
      case EStatusState.deleteFulfilled:
      case EStatusState.putStatusFulfilled:
        dataTableRef.current.onChange();
        break;
    }
  }, [dayoffFacade.status]);

  const dataTableRef: any = useRef();
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
    { value: 0, label: t('routes.admin.dayoff.register.All day') },
    { value: 1, label: t('routes.admin.dayoff.register.Morning') },
    { value: 2, label: t('routes.admin.dayoff.register.Afternoon') },
  ];
  const navigate = useNavigate();
  const param = JSON.parse(dayoffFacade.queryParams || '{}');
  return (
    <div className={'container mx-auto'}>
      <DataTable
        facade={dayoffFacade}
        showSearch={false}
        ref={dataTableRef}
        onRow={(data: any) => ({
          onDoubleClick: () => {
            navigate(`/${lang}${routerLinks('DayOff/Detail')}/${data.id}`);
          },
        })}
        xScroll={1400}
        pageSizeRender={(sizePage: number) => sizePage}
        pageSizeWidth={'50px'}
        paginationDescription={(from: number, to: number, total: number) =>
          t('routes.admin.Layout.DayOff', { from, to, total })
        }
        columns={[
          {
            title: 'titles.Code',
            name: 'code',
            tableItem: {
              sorter: true,
            },
          },
          {
            title: 'routes.admin.dayoff.Fullname',
            name: 'staff',
            tableItem: {
              sorter: true,
              render: (value, item) => item.staff?.name && <Avatar src={item.staff?.avatar} text={item.staff?.name} />,
            },
          },
          {
            title: 'routes.admin.dayoff.Manager',
            name: 'manager',
            tableItem: {
              // filter: {
              //   type: 'checkbox',
              //   name: 'teams',
              //   api: {
              //     link: () => routerLinks('UserTeam', 'api') + '/',
              //     format: (item: any) => ({
              //       label: item.name,
              //       value: item.id,
              //     }),
              //   },
              // },
              render: (text: any, item) =>
                item.manager?.name && <Avatar src={item.manager?.avatar} text={item.manager?.name} />,
            },
          },
          {
            title: 'routes.admin.dayoff.Type',
            name: 'type',
            tableItem: {
              width: 190,
              sorter: true,
              render: (text: string) =>
                text !== undefined ? listType.filter((item: any) => item.value === text)[0].label : '',
            },
          },
          {
            title: 'routes.admin.dayoff.Time',
            name: 'time',
            tableItem: {
              width: 110,
              sorter: true,
              render: (text: string) =>
                text !== undefined ? listTime.filter((item: any) => item.value === text)[0].label : '',
            },
          },
          {
            title: 'routes.admin.dayoff.Leave Date',
            name: 'dateLeaveStart',
            tableItem: {
              width: 210,
              filter: { type: ETableFilterType.date },
              sorter: true,
              render: (text: string, item: any) => {
                const startDate = dayjs(text).format(formatDate);
                const endDate = dayjs(item.dateLeaveEnd).format(formatDate);
                return startDate + (startDate !== endDate ? ' => ' + endDate : '');
              },
            },
          },
          {
            title: 'routes.admin.dayoff.Status',
            name: 'status',
            tableItem: {
              onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' } }),
              filter: {
                type: ETableFilterType.radio,
                list: [
                  { label: 'Pending', value: 0 },
                  { label: 'Approved', value: 1 },
                  { label: 'Rejected', value: -1 },
                ],
              },
              width: 130,
              sorter: true,
              render: (text: number) =>
                text !== 0 ? (
                  text === 1 ? (
                    <CheckCircle className="w-5 h-5 fill-green-500" />
                  ) : (
                    <Times className="w-5 h-5 fill-red-500" />
                  )
                ) : (
                  <Spinner className="w-5 h-5 fill-blue-600 animate-spin" />
                ),
            },
          },
          {
            title: 'routes.admin.dayoff.Approved Date',
            name: 'approvedAt',
            tableItem: {
              width: 180,
              filter: { type: ETableFilterType.date },
              sorter: true,
              render: (text: string) => (text ? dayjs(text).format(formatDate) : ''),
            },
          },
          {
            title: 'routes.admin.dayoff.Approved By',
            name: 'approvedBy',
            tableItem: {
              onCell: () => ({
                style: { paddingTop: '0.25rem', paddingBottom: 0 },
                onClick: async () => null,
              }),
              render: (value, item) =>
                item.approvedBy?.name && <Avatar src={item.approvedBy?.avatar} text={item.approvedBy?.name} />,
            },
          },
          {
            title: t('routes.admin.user.Action'),
            tableItem: user?.role?.permissions?.includes(keyRole.P_DAYOFF_DELETE)
              ? {
                  width: 90,
                  fixed: window.innerWidth > 767 ? 'right' : undefined,
                  align: ETableAlign.center,
                  onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' } }),
                  render: (text: string, data: any) => (
                    <div className={'flex justify-center'}>
                      {user?.role?.permissions?.includes(keyRole.P_DAYOFF_DELETE) &&
                        data.staff?.id === user.id &&
                        data.status === 0 && (
                          <Tooltip title={t('routes.admin.Layout.Delete')}>
                            <Popconfirm
                              placement="left"
                              title={t('components.datatable.areYouSureWant')}
                              onConfirm={() => dataTableRef?.current?.handleDelete!(data.id)}
                              okText={t('components.datatable.ok')}
                              cancelText={t('components.datatable.cancel')}
                            >
                              <button title={t('routes.admin.Layout.Delete') || ''}>
                                <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
                              </button>
                            </Popconfirm>
                          </Tooltip>
                        )}
                    </div>
                  ),
                }
              : undefined,
          },
        ]}
        rightHeader={
          <div className={'flex gap-3'}>
            {user?.role?.permissions?.includes(keyRole.P_DAYOFF_CREATE) && user.managerId && (
              <Button
                icon={<Plus className="icon-cud !h-5 !w-5" />}
                text={t('components.button.New')}
                onClick={() =>
                  navigate(`/${lang}${routerLinks('DayOff/Add')}?${new URLSearchParams(param).toString()}`)
                }
              />
            )}
            {user?.role?.permissions?.includes(keyRole.P_DAYOFF_EXPORT_EXCEL) && (
              <Button
                text={t('routes.admin.dayoff.Export dayoff')}
                onClick={() => handleDownloadCSV(routerLinks('User', 'api') + '/export-dayoff', 'export-dayoff')}
              />
            )}
            {user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
              <Button
                text={t('routes.admin.dayoff.Set date leave')}
                onClick={async () =>
                  await Message.confirm({
                    text: t('routes.admin.dayoff.Reset date leave for all users on the system'),
                    title: t('routes.admin.dayoff.Reset date leave'),
                    input: 'number',
                    preConfirm: async (dateLeave) =>
                      await API.put(routerLinks('User', 'api') + '/date-leave/' + dateLeave, {}, {}, {}, true),
                  })
                }
              />
            )}
          </div>
        }
      />
    </div>
  );
};
export default Page;
