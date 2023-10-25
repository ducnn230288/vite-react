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
import { GlobalFacade, PostFacade, PostTypeFacade } from '@store';
import { Check, Disable, Edit, Plus, Trash } from '@svgs';
import { EStatusState, ETableAlign, ETableFilterType, TableRefObject } from '@models';
import { Avatar } from '@core/avatar';

const Page = () => {
  const { user, set, formatDate } = GlobalFacade();
  const postTypeFacade = PostTypeFacade();
  useEffect(() => {
    if (!postTypeFacade.result?.data) postTypeFacade.get({});
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Post', link: '' },
      ],
    });
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (
      postTypeFacade?.result?.data?.length &&
      !postTypeFacade?.result?.data?.filter((item) => item.code === request.filter.type).length
    ) {
      navigate({
        pathname: `/${lang}${routerLinks('Post')}`,
        search: `?${createSearchParams({ filter: '{"type":"projects"}' })}`,
      });
      request.filter.type = 'projects';
      dataTableRef?.current?.onChange(request);
    }
  }, [postTypeFacade?.result]);

  const postFacade = PostFacade();
  useEffect(() => {
    switch (postFacade.status) {
      case EStatusState.putFulfilled:
      case EStatusState.putDisableFulfilled:
      case EStatusState.postFulfilled:
      case EStatusState.deleteFulfilled:
        dataTableRef?.current?.onChange(request);
        break;
    }
  }, [postFacade.status]);
  useEffect(() => {
    switch (postTypeFacade.status) {
      case EStatusState.deleteFulfilled:
        postTypeFacade.get({});
        break;
    }
  }, [postTypeFacade.status]);

  const request = JSON.parse(postFacade.queryParams || '{}');
  if (!request.filter || typeof request?.filter === 'string') request.filter = JSON.parse(request?.filter || '{}');
  const { t } = useTranslation();
  const dataTableRef = useRef<TableRefObject>(null);
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>Post Type</h3>
            {/*<div className="flex items-center">*/}
            {/*  <Button*/}
            {/*    icon={<Plus className="icon-cud !h-5 !w-5" />}*/}
            {/*    text={t('routes.admin.Code.New Type')}*/}
            {/*    onClick={() => navigate(`/${lang}${routerLinks('PostType')}/add`)}*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
          <Spin spinning={postTypeFacade.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              {postTypeFacade.result?.data?.map((data, index) => (
                <div
                  key={data.id}
                  className={classNames(
                    { 'bg-gray-100': request.filter.type === data.code },
                    'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                  )}
                >
                  <div
                    onClick={() => {
                      if (request.filter.type !== data.code) request.filter.type = data.code;
                      else delete request.filter.type;
                      dataTableRef?.current?.onChange(request);
                    }}
                    className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-4 py-2"
                  >
                    {index + 1}. {data.name}
                  </div>
                  <span className="w-16 flex justify-end gap-1">
                    {user?.role?.permissions?.includes(keyRole.P_POST_TYPE_UPDATE) && (
                      <Tooltip title={t('routes.admin.Layout.Edit')}>
                        <button
                          className={'opacity-0 group-hover:opacity-100 transition-all duration-300 '}
                          title={t('routes.admin.Layout.Edit') || ''}
                          onClick={() => navigate(`/${lang}${routerLinks('PostType')}/${data.id}/edit`)}
                        >
                          <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                        </button>
                      </Tooltip>
                    )}
                    {user?.role?.permissions?.includes(keyRole.P_POST_TYPE_DELETE) && !data.isPrimary && (
                      <Tooltip title={t('routes.admin.Layout.Delete')}>
                        <Popconfirm
                          placement="left"
                          title={t('components.datatable.areYouSureWant')}
                          onConfirm={() => postTypeFacade.delete(data.id!)}
                          okText={t('components.datatable.ok')}
                          cancelText={t('components.datatable.cancel')}
                        >
                          <button
                            className={'opacity-0 group-hover:opacity-100 transition-all duration-300'}
                            title={t('routes.admin.Layout.Delete') || ''}
                          >
                            <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
                          </button>
                        </Popconfirm>
                      </Tooltip>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-2 sm:p-0 block sm:hidden">
              <Select
                value={request.filter.type}
                className={'w-full'}
                options={postTypeFacade.result?.data?.map((data) => ({ label: data.name, value: data.code }))}
                onChange={(e) => {
                  if (request.filter.type !== e) request.filter.type = e;
                  else delete request.filter.type;
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
              facade={postFacade}
              ref={dataTableRef}
              pageSizeRender={(sizePage: number) => sizePage}
              pageSizeWidth={'50px'}
              paginationDescription={(from: number, to: number, total: number) =>
                t('routes.admin.Layout.Pagination', { from, to, total })
              }
              columns={[
                {
                  title: 'routes.admin.Post.Name',
                  name: 'translations',
                  tableItem: {
                    filter: { type: ETableFilterType.search },
                    sorter: true,
                    render: (text: string, item: any) => (
                      <Avatar
                        src={item.thumbnailUrl}
                        text={
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
                  title: 'Slug',
                  name: 'translations',
                  tableItem: {
                    filter: { type: ETableFilterType.search },
                    sorter: true,
                    render: (text) =>
                      text?.filter((item: any) => item?.language === localStorage.getItem('i18nextLng'))[0].slug || '',
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
                        {user?.role?.permissions?.includes(keyRole.P_POST_UPDATE) && (
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
                              onConfirm={() => postFacade.putDisable({ id: data.id, disable: !data.isDisabled })}
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
                        {user?.role?.permissions?.includes(keyRole.P_POST_UPDATE) && (
                          <Tooltip title={t('routes.admin.Layout.Edit')}>
                            <button
                              title={t('routes.admin.Layout.Edit') || ''}
                              onClick={() => navigate(`/${lang}${routerLinks('Post')}/${data.type}/${data.id}/edit`)}
                            >
                              <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                            </button>
                          </Tooltip>
                        )}
                        {user?.role?.permissions?.includes(keyRole.P_POST_DELETE) && (
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
                  {user?.role?.permissions?.includes(keyRole.P_POST_CREATE) && (
                    <Button
                      icon={<Plus className="icon-cud !h-5 !w-5" />}
                      text={t('components.button.New')}
                      onClick={() => navigate(`/${lang}${routerLinks('Post')}/${request.filter.type}/add`)}
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
