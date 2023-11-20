import React, { Fragment } from 'react';
import { t } from 'i18next';

const Page = () => {
  return (
    <Fragment>
      <div className="h-full pb-10">
        <div className="bg-white rounded-xl p-4 pb-10 relative text-center flex justify-center items-end h-[78vh]">
          <div className="w-full ">
            <h1 className="text-3xl text-teal-900 font-bold text-center mb-14 ">{t('routes.auth.login.Welcome')}</h1>
            <div className="h-64 sm:h-72 md:h-72 lg:h-80 w-full">
              <img src={'/assets/images/dashboard.png'} alt={'dashboard'} className="w-full h-full block"></img>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
