import React, { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { Checkbox, CheckboxOptionType, DatePicker, Popover, Radio, Spin, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { Button } from '../button';
import { Pagination } from '../pagination';
import { DataTableModel, PaginationQuery, TableGet, TableRefObject } from '@models';
import { cleanObjectKeyNull, getSizePageByHeight } from '@utils';
import { Calendar, CheckCircle, CheckSquare, Search, Times } from '@svgs';
import { SorterResult } from 'antd/lib/table/interface';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;
const checkTextToShort = (text: string) => {
  return text?.toString()?.length < 50 ? (
    text
  ) : (
    <span>
      {text?.toString()?.substring(0, 40)}
      <Popover trigger="hover" overlayClassName="table-tooltip" content={text}>
        ...
      </Popover>
    </span>
  );
};

export const getQueryStringParams = (query: string) => {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params: { [selector: string]: string }, param: string) => {
          const [key, value] = param.split('=');
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {})
    : {}; // Trim - from end of text
};

export const DataTable = forwardRef(
  (
    {
      columns = [],
      summary,
      id,
      showList = true,
      footer,
      defaultRequest = {
        page: 1,
        perPage: 1,
      },
      showPagination = true,
      leftHeader,
      rightHeader,
      showSearch = true,
      save = true,
      searchPlaceholder,
      subHeader,
      xScroll,
      yScroll,
      emptyText = 'No Data',
      onRow,
      pageSizeOptions = [],
      pageSizeRender = (sizePage: number) => sizePage + ' / page',
      pageSizeWidth = '115px',
      paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
      idElement = 'temp-' + nanoid(),
      className = 'data-table',
      facade = {},
      data,
      ...prop
    }: Type,
    ref: Ref<TableRefObject>,
  ) => {
    useImperativeHandle(ref, () => ({
      onChange,
      handleDelete: async (id: string) => facade.delete(id),
    }));
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const idTable = useRef(idElement);
    const timeoutSearch = useRef<ReturnType<typeof setTimeout>>();
    const cols = useRef<DataTableModel[]>();
    const refPageSizeOptions = useRef<number[]>();
    const { result, isLoading, queryParams, time } = facade;
    // eslint-disable-next-line prefer-const
    let [params, setParams] = useState(
      save && location.search && location.search.indexOf('=') > -1
        ? { ...defaultRequest, ...getQueryStringParams(location.search) }
        : defaultRequest,
    );

    const scroll = useRef<{ x?: number; y?: number }>({ x: xScroll, y: yScroll });
    useEffect(() => {
      if (pageSizeOptions?.length === 0) {
        if (params?.perPage === 1) params.perPage = getSizePageByHeight();
        if (params.perPage! < 5) params.perPage = 5;
        refPageSizeOptions.current = [
          params.perPage || 10,
          (params.perPage || 10) * 2,
          (params.perPage || 10) * 3,
          (params.perPage || 10) * 4,
          (params.perPage || 10) * 5,
        ];
      } else refPageSizeOptions.current = pageSizeOptions;
      setParams(
        cleanObjectKeyNull({
          ...params,
          sorts: JSON.stringify(params.sorts),
          filter: JSON.stringify(params.filter),
        }),
      );
      if (facade) {
        localStorage.setItem(idTable.current, JSON.stringify(cleanObjectKeyNull(params)));
        if (!result?.data || new Date().getTime() > time || JSON.stringify(params) != queryParams)
          onChange(params, false);
      }
      if (!scroll.current.x) {
        scroll.current.x = 0;
        columns.forEach((item) => {
          if (item.tableItem) {
            scroll.current.x! += item.tableItem?.width || 150;
          }
        });
      }

      return () => localStorage.removeItem(idTable.current);
    }, []);

    const onChange = (request?: PaginationQuery, changeNavigate = true) => {
      if (request) {
        localStorage.setItem(idTable.current, JSON.stringify(request));
        params = { ...request };
        if (save) {
          if (request.sorts && typeof request.sorts === 'object') request.sorts = JSON.stringify(request.sorts);
          if (request.filter && typeof request.filter === 'object') request.filter = JSON.stringify(request.filter);
          changeNavigate &&
            navigate(
              location.hash.substring(1) + '?' + new URLSearchParams(request as Record<string, string>).toString(),
            );
        }
      } else if (localStorage.getItem(idTable.current))
        params = JSON.parse(localStorage.getItem(idTable.current) || '{}');

      setParams(params);
      if (showList && facade?.get) facade?.get(cleanObjectKeyNull({ ...request }));
    };

    if (params.filter && typeof params.filter === 'string') params.filter = JSON.parse(params.filter);
    if (params.sorts && typeof params.sorts === 'string') params.sorts = JSON.parse(params.sorts);

    const groupButton = (confirm: any, clearFilters: any, key: any, value: any) => (
      <div className="grid grid-cols-2 gap-2 sm:mt-1 mt-2">
        <Button
          text={t('components.datatable.reset')}
          onClick={() => {
            clearFilters();
            confirm();
          }}
          className={'justify-center !bg-gray-300 !text-black h-4/5 sm:h-auto !px-2 sm:px-4'}
        />
        <Button
          icon={<Search className="fill-white h-3 w-3" />}
          text={t('components.datatable.search')}
          onClick={() => confirm(value)}
          className={'justify-center h-4/5 sm:h-auto !px-2 sm:px-4'}
        />
      </div>
    );
    const valueFilter = useRef<{ [selector: string]: boolean }>({});
    const [filterDropdownOpen, setFilterDropdownOpen] = useState<any>({});
    const columnSearch = (get: TableGet, fullTextSearch = '', value?: any, facade: any = {}) => {
      if (get?.facade) {
        const params = get.params ? get.params(fullTextSearch, value) : { fullTextSearch };
        if (new Date().getTime() > facade.time || JSON.stringify(cleanObjectKeyNull(params)) != facade.queryParams)
          facade.get(cleanObjectKeyNull(params));
      }
    };
    // noinspection JSUnusedGlobalSymbols
    const getColumnSearchRadio = (filters: CheckboxOptionType[], key: string, get: TableGet = {}) => ({
      onFilterDropdownOpenChange: async (visible: boolean) => (valueFilter.current[key] = visible),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
        const facade = get?.facade ? get?.facade() : {};
        useEffect(() => {
          if (get && !facade?.result?.data && valueFilter.current[key]) columnSearch(get, '', undefined, facade);
        }, [valueFilter.current[key]]);
        return (
          <Spin spinning={facade.isLoading === true || false}>
            <div className="p-1">
              {get?.facade && (
                <input
                  className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4 mb-1"
                  type="text"
                  placeholder={t('components.datatable.pleaseEnterValueToSearch') || ''}
                  onChange={(e) => {
                    clearTimeout(timeoutSearch.current);
                    timeoutSearch.current = setTimeout(() => columnSearch(get, e.target.value, selectedKeys), 500);
                  }}
                  onKeyUp={async (e) => {
                    if (e.key === 'Enter') await columnSearch(get, e.currentTarget.value, undefined, facade);
                  }}
                />
              )}
              <div>
                <RadioGroup
                  options={
                    filters || get?.facade?.result?.data?.map(get.format).filter((item: any) => !!item.value) || []
                  }
                  value={selectedKeys}
                  onChange={(e) => setSelectedKeys(e.target.value + '')}
                />
                {(filters?.length === 0 || facade?.result?.data?.length === 0) && (
                  <span className={'px-2'}>{t('components.datatable.No Data')}</span>
                )}
              </div>
              {groupButton(confirm, clearFilters, key, selectedKeys)}
            </div>
          </Spin>
        );
      },
      filterIcon: () => <CheckCircle className="h-4 w-4 fill-gray-600" />,
    });
    // noinspection JSUnusedGlobalSymbols
    const getColumnSearchCheckbox = (filters: any, key: any, get: TableGet = {}) => ({
      onFilterDropdownOpenChange: async (visible: boolean) => (valueFilter.current[key] = visible),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => {
        const facade = get?.facade ? get?.facade() : {};
        useEffect(() => {
          if (get && !facade?.result?.data && valueFilter.current[key]) columnSearch(get, '', undefined, facade);
        }, [valueFilter.current[key]]);
        return (
          <Spin spinning={facade.isLoading === true || false}>
            <div className="p-1">
              {!!get?.facade && (
                <input
                  className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4 mb-1"
                  type="text"
                  placeholder={t('components.datatable.pleaseEnterValueToSearch') || ''}
                  onChange={(e) => {
                    clearTimeout(timeoutSearch.current);
                    timeoutSearch.current = setTimeout(
                      () => columnSearch(get, e.target.value, selectedKeys, facade),
                      500,
                    );
                  }}
                  onKeyUp={async (e) => {
                    if (e.key === 'Enter') await columnSearch(get, e.currentTarget.value, undefined, facade);
                  }}
                />
              )}
              <div>
                <CheckboxGroup
                  options={filters || facade?.result?.data?.map(get.format).filter((item: any) => !!item.value) || []}
                  defaultValue={selectedKeys}
                  onChange={(e) => setSelectedKeys(e)}
                />
                {(filters?.length === 0 || facade?.result?.data?.length === 0) && (
                  <span className={'px-2'}>{t('components.datatable.No Data')}</span>
                )}
              </div>
              {groupButton(confirm, clearFilters, key, selectedKeys)}
            </div>
          </Spin>
        );
      },
      filterIcon: (filtered: boolean) => (
        <CheckSquare className={classNames('h-4 w-4', { 'fill-[#3699FF]': filtered, 'fill-gray-600': !filtered })} />
      ),
    });
    // noinspection JSUnusedGlobalSymbols
    const getColumnSearchInput = (key: any) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div className="p-1">
          <input
            id={idTable.current + '_input_filter_' + key}
            className="w-full h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-100 pr-9 pl-4"
            value={selectedKeys}
            type="text"
            placeholder={t('components.datatable.pleaseEnterValueToSearch') || ''}
            onChange={(e) => setSelectedKeys(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirm();
              e.stopPropagation();
            }}
          />
          {groupButton(confirm, clearFilters, key, selectedKeys)}
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <Search className={classNames('h-4 w-4', { 'fill-[#3699FF]': filtered, 'fill-gray-600': !filtered })} />
      ),
      filterDropdownOpen: !!filterDropdownOpen[key],
      onFilterDropdownOpenChange: (visible: boolean) => {
        setFilterDropdownOpen({ [key]: visible });
        if (visible) {
          setTimeout(
            () => (document.getElementById(idTable.current + '_input_filter_' + key) as HTMLInputElement).select(),
            100,
          );
        }
      },
    });
    // noinspection JSUnusedGlobalSymbols
    const getColumnSearchDate = (key: any) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div className={'p-1'}>
          <RangePicker
            renderExtraFooter={() => (
              <Button
                icon={<CheckCircle className="h-5 w-5 fill-white" />}
                text={t('components.datatable.ok')}
                onClick={() => (document.activeElement as HTMLElement).blur()}
                className={'w-full justify-center !py-0'}
              />
            )}
            format={['DD/MM/YYYY', 'DD/MM/YY']}
            value={!!selectedKeys && selectedKeys.length && [dayjs(selectedKeys[0]), dayjs(selectedKeys[1])]}
            onChange={(e) => setSelectedKeys(e)}
          />
          {groupButton(confirm, clearFilters, key, selectedKeys)}
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <Calendar className={classNames('h-4 w-4', { 'fill-[#3699FF]': filtered, 'fill-gray-600': !filtered })} />
      ),
    });
    cols.current = columns
      .filter((col) => !!col && !!col.tableItem)
      .map((col) => {
        let item = col.tableItem;

        if (item?.filter) {
          const filter = params?.filter as any;
          if (params.filter && filter[col!.name!]) item = { ...item, defaultFilteredValue: filter[col!.name!] };

          switch (item?.filter?.type) {
            case 'radio':
              item = {
                ...item,
                ...getColumnSearchRadio(
                  item.filter.list as CheckboxOptionType[],
                  item.filter.name || col!.name!,
                  item.filter.get,
                ),
              };
              break;
            case 'checkbox':
              item = {
                ...item,
                ...getColumnSearchCheckbox(item.filter.list, item.filter.name || col.name, item.filter.get),
              };
              break;
            case 'date':
              item = { ...item, ...getColumnSearchDate(item.filter.name || col.name) };
              break;
            default:
              item = { ...item, ...getColumnSearchInput(item?.filter?.name || col.name) };
          }
          delete item.filter;
        }
        const sorts = params?.sorts as any;
        if (item?.sorter && sorts && sorts[col!.name!])
          item.defaultSortOrder =
            sorts[col!.name!] === 'ASC' ? 'ascend' : sorts[col!.name!] === 'DESC' ? 'descend' : '';
        if (!item?.render) item!.render = (text: string) => text && checkTextToShort(text);
        if (item && !item?.onCell)
          item.onCell = (record) => ({
            className: record?.id && record?.id === (id || facade?.data?.id) ? '!bg-teal-100' : '',
          });
        // noinspection JSUnusedGlobalSymbols
        return {
          title: t(col.title || ''),
          dataIndex: col.name,
          ...item,
        };
      });

    const handleTableChange = (
      pagination?: { page?: number; perPage?: number },
      filters = {},
      sorts?: SorterResult<any>,
      tempFullTextSearch?: string,
    ) => {
      let tempPageIndex = pagination?.page || params.page;
      const tempPageSize = pagination?.perPage || params.perPage;

      const tempSort =
        sorts && sorts?.field && sorts?.order
          ? {
              [sorts.field as string]: sorts.order === 'ascend' ? 'ASC' : sorts.order === 'descend' ? 'DESC' : '',
            }
          : sorts?.field
          ? null
          : sorts;

      if (tempFullTextSearch !== params.fullTextSearch) tempPageIndex = 1;
      const tempParams = cleanObjectKeyNull({
        ...params,
        page: tempPageIndex,
        perPage: tempPageSize,
        sorts: JSON.stringify(tempSort),
        filter: JSON.stringify(cleanObjectKeyNull(filters)),
        fullTextSearch: tempFullTextSearch,
      });
      onChange && onChange(tempParams);
    };
    if (!data) data = result?.data;
    const loopData = (array?: any[]): any[] =>
      array
        ? array.map((item) => ({
            ...item,
            key: item.id || nanoid(),
            children: item.children && loopData(item.children),
          }))
        : [];
    return (
      <div className={classNames(className, 'intro-x')}>
        <div className="lg:flex justify-between mb-2.5 gap-y-2.5 responsive-header supplier-tab4 store-tab3 flex-wrap form-index-supplier form-tab">
          {showSearch ? (
            <div className="relative">
              <input
                id={idTable.current + '_input_search'}
                className="w-full sm:w-80 h-10 rounded-xl text-gray-600 bg-white border border-solid border-gray-300 pr-9 pl-9"
                defaultValue={params.fullTextSearch}
                type="text"
                placeholder={searchPlaceholder || (t('components.datatable.pleaseEnterValueToSearch') as string)}
                onChange={() => {
                  clearTimeout(timeoutSearch.current);
                  timeoutSearch.current = setTimeout(
                    () =>
                      handleTableChange(
                        undefined,
                        params.filter,
                        params.sorts as SorterResult<any>,
                        (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value.trim(),
                      ),
                    500,
                  );
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter')
                    handleTableChange(
                      undefined,
                      params.filter,
                      params.sorts as SorterResult<any>,
                      (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value.trim(),
                    );
                }}
              />
              {!params.fullTextSearch ? (
                <Search
                  className="w-4 h-4 my-1 fill-gray-500 text-lg absolute top-2 left-2.5 z-10"
                  onClick={() => {
                    if (params.fullTextSearch) {
                      (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
                      handleTableChange(undefined, params.filter, params.sorts as SorterResult<any>, '');
                    }
                  }}
                />
              ) : (
                !!params.fullTextSearch && (
                  <Times
                    className="w-4 h-4 my-1 fill-gray-500 text-lg las absolute top-2 right-3 z-10"
                    onClick={() => {
                      if (params.fullTextSearch) {
                        (document.getElementById(idTable.current + '_input_search') as HTMLInputElement).value = '';
                        handleTableChange(undefined, params.filter, params.sorts as SorterResult<any>, '');
                      }
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <div />
          )}
          {!!leftHeader && <div className={'mt-2 sm:mt-0'}>{leftHeader}</div>}
          {!!rightHeader && <div className={'mt-2 sm:mt-0'}>{rightHeader}</div>}
        </div>
        {subHeader && subHeader(result?.count)}
        {!!showList && (
          <Fragment>
            <Table
              onRow={onRow}
              locale={{
                emptyText: (
                  <div className="bg-gray-100 text-gray-400 py-4">{t(`components.datatable.${emptyText}`)}</div>
                ),
              }}
              loading={isLoading}
              columns={cols.current}
              summary={summary}
              pagination={false}
              dataSource={loopData(data)}
              onChange={(pagination, filters, sorts) =>
                handleTableChange(undefined, filters, sorts as SorterResult<any>, params.fullTextSearch)
              }
              showSorterTooltip={false}
              scroll={scroll.current}
              size="small"
              {...prop}
            />
            {refPageSizeOptions.current && showPagination && (
              <Pagination
                total={result?.count}
                page={+params!.page!}
                perPage={+params!.perPage!}
                pageSizeOptions={refPageSizeOptions.current}
                pageSizeRender={pageSizeRender}
                pageSizeWidth={pageSizeWidth}
                queryParams={(pagination: { page?: number; perPage?: number }) =>
                  handleTableChange(pagination, params.filter, params.sorts as SorterResult<any>, params.fullTextSearch)
                }
                paginationDescription={paginationDescription}
                idElement={idTable.current}
                {...prop}
              />
            )}
          </Fragment>
        )}
        {!!footer && <div className="footer">{footer(result)}</div>}
      </div>
    );
  },
);
DataTable.displayName = 'HookTable';
type Type = {
  id?: string;
  columns: DataTableModel[];
  summary?: (data: any) => any;
  showList?: boolean;
  footer?: (result: any) => any;
  defaultRequest?: PaginationQuery;
  showPagination?: boolean;
  leftHeader?: JSX.Element;
  rightHeader?: JSX.Element;
  showSearch?: boolean;
  save?: boolean;
  searchPlaceholder?: string;
  subHeader?: (count: number) => any;
  xScroll?: number;
  yScroll?: number;
  emptyText?: JSX.Element | string;
  onRow?: (data: any) => { onDoubleClick?: () => void };
  pageSizeOptions?: number[];
  pageSizeRender?: (sizePage: number) => number | string;
  pageSizeWidth?: string;
  paginationDescription?: (from: number, to: number, total: number) => string;
  idElement?: string;
  className?: string;
  facade?: any;
  data?: any[];
};
