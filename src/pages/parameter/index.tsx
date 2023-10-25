import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import classNames from 'classnames';

import { lang, routerLinks } from '@utils';
import { GlobalFacade, ParameterFacade } from '@store';
import { createSearchParams } from 'react-router-dom';
import { Form } from '@core/form';
import { getQueryStringParams } from '@core/data-table';
import { EFormType } from '@models';

const Page = () => {
  const { set } = GlobalFacade();
  const parameterFacade = ParameterFacade();
  const location = useLocation();
  const request = getQueryStringParams(location.search);
  useEffect(() => {
    if (!parameterFacade.result?.data) parameterFacade.get({});
    set({
      breadcrumbs: [
        { title: 'titles.Setting', link: '' },
        { title: 'titles.Parameter', link: '' },
      ],
    });
    parameterFacade.getById({ id: request.code });
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (
      parameterFacade?.result?.data?.length &&
      !parameterFacade?.result?.data?.filter((item) => item.code === request.code).length
    ) {
      navigate({
        pathname: `/${lang}${routerLinks('Parameter')}`,
        search: `?${createSearchParams({ code: 'address' })}`,
      });
    }
  }, [parameterFacade.result]);

  const { t } = useTranslation();
  return (
    <div className={'container mx-auto grid grid-cols-12 gap-3 px-2.5 pt-2.5'}>
      <div className="col-span-12 md:col-span-4 lg:col-span-3 -intro-x">
        <div className="shadow rounded-xl w-full bg-white overflow-hidden">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>{t('titles.Parameter')}</h3>
          </div>
          <Spin spinning={parameterFacade.isLoading}>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto relative scroll hidden sm:block">
              {parameterFacade.result?.data?.map((data, index) => (
                <div
                  key={data.id}
                  className={classNames(
                    { 'bg-gray-100': request.code === data.code },
                    'item text-gray-700 font-medium hover:bg-gray-100 flex justify-between items-center border-b border-gray-100 w-full text-left  group',
                  )}
                >
                  <div
                    onClick={() => {
                      navigate({
                        pathname: `/${lang}${routerLinks('Parameter')}`,
                        search: `?${createSearchParams({ code: data.code! })}`,
                      });
                      parameterFacade.getById({ id: data.code! });
                    }}
                    className="truncate cursor-pointer flex-1 hover:text-teal-900 item-text px-4 py-2"
                  >
                    {index + 1}. <span className={'capitalize'}>{data.code}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 sm:p-0 block sm:hidden">
              <Select
                value={request.code}
                className={'w-full'}
                options={parameterFacade.result?.data?.map((data) => ({ label: data.code, value: data.code }))}
                onChange={(code) => {
                  navigate({
                    pathname: `/${lang}${routerLinks('Parameter')}`,
                    search: `?${createSearchParams({ code })}`,
                  });
                  parameterFacade.getById({ id: code });
                }}
              />
            </div>
          </Spin>
        </div>
      </div>
      <div className="col-span-12 md:col-span-8 lg:col-span-9 intro-x">
        <div className="shadow rounded-xl w-full overflow-auto bg-white">
          <div className="h-14 flex justify-between items-center border-b border-gray-100 px-4 py-2">
            <h3 className={'font-bold text-lg'}>{t('pages.Parameter/Edit', { type: request.code })}</h3>
          </div>
          <div className="sm:min-h-[calc(100vh-12rem)] overflow-y-auto p-3">
            <Spin spinning={parameterFacade.isLoading}>
              <Form
                values={{ ...parameterFacade.data }}
                className="intro-x"
                columns={[
                  {
                    title: 'routes.admin.Layout.Vietnam',
                    name: 'vn',
                    formItem: {
                      col: 6,
                      type: EFormType.textarea,
                    },
                  },
                  {
                    title: 'routes.admin.Layout.English',
                    name: 'en',
                    formItem: {
                      col: 6,
                      type: EFormType.textarea,
                    },
                  },
                ]}
                handSubmit={(values) => parameterFacade.put({ ...values, id: parameterFacade.data!.id })}
                disableSubmit={parameterFacade.isLoading}
              />
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
