import React, { useEffect, useState } from 'react';
import { BookingFacade, GlobalFacade } from '@store';
import type { Dayjs } from 'dayjs';
import { Calendar, Spin } from 'antd';
import type { CalendarProps } from 'antd';
import { keyRole, lang, routerLinks } from '@utils';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
const Page = () => {
  const { set, user } = GlobalFacade();
  const bookingFacade = BookingFacade();

  useEffect(() => {
    // if (!parameterFacade.result?.data) parameterFacade.get({});
    set({
      breadcrumbs: [
        { title: 'titles.Booking', link: '' },
        { title: 'titles.Booking/List', link: '' },
      ],
    });
    bookingFacade.get({
      perPage: 1000,
      filter: JSON.stringify({
        startTime: [dayjs().startOf('month').toISOString(), dayjs().endOf('month').toISOString()],
      }),
    });
  }, []);
  const monthCellRender = (date: Dayjs) => {
    const startDate = dayjs(date).startOf('month');
    const endDate = dayjs(date).endOf('month');
    const listData = bookingFacade.result?.data?.filter(
      (item) => dayjs(item.startTime) > startDate && dayjs(item.startTime) < endDate,
    );
    return listData?.length ? (
      <div className={'text-center'}>
        <h1 className={'text-2xl font-bold'}>{listData?.length}</h1>
        <p>Booking number</p>
      </div>
    ) : null;
  };

  const dateCellRender = (date: Dayjs) => {
    const startDate = dayjs(date).startOf('date');
    const endDate = dayjs(date).endOf('date');
    const listData = bookingFacade.result?.data?.filter(
      (item) => dayjs(item.startTime) > startDate && dayjs(item.startTime) < endDate,
    );
    return (
      <span>
        {listData
          ?.map((item) => dayjs(item.startTime).format('HH:mm') + ' - ' + dayjs(item.endTime).format('HH:mm'))
          .join(' |')}
      </span>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  const navigate = useNavigate();
  const [mode, set_mode] = useState<'month' | 'year'>('month');
  return (
    <div className={'p-5'}>
      <Spin spinning={bookingFacade.isLoading}>
        <Calendar
          className={'calendar-booking py-2 px-5'}
          cellRender={cellRender}
          onPanelChange={(date, mode) => {
            set_mode(mode);
            bookingFacade.get({
              perPage: 1000,
              filter: JSON.stringify({
                startTime: [dayjs(date).startOf(mode).toISOString(), dayjs(date).endOf(mode).toISOString()],
              }),
            });
          }}
          mode={mode}
          onSelect={(date, info) => {
            if (info.source === 'date') {
              user?.role?.permissions?.includes(keyRole.P_BOOKING_DETAIL) &&
                navigate(
                  `/${lang}${routerLinks('Booking')}/${date.format('YYYY-MM' + (info.source === 'date' ? '-DD' : ''))}`,
                );
            } else {
              set_mode('month');
              bookingFacade.get({
                perPage: 1000,
                filter: JSON.stringify({
                  startTime: [dayjs(date).startOf('month').toISOString(), dayjs(date).endOf('month').toISOString()],
                }),
              });
            }
          }}
        />
      </Spin>
    </div>
  );
};
export default Page;
