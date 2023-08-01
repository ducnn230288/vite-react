import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Edit, Infor, Plus, Trash } from '@svgs';
import { TaxFacade } from '@store';
import { Button } from '@core/button';
import { DataTable } from '@core/data-table';
import { lang, language, languages, routerLinks } from '@utils';
import { Popconfirm, Tooltip } from 'antd';
import { ModalForm } from '@core/modal/form';
import { DataTableModel, FormModalRefObject } from '@models';
import Input from 'antd/es/input/Input';

const Page = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isReload = useRef(false);
    const taxFacade = TaxFacade();
    const { status, queryParams } = taxFacade;
    const param = JSON.parse(queryParams || '{}');
    const modalFormRef = useRef<any>();
    const dataTableRef = useRef<any>();
    useEffect(() => {
        console.log(status)
        switch (status) {
            case 'put.fulfilled':
                dataTableRef?.current?.onChange!({ page: 1, perPage: 10 });
                break;
            case 'post.fulfilled':
                dataTableRef?.current?.onChange!({ page: 1, perPage: 10 });
                break;
            case 'delete.fulfilled':
                dataTableRef?.current?.onChange!({ page: 1, perPage: 10 });
                break;
        }
    }, [status]);
    let stt = 1;
    return (
        <Fragment>
            <DataTable
                facade={taxFacade}
                ref={dataTableRef}
                xScroll='768px'
                className=' bg-white p-5 rounded-lg'
                pageSizeRender={(sizePage: number) => sizePage}
                pageSizeWidth={'50px'}
                paginationDescription={(from: number, to: number, total: number) =>
                    t('routes.admin.Layout.PaginationTax', { from, to, total })
                }
                columns={[
                    {
                        title: 'tax.stt',
                        name: 'stt',
                        tableItem: {
                            width: 70,
                            render: () => `${stt++}`
                        },
                    },
                    {
                        title: 'tax.type',
                        name: 'name',
                        tableItem: {
                            render: (value: any, item: any) => {
                                return (
                                    <div className='flex'>
                                        {value.slice(0, 60)}
                                        {value.length >= 60 ?
                                            <Tooltip title={item?.name} className='text-black' >
                                                <Infor className='w-4 h-4 mt-1 ml-1' />
                                            </Tooltip>
                                            : null
                                        }
                                    </div>
                                )
                            }
                        },
                    },
                    {
                        title: 'tax.taxRate',
                        name: 'taxRate',
                        tableItem: {
                        }
                    },
                    {
                        title: 'tax.descripton',
                        name: 'descripton',
                        tableItem: {
                        }
                    },
                    {
                        title: 'tax.action',
                        name: 'action',
                        tableItem: {
                            align: 'center',
                            onCell: () => ({
                                style: { paddingTop: '0.25rem', paddingBottom: '0.25rem' },
                            }),
                            render: (text: string, data: any) => (
                                <div className={'flex justify-center gap-2'}>
                                    <Tooltip title={t('routes.admin.Layout.Edit')}>
                                        <button
                                            title={t('routes.admin.Layout.Edit') || ''}
                                            onClick={() => modalFormRef?.current?.handleEdit!(data)}
                                        >
                                            <Edit className="icon-cud !fill-blue-500" />
                                        </button>
                                    </Tooltip>

                                    <Tooltip title={t('routes.admin.Layout.Delete')}>
                                        <Popconfirm
                                            placement="left"
                                            title={t('components.datatable.areYouSureWant')}
                                            onConfirm={() => dataTableRef?.current?.handleDelete!(data.id)}
                                            okText={t('components.datatable.ok')}
                                            cancelText={t('components.datatable.cancel')}
                                        >
                                            <button title={t('routes.admin.Layout.Delete') || ''}>
                                                <Trash className="icon-cud !fill-red-500" />
                                            </button>
                                        </Popconfirm>
                                    </Tooltip>
                                </div>
                            )
                        }
                    },
                ]}
                rightHeader={
                    <div className={'text-center !bg-teal-900 !rounded-xl mt-2.5 lg:mt-0 w-40'}>
                        <Button
                            className='!bg-teal-900 !rounded-3xl !font-normal'
                            icon={<Plus className="icon-cud !h-5 !w-5 !fill-white " />}
                            text={t('tax.add')}
                            onClick={() => modalFormRef?.current?.handleEdit()}
                        />
                    </div>
                }
            />
            <ModalForm
                facade={taxFacade}
                ref={modalFormRef}
                textCancel='Hủy'
                title={'Từ chối yêu cầu sản phẩm'}
                columns={[
                    {
                        title: 'tax.type',
                        name: 'name',
                        formItem: {
                            rules: [{ type: 'required', message: 'components.form.ruleRequiredPassword' }],
                        }
                    },
                    {
                        title: 'tax.taxRate',
                        name: 'taxRate',
                        formItem: {
                            type: 'number',
                            rules: [{ type: 'required', message: 'components.form.ruleRequiredPassword' },
                            {
                                type: 'custom',
                                validator: ({ getFieldValue }) => ({
                                    validator(rule, value: string) {
                                        if (Number(value) < 0 || Number(value) > 999)
                                            return Promise.reject(t('components.form.ruleNumber', { min: 0, max: 999 }));
                                        return Promise.resolve();
                                    },
                                }),
                            },
                            ],
                            placeholder: 'Nhập thuế',
                        }
                    },
                    {
                        title: 'tax.descripton',
                        name: 'descripton',
                        formItem: {
                            type: 'textarea',
                            rules: [{ type: 'textarea' }]
                        }
                    }
                ]}
                widthModal={600}
            />
        </Fragment>
    );
};
export default Page;
