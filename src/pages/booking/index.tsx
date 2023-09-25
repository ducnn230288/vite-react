import React, { useEffect } from 'react';
import { t } from 'i18next';
import { BookingFacade, GlobalFacade } from '@store';
import type { Dayjs } from 'dayjs';
import { Badge, Calendar } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import { Modal } from '@core/modal';
import { keyRole, lang, routerLinks } from '@utils';
import { useNavigate } from 'react-router';
const getListData = (value: Dayjs) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'room', content: 'This is warning event.' },
        { type: 'room', content: 'This is usual event.' },
      ];
      break;
    case 10:
      listData = [
        { type: 'room', content: 'This is warning event.' },
        { type: 'room', content: 'This is usual event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'room', content: 'This is warning event' },
        { type: 'room', content: 'This is very long usual event' },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

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
    // parameterFacade.getById({ id: request.code });
  }, []);
  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };
  const navigate = useNavigate();
  return (
    <div className={'p-5'}>
      <Calendar
        className={'calendar-booking py-2 px-5'}
        cellRender={cellRender}
        onSelect={(date, info) => {
          // P_BOOKING_DETAIL
          user?.role?.permissions?.includes(keyRole.P_BOOKING_DETAIL) &&
            navigate(
              `/${lang}${routerLinks('Booking')}/${date.format('YYYY-MM' + (info.source === 'date' ? '-DD' : ''))}`,
            );
        }}
      />
      <Modal facade={bookingFacade} />
    </div>
  );
};
export default Page;
