import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Popconfirm, Tooltip } from 'antd';
import { useNavigate } from 'react-router';

import { Avatar } from '@core/avatar';
import { DataTable } from '@core/data-table';
import { Button } from '@core/button';
import { GlobalFacade, UserTeamFacade } from '@store';
import { Edit, Plus, Trash } from '@svgs';
import { lang, keyRole, routerLinks } from '@utils';
import { EStatusState, ETableAlign } from '@models';

const Page = () => {
  const { user, set } = GlobalFacade();
  useEffect(() => {
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Team', link: '' },
      ],
    });
  }, []);

  const userTeamFacade = UserTeamFacade();
  useEffect(() => {
    switch (userTeamFacade.status) {
      case EStatusState.deleteFulfilled:
        dataTableRef.current.onChange();
        break;
    }
  }, [userTeamFacade.status]);

  const dataTableRef = useRef<any>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <DataTable
      className={'max-w-5xl mx-auto'}
      facade={userTeamFacade}
      ref={dataTableRef}
      pageSizeRender={(sizePage: number) => sizePage}
      pageSizeWidth={'50px'}
      paginationDescription={(from: number, to: number, total: number) =>
        t('routes.admin.team.Pagination', { from, to, total })
      }
      columns={[
        {
          title: 'routes.admin.team.Name',
          name: 'name',
          tableItem: {
            sorter: true,
          },
        },
        {
          title: 'routes.admin.dayoff.Manager',
          name: 'manager',
          tableItem: {
            render: (text: any) => text && <Avatar src={text.avatar} text={text.name} />,
          },
        },
        {
          title: 'routes.admin.user.Description',
          name: 'description',
          tableItem: {},
        },
        {
          title: 'routes.admin.user.Action',
          tableItem: {
            width: 90,
            align: ETableAlign.center,
            onCell: () => ({
              style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' },
            }),
            render: (text: string, data: any) => (
              <div className={'flex gap-2'}>
                {user?.role?.permissions?.includes(keyRole.P_USER_TEAM_UPDATE) && (
                  <Tooltip title={t('routes.admin.Layout.Edit')}>
                    <button
                      title={t('routes.admin.Layout.Edit') || ''}
                      onClick={() => navigate(`/${lang}${routerLinks('Team')}/${data.id}`)}
                    >
                      <Edit className="icon-cud bg-teal-900 hover:bg-teal-700" />
                    </button>
                  </Tooltip>
                )}

                {user?.role?.permissions?.includes(keyRole.P_USER_TEAM_DELETE) && (
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
          {user?.role?.permissions?.includes(keyRole.P_USER_TEAM_CREATE) && (
            <Button
              icon={<Plus className="icon-cud !h-5 !w-5" />}
              text={t('components.button.New')}
              onClick={() => navigate(`/${lang}${routerLinks('Team/Add')}`)}
            />
          )}
        </div>
      }
    />
  );
};
export default Page;
