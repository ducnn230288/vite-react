import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Popconfirm, Select, Spin, Tooltip } from 'antd';

import { Avatar } from '@core/avatar';
import { Button } from '@core/button';
import { DataTable } from '@core/data-table';

import { EStatusState, ETableAlign, ETableFilterType, TableRefObject } from '@models';
import { CodeFacade, GlobalFacade, UserFacade, UserRoleFacade } from '@store';
import { Check, Disable, Edit, Plus, Trash } from '@svgs';
import { keyRole, lang, routerLinks } from '@utils';
import classNames from 'classnames';
import { createSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const Page = () => {
  const userRoleFacade = UserRoleFacade();
  const { user, set, formatDate } = GlobalFacade();
  useEffect(() => {
    if (!userRoleFacade?.result?.data) userRoleFacade.get({});
    set({
      breadcrumbs: [
        { title: 'titles.User', link: '' },
        { title: 'titles.User/List', link: '' },
      ],
    });
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (
      userRoleFacade?.result?.data?.length &&
      !userRoleFacade?.result?.data?.filter((item) => item.code === request.filter.roleCode).length
    ) {
      navigate({
        pathname: `/${lang}${routerLinks('User')}`,
        search: `?${createSearchParams({ filter: '{"roleCode":"staff"}' })}`,
      });
      request.filter.roleCode = 'staff';
      dataTableRef?.current?.onChange(request);
    }
  }, [userRoleFacade?.result]);

  const userFacade = UserFacade();
  useEffect(() => {
    switch (userFacade.status) {
      case EStatusState.deleteFulfilled:
      case EStatusState.putDisableFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [userFacade.status]);
  const request = JSON.parse(userFacade?.queryParams || '{}');
  if (!request.filter || typeof request?.filter === 'string') request.filter = JSON.parse(request?.filter || '{}');
  const { t } = useTranslation();
  const dataTableRef = useRef<TableRefObject>(null);
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>Role</h3>
            {/*<div className="flex items-center">*/}
            {/*  <Button*/}
            {/*    icon={<Plus className="icon-cud !h-5 !w-5" />}*/}
            {/*    text={t('routes.admin.Layout.Add')}*/}
            {/*    onClick={() => navigate(`/${lang}${routerLinks('Code/Add')}`)}*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
          <Spin spinning={userRoleFacade.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              {userRoleFacade?.result?.data?.map((data, index) => (
                <div
                  key={data.id}
                  className={classNames(
                    { 'bg-gray-100': request.filter.roleCode === data.code },
                    'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                  )}
                >
                  <div
                    onClick={() => {
                      request.filter.roleCode = data.code;
                      dataTableRef?.current?.onChange(request);
                    }}
                    className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-4 py-2"
                  >
                    {index + 1}. {data.name}
                  </div>
                  {/*<span className="w-16 flex justify-end gap-1">*/}
                  {/*  {user?.role?.permissions?.includes(keyRole.P_USER_ROLE_UPDATE) && (*/}
                  {/*    <Tooltip title={t('routes.admin.Layout.Edit')}>*/}
                  {/*      <button*/}
                  {/*        className={'opacity-0 group-hover:opacity-100 transition-all duration-300 '}*/}
                  {/*        title={t('routes.admin.Layout.Edit') || ''}*/}
                  {/*        onClick={() => navigate(`/${lang}${routerLinks('Code')}/${data.id}/edit`)}*/}
                  {/*      >*/}
                  {/*        <Edit className="icon-cud bg-blue-600 hover:bg-blue-400" />*/}
                  {/*      </button>*/}
                  {/*    </Tooltip>*/}
                  {/*  )}*/}
                  {/*  {user?.role?.permissions?.includes(keyRole.P_USER_ROLE_DELETE) && (*/}
                  {/*    <Tooltip title={t('routes.admin.Layout.Delete')}>*/}
                  {/*      <Popconfirm*/}
                  {/*        placement="left"*/}
                  {/*        title={t('components.datatable.areYouSureWant')}*/}
                  {/*        onConfirm={() => dataTableRef?.current?.handleDelete!(data.id || '')}*/}
                  {/*        okText={t('components.datatable.ok')}*/}
                  {/*        cancelText={t('components.datatable.cancel')}*/}
                  {/*      >*/}
                  {/*        <button*/}
                  {/*          className={'opacity-0 group-hover:opacity-100 transition-all duration-300'}*/}
                  {/*          title={t('routes.admin.Layout.Delete') || ''}*/}
                  {/*        >*/}
                  {/*          <Trash className="icon-cud bg-red-600 hover:bg-red-400" />*/}
                  {/*        </button>*/}
                  {/*      </Popconfirm>*/}
                  {/*    </Tooltip>*/}
                  {/*  )}*/}
                  {/*</span>*/}
                </div>
              ))}
            </div>
            <div className="p-2 sm:p-0 block sm:hidden">
              <Select
                value={request.filter.roleCode}
                className={'w-full'}
                options={userRoleFacade?.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
                onChange={(e) => {
                  request.filter.roleCode = e;
                  dataTableRef?.current?.onChange(request);
                }}
              />
            </div>
          </Spin>
        </div>
      </div>
      <div className="col-span-12 md:col-span-8 lg:col-span-9 intro-x">
        <div className="shadow rounded-xl w-full overflow-auto bg-white">
          <div className="sm:min-h-[calc(100vh-8.5rem)] overflow-y-auto p-3">
            <DataTable
              className={'container mx-auto'}
              facade={userFacade}
              ref={dataTableRef}
              onRow={(record) => ({
                onDoubleClick: () => navigate(`/${lang}${routerLinks('User')}/${record.id}/edit`),
              })}
              pageSizeRender={(sizePage: number) => sizePage}
              pageSizeWidth={'50px'}
              xScroll={1100}
              paginationDescription={(from: number, to: number, total: number) =>
                t('routes.admin.Layout.User', { from, to, total })
              }
              columns={[
                {
                  title: `routes.admin.user.Full name`,
                  name: 'name',
                  tableItem: {
                    filter: { type: ETableFilterType.search },
                    width: 210,
                    fixed: window.innerWidth > 767 ? 'left' : '',
                    sorter: true,
                    render: (text: string, item: any) => text && <Avatar src={item.avatar} text={item.name} />,
                  },
                },
                {
                  title: 'routes.admin.user.Position',
                  name: 'position',
                  tableItem: {
                    width: 200,
                    filter: {
                      type: ETableFilterType.checkbox,
                      name: 'positionCode',
                      get: {
                        facade: CodeFacade,
                        format: (item: any) => ({
                          label: item.name,
                          value: item.code,
                        }),
                        params: (fullTextSearch: string, value) => ({
                          fullTextSearch,
                          filter: { type: 'position' },
                          extend: { code: value },
                        }),
                      },
                    },
                    sorter: true,
                    render: (item) => item?.name,
                  },
                },
                {
                  title: 'routes.admin.user.Role',
                  name: 'role',
                  tableItem: {
                    width: 110,
                    sorter: true,
                    render: (item) => item?.name,
                  },
                },
                {
                  title: 'Email',
                  name: 'email',
                  tableItem: {
                    filter: { type: ETableFilterType.search },
                    sorter: true,
                  },
                },
                {
                  title: 'routes.admin.user.Phone Number',
                  name: 'phoneNumber',
                  tableItem: {
                    filter: { type: ETableFilterType.search },
                    sorter: true,
                  },
                },
                {
                  title: 'Created',
                  name: 'createdAt',
                  tableItem: {
                    width: 120,
                    filter: { type: ETableFilterType.date },
                    sorter: true,
                    render: (text) => dayjs(text).format(formatDate),
                  },
                },
                {
                  title: 'routes.admin.user.Action',
                  tableItem: {
                    width: 90,
                    align: ETableAlign.center,
                    render: (text: string, data) => (
                      <div className={'flex gap-2'}>
                        {user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                          <Tooltip
                            title={t(
                              data.isDisabled ? 'components.datatable.Disabled' : 'components.datatable.Enabled',
                            )}
                          >
                            <Popconfirm
                              placement="left"
                              title={t(
                                !data.isDisabled
                                  ? 'components.datatable.areYouSureWantDisable'
                                  : 'components.datatable.areYouSureWantEnable',
                              )}
                              onConfirm={() => userFacade.putDisable({ id: data.id, disable: !data.isDisabled })}
                              okText={t('components.datatable.ok')}
                              cancelText={t('components.datatable.cancel')}
                            >
                              <button
                                title={
                                  t(
                                    data.isDisabled ? 'components.datatable.Disabled' : 'components.datatable.Enabled',
                                  ) || ''
                                }
                              >
                                {data.isDisabled ? (
                                  <Disable className="icon-cud bg-yellow-700 hover:bg-yellow-500" />
                                ) : (
                                  <Check className="icon-cud bg-green-600 hover:bg-green-400" />
                                )}
                              </button>
                            </Popconfirm>
                          </Tooltip>
                        )}
                        {user?.role?.permissions?.includes(keyRole.P_USER_UPDATE) && (
                          <Tooltip title={t('routes.admin.Layout.Edit')}>
                            <button
                              title={t('routes.admin.Layout.Edit') || ''}
                              onClick={() =>
                                navigate(`/${lang}${routerLinks('User')}/${request.filter.roleCode}/${data.id}/edit`)
                              }
                            >
                              <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                            </button>
                          </Tooltip>
                        )}

                        {user?.role?.permissions?.includes(keyRole.P_USER_DELETE) && (
                          <Tooltip title={t('routes.admin.Layout.Delete')}>
                            <Popconfirm
                              placement="left"
                              title={t('components.datatable.areYouSureWant')}
                              onConfirm={() => dataTableRef?.current?.handleDelete(data.id)}
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
                  },
                },
              ]}
              rightHeader={
                <div className={'flex gap-2'}>
                  {user?.role?.permissions?.includes(keyRole.P_USER_CREATE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('components.button.New')}
                      onClick={() => navigate(`/${lang}${routerLinks('User')}/${request.filter.roleCode}/add`)}
                    />
                  )}
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
