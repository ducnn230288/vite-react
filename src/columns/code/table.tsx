import { Popconfirm, Tooltip } from 'antd';
import React from 'react';
import { keyRole } from '@utils';
import { DataTableModel } from '@models';
import { Edit, Trash } from 'src/assets/svgs';

const Column = ({ t, modalFormRef, listType, permissions }: any) => {
  const col: DataTableModel[] = [
    {
      title: t('titles.Code'),
      name: 'code',
      tableItem: {
        width: 100,
        filter: { type: 'search' },
        sorter: true,
      },
    },
    {
      title: t('Code.Name'),
      name: 'name',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
      },
    },
    {
      title: t('Code.Type'),
      name: 'type',
      tableItem: {
        filter: {
          type: 'radio',
          list: listType || [],
        },
        width: 110,
        sorter: true,
        render: (text: string) => text && listType.filter((item: any) => item.value === text)[0]?.label,
      },
    },
    {
      title: t('user.Description'),
      name: 'description',
      tableItem: {
        filter: { type: 'search' },
        sorter: true,
      },
    },
    {
      title: t('user.Action'),
      tableItem: {
        width: 100,
        align: 'center',
        onCell: () => ({
          style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' },
        }),
        render: (text: string, data: any) => (
          <div className={'flex gap-2'}>
            {permissions?.includes(keyRole.P_CODE_UPDATE) && (
              <Tooltip title={t('routes.admin.Layout.Edit')}>
                <Edit
                  className="icon-cud bg-blue-600 hover:bg-blue-400"
                  onClick={() => modalFormRef?.current?.handleEdit(data)}
                />
              </Tooltip>
            )}
            {permissions?.includes(keyRole.P_CODE_DELETE) && (
              <Tooltip title={t('routes.admin.Layout.Delete')}>
                <Popconfirm
                  placement="left"
                  title={t('components.datatable.areYouSureWant')}
                  onConfirm={() => modalFormRef?.current?.handleDelete(data.id)}
                  okText={t('components.datatable.ok')}
                  cancelText={t('components.datatable.cancel')}
                >
                  <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        ),
      },
    },
  ];
  return col;
};
export default Column;
