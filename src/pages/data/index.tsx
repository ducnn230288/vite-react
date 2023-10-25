import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Popconfirm, Select, Spin, Tooltip } from 'antd';
import { useNavigate } from 'react-router';
import classNames from 'classnames';
import { createSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

import { Button } from '@core/button';
import { DataTable } from '@core/data-table';
import { keyRole, lang, routerLinks } from '@utils';
import { DataFacade, DataTypeFacade, GlobalFacade } from '@store';
import { Check, Disable, Edit, Plus, Trash } from '@svgs';
import { EStatusState, ETableAlign, ETableFilterType, TableRefObject } from '@models';
import { Avatar } from '@core/avatar';

const Page = () => {
  const { user, set, formatDate } = GlobalFacade();
  const dataTypeFacade = DataTypeFacade();
  useEffect(() => {
    if (!dataTypeFacade.result?.data) dataTypeFacade.get({});
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Data', link: '' },
      ],
    });
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    switch (dataTypeFacade.status) {
      case EStatusState.getFulfilled:
        if (
          dataTypeFacade?.result?.data?.length &&
          !dataTypeFacade?.result?.data?.filter((item) => item.code === request.filter.type).length
        ) {
          navigate({
            pathname: `/${lang}${routerLinks('Data')}`,
            search: `?${createSearchParams({ filter: '{"type":"partner"}' })}`,
          });
          request.filter.type = 'partner';
          dataTableRef?.current?.onChange(request);
        }
        break;
    }
  }, [dataTypeFacade?.result]);

  const dataFacade = DataFacade();
  useEffect(() => {
    switch (dataFacade.status) {
      case EStatusState.putFulfilled:
      case EStatusState.putDisableFulfilled:
      case EStatusState.postFulfilled:
      case EStatusState.deleteFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [dataFacade.status]);

  const request = JSON.parse(dataFacade.queryParams || '{}');
  if (!request.filter || typeof request?.filter === 'string') request.filter = JSON.parse(request?.filter || '{}');
  const { t } = useTranslation();
  const dataTableRef = useRef<TableRefObject>(null);
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>Data Type</h3>
          </div>
          <Spin spinning={dataTypeFacade.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              {dataTypeFacade.result?.data?.map((data, index) => (
                <div
                  key={data.id}
                  className={classNames(
                    { 'bg-gray-100': request.filter.type === data.code },
                    'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                  )}
                >
                  <div
                    onClick={() => {
                      request.filter.type = data.code;
                      dataTableRef?.current?.onChange(request);
                    }}
                    className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-4 py-2"
                  >
                    {index + 1}. {data.name}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 sm:p-0 block sm:hidden">
              <Select
                value={request.filter.type}
                className={'w-full'}
                options={dataTypeFacade.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
                onChange={(e) => {
                  request.filter.type = e;
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
              facade={dataFacade}
              ref={dataTableRef}
              pageSizeRender={(sizePage: number) => sizePage}
              pageSizeWidth={'50px'}
              paginationDescription={(from: number, to: number, total: number) =>
                t('routes.admin.Layout.Pagination', { from, to, total })
              }
              columns={[
                {
                  title: 'routes.admin.Data.Name',
                  name: 'name',
                  tableItem: {
                    filter: { type: ETableFilterType.search },
                    sorter: true,
                    render: (text: string, item: any) => (
                      <Avatar
                        src={item.image}
                        text={
                          text ||
                          (item.translations.length &&
                            item.translations?.filter(
                              (item: any) => item?.language === localStorage.getItem('i18nextLng'),
                            )[0].name) ||
                          ''
                        }
                      />
                    ),
                  },
                },
                {
                  title: 'routes.admin.Data.Order',
                  name: 'order',
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
                    width: 100,
                    align: ETableAlign.center,
                    render: (text: string, data) => (
                      <div className={'flex gap-2'}>
                        {user?.role?.permissions?.includes(keyRole.P_DATA_UPDATE) && (
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
                              onConfirm={() => dataFacade.putDisable({ id: data.id, disable: !data.isDisabled })}
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
                        {user?.role?.permissions?.includes(keyRole.P_DATA_UPDATE) && (
                          <Tooltip title={t('routes.admin.Layout.Edit')}>
                            <button
                              title={t('routes.admin.Layout.Edit') || ''}
                              onClick={() => navigate(`/${lang}${routerLinks('Data')}/${data.type}/${data.id}/edit`)}
                            >
                              <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                            </button>
                          </Tooltip>
                        )}
                        {user?.role?.permissions?.includes(keyRole.P_DATA_DELETE) && (
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
                  },
                },
              ]}
              rightHeader={
                <div className={'flex gap-2'}>
                  {user?.role?.permissions?.includes(keyRole.P_DATA_CREATE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('components.button.New')}
                      onClick={() => navigate(`/${lang}${routerLinks('Data')}/${request.filter.type}/add`)}
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
