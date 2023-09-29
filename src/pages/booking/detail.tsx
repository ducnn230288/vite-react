import React, { Fragment, useEffect, useRef } from 'react';
import { Popconfirm, Spin, Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router';
import dayjs from 'dayjs';

import { GlobalFacade, BookingFacade } from '@store';
import { keyRole, lang, routerLinks } from '@utils';
import { Button } from '@core/button';
import { Plus, Trash } from '@svgs';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from 'react-i18next';

const Page = () => {
  const { user, set } = GlobalFacade();

  const { date } = useParams();
  const bookingFacade = BookingFacade();
  const isReload = useRef(false);
  const param = JSON.parse(bookingFacade.queryParams || '{}');
  useEffect(() => {
    // if (id) bookingFacade.getById({ id });
    // else bookingFacade.set({ data: undefined });
    bookingFacade.get({
      perPage: 1000,
      filter: JSON.stringify({
        startTime: [dayjs(date).startOf('date').toISOString(), dayjs(date).endOf('date').toISOString()],
      }),
    });
    set({
      breadcrumbs: [
        { title: 'titles.Booking', link: '' },
        { title: 'titles.Booking/List', link: '' },
        { title: 'pages.Booking/Detail', link: '' },
      ],
      titleOption: { date },
    });

    return () => {
      isReload.current && bookingFacade.get(param);
    };
  }, [date]);
  const navigate = useNavigate();

  useEffect(() => {
    switch (bookingFacade.status) {
      case 'delete.fulfilled':
        bookingFacade.get({
          perPage: 1000,
          filter: JSON.stringify({
            startTime: [dayjs(date).startOf('date').toISOString(), dayjs(date).endOf('date').toISOString()],
          }),
        });
        break;
    }
  }, [bookingFacade.status]);

  // const { data } = bookingFacade;
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className={'max-w-5xl mx-auto bg-white p-4 shadow rounded-xl'}>
        <div className={'flex justify-between items-center'}>
          <h3 className={'text-xl text-teal-900 font-bold'}>Room</h3>
          <div>
            {user?.role?.permissions?.includes(keyRole.P_BOOKING_CREATE) && (
              <Button
                icon={<Plus className="icon-cud !h-5 !w-5" />}
                text={t('components.button.New')}
                onClick={() => navigate(`/${lang}${routerLinks('Booking')}/${date}/room/add`)}
              />
            )}
          </div>
        </div>
        <Spin spinning={bookingFacade.isLoading}>
          {bookingFacade?.result?.data?.length ? (
            <table className="w-full mx-auto text-sm text-left text-gray-500 border mt-4">
              <thead>
                <tr>
                  <th scope="row" className="py-4 px-6 font-medium bg-gray-100">
                    {t('Time')}
                  </th>
                  <th scope="row" className="py-4 px-6 font-medium bg-gray-100">
                    {t('Room')}
                  </th>
                  <th scope="row" className="py-4 px-6 font-medium bg-gray-100">
                    {t('Name')}
                  </th>
                  <th scope="row" className="py-4 px-6 font-medium bg-gray-100">
                    {t('Description')}
                  </th>
                  <th scope="row" className="py-4 font-medium bg-gray-100"></th>
                </tr>
              </thead>

              <tbody>
                {bookingFacade.result?.data
                  ?.filter((item) => item.typeCode === 'room')
                  .map((data, index) => (
                    <tr className={'border-b'} key={index}>
                      <td className="py-4 px-6">
                        {dayjs(data?.startTime).format('HH:mm')} - {dayjs(data?.endTime).format('HH:mm')}
                      </td>
                      <td className="py-4 px-6">{data?.item?.name}</td>
                      <td className="py-4 px-6">{data?.name}</td>
                      <td className="py-4 px-6">{data?.description}</td>
                      <td>
                        {user?.role?.permissions?.includes(keyRole.P_BOOKING_DELETE) && (
                          <Tooltip title={t('routes.admin.Layout.Delete')}>
                            <Popconfirm
                              placement="left"
                              title={t('components.datatable.areYouSureWant')}
                              onConfirm={() => bookingFacade.delete(data.id!)}
                              okText={t('components.datatable.ok')}
                              cancelText={t('components.datatable.cancel')}
                            >
                              <button title={t('routes.admin.Layout.Delete') || ''}>
                                <Trash className="icon-cud bg-red-600 hover:bg-red-400" />
                              </button>
                            </Popconfirm>
                          </Tooltip>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className={'text-center'}>{t(`components.datatable.No Data`)}</div>
          )}
        </Spin>
      </div>
    </Fragment>
  );
};
export default Page;
