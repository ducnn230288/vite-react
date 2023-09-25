import React, { Fragment, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import { useNavigate, useParams } from 'react-router';

import { GlobalFacade, BookingFacade } from '@store';
import { keyRole, lang, routerLinks } from '@utils';
import { Button } from '@core/button';
import { Plus } from '@svgs';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from 'react-i18next';

const Page = () => {
  const { formatDate, user, set } = GlobalFacade();

  const { date } = useParams();
  const bookingFacade = BookingFacade();
  const isReload = useRef(false);
  const param = JSON.parse(bookingFacade.queryParams || '{}');
  useEffect(() => {
    // if (id) bookingFacade.getById({ id });
    // else bookingFacade.set({ data: undefined });
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

  // const { data } = bookingFacade;
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className={'max-w-4xl mx-auto bg-white p-4 shadow rounded-xl'}>
        <div className={'flex justify-between items-center'}>
          <h3 className={'text-xl text-teal-900 font-bold'}>Room</h3>
          <div>
            {user?.role?.permissions?.includes(keyRole.P_DAYOFF_CREATE) && user.managerId && (
              <Button
                icon={<Plus className="icon-cud !h-5 !w-5" />}
                text={t('components.button.New')}
                onClick={() => navigate(`/${lang}${routerLinks('Booking')}/${date}/room/add`)}
              />
            )}
          </div>
        </div>
        <Spin spinning={bookingFacade.isLoading}>
          <table className="w-full mx-auto text-sm text-left text-gray-500 border">
            <tbody>
              {/*<tr className={'border-b'}>*/}
              {/*  <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">*/}
              {/*    {t('titles.Code')}*/}
              {/*  </th>*/}
              {/*  <td className="py-4 px-6">{data?.code}</td>*/}
              {/*</tr>*/}
              {/*<tr className={'border-b'}>*/}
              {/*  <th scope="row" className="py-4 px-6 font-medium text-right bg-gray-100">*/}
              {/*    {t('routes.admin.dayoff.Fullname')}*/}
              {/*  </th>*/}
              {/*  <td className="py-4 px-6">*/}
              {/*    {data?.staff?.name && <Avatar src={data.staff!.avatar!} text={data.staff?.name} />}*/}
              {/*  </td>*/}
              {/*</tr>*/}
            </tbody>
          </table>
        </Spin>
      </div>
    </Fragment>
  );
};
export default Page;
