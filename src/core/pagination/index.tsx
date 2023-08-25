import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Select } from 'antd';
import classNames from 'classnames';
import { Arrow, DoubleArrow } from '@svgs';

export const Pagination: any = ({
  total = 4,
  pageSizeOptions = [],
  perPage = 10,
  page = 1,
  queryParams = () => null,
  pageSizeRender = (sizePage: number) => sizePage + ' / page',
  pageSizeWidth = '115px',
  paginationDescription = (from: number, to: number, total: number) => from + '-' + to + ' of ' + total + ' items',
  idElement = 'pagination',
  className = 'pagination',
  firstPageDisabled = ({ page }: { page: number }) => page - 10 < 0,
  lastPageDisabled = ({ page, lastIndex }: { page: number; lastIndex: number }) => page + 10 > lastIndex,
  firstPage = ({ page }: { page: number }) => page - 10,
  lastPage = ({ page }: { page: number }) => page + 10,
  showSizeChanger = true,
  showTotal = true,
}: Type) => {
  const listOfPageItem = useRef<{ disabled: boolean; type: string; index: number }[]>([]);
  const [ranges, setRanges] = useState<[number, number]>([(page - 1) * perPage + 1, Math.min(page * perPage, total)]);
  const [lastNumber, set_lastNumber] = useState(0);
  const buildIndexes = useCallback(() => {
    const lastIndex = getLastIndex(total, perPage);
    listOfPageItem.current = getListOfPageItem(page, lastIndex);
    setRanges([(page - 1) * perPage + 1, Math.min(page * perPage, total)]);
  }, [page, perPage, total]);

  useEffect(() => {
    buildIndexes();
  }, [buildIndexes]);

  const getLastIndex = (total: number, pageSize: number) => {
    return Math.ceil(total / pageSize);
  };

  const onPageSizeChange = (size: number) => {
    queryParams({ perPage: size, page });
    buildIndexes();
  };

  const onPageIndexChange = ({ type, index }: { type: string; index: number }) => {
    switch (type) {
      case 'prev':
        index = page - 1;
        break;
      case 'prev_10':
        index = firstPage({ page, lastIndex: lastNumber });
        break;
      case 'next':
        index = page + 1;
        break;
      case 'next_10':
        index = lastPage({ page, lastIndex: lastNumber });
        break;
      default:
    }
    queryParams({ perPage, page: index });
  };

  const getListOfPageItem = (pageIndex: number, lastIndex: number) => {
    const concatWithPrevNext = (listOfPage: { index: number; type: string; disabled: boolean }[]) => {
      const prev10Item = {
        type: 'prev_10',
        index: -1,
        disabled: firstPageDisabled({ page, lastIndex }),
      };
      const prevItem = {
        type: 'prev',
        index: -1,
        disabled: pageIndex === 1,
      };
      const nextItem = {
        type: 'next',
        index: -1,
        disabled: pageIndex === lastIndex,
      };
      const next10Item = {
        type: 'next_10',
        index: -1,
        disabled: lastPageDisabled({ page, lastIndex }),
      };
      set_lastNumber(listOfPage.length);
      return [prev10Item, prevItem, ...listOfPage, nextItem, next10Item];
    };
    const generatePage = (start: number, end: number) => {
      const list: { index: number; type: string; disabled: boolean }[] = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page_' + i,
          disabled: false,
        });
      }
      return list;
    };

    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePage(1, lastIndex));
    } else {
      const generateRangeItem = (selected: number, last: number) => {
        let listOfRange: { index: number; type: string; disabled: boolean }[];
        const prevFiveItem = {
          type: 'prev_5',
          index: -1,
          disabled: false,
        };
        const nextFiveItem = {
          type: 'next_5',
          index: -1,
          disabled: false,
        };
        const firstPageItem = generatePage(1, 1);
        const lastPageItem = generatePage(lastIndex, lastIndex);
        if (selected < 4) {
          listOfRange = [...generatePage(2, 4), nextFiveItem];
        } else if (selected < last - 3) {
          listOfRange = [prevFiveItem, ...generatePage(selected - 1, selected + 1), nextFiveItem];
        } else {
          listOfRange = [prevFiveItem, ...generatePage(last - 3, last - 1)];
        }
        return [...firstPageItem, ...listOfRange, ...lastPageItem];
      };
      return concatWithPrevNext(generateRangeItem(pageIndex, lastIndex));
    }
  };

  return (
    total > 0 && (
      <div className={classNames(className, 'flex flex-col lg:flex-row items-center justify-between mt-3 select-none')}>
        <div className={'left relative flex items-center'}>
          <label htmlFor={idElement + '_page_size'}>
            {showSizeChanger && (
              <Select
                className={'w-full sm:w-auto'}
                id={idElement + '_page_size'}
                defaultValue={perPage}
                style={{ minWidth: pageSizeWidth }}
                onChange={(value) => onPageSizeChange(value)}
              >
                {pageSizeOptions.map((item: any, index: number) => (
                  <Select.Option key={index} value={item}>
                    {pageSizeRender(item)}
                  </Select.Option>
                ))}
              </Select>
            )}
          </label>
          {showTotal && (
            <span className="sm:ml-3 text-black my-3">{paginationDescription(ranges[0], ranges[1], total)}</span>
          )}
        </div>
        <div className="mt-3 sm:mt-0 right flex justify-center p-1 rounded-xl bg-white">
          <div className="flex sm:flex-wrap justify-center duration-300 transition-all">
            {/* { disabled: boolean; type: string; index: number;   } */}
            {listOfPageItem.current.map((item: any, index: number) => (
              <button
                type={'button'}
                disabled={item.disabled}
                key={index}
                id={idElement + '_' + item.type}
                className={classNames('text-center p-1 text-sm font-medium leading-normal relative mx-1', {
                  'text-teal-900': page !== item.index && !['next_5', 'prev_5'].includes(item.type),
                  'bg-teal-900 rounded-full text-white !px-2.5 mx-1': page === item.index,
                  'text-zinc-300': item.disabled,
                  'text-gray-600 text-xs': ['next_5', 'prev_5'].includes(item.type),
                })}
                onClick={() => onPageIndexChange(item)}
                aria-label={item.type}
              >
                {item.type === 'prev' && <Arrow className={'w-3 h-3 rotate-180'} />}
                {item.type === 'next' && <Arrow className={'w-3 h-3'} />}
                {item.type === 'prev_10' && <DoubleArrow className={'w-3 h-3 rotate-180'} />}
                {item.type === 'next_10' && <DoubleArrow className={'w-3 h-3'} />}
                {item.type.indexOf('page') === 0 && item.index}
                {(item.type === 'prev_5' || item.type === 'next_5') && '...'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

type Type = {
  total: number;
  pageSizeOptions: number[];
  perPage: number;
  page: number;
  queryParams: ({ perPage, page }: { perPage: number; page: number }) => void;
  pageSizeRender: (sizePage: number) => string;
  pageSizeWidth: string;
  paginationDescription: (from: number, to: number, total: number) => string;
  idElement: string;
  className: string;
  firstPageDisabled: ({ page, lastIndex }: { page: number; lastIndex: number }) => boolean;
  lastPageDisabled: ({ page, lastIndex }: { page: number; lastIndex: number }) => boolean;
  firstPage: ({ page, lastIndex }: { page: number; lastIndex: number }) => number;
  lastPage: ({ page, lastIndex }: { page: number; lastIndex: number }) => number;
  showSizeChanger: boolean;
  showTotal: boolean;
};
export default Pagination;
