import React, { PropsWithChildren, useEffect } from 'react';

import { GlobalFacade } from '@store';

import './index.less';

const Layout = ({ children }: PropsWithChildren) => {
  const globalFacade = GlobalFacade();

  useEffect(() => {
    globalFacade.logout();
  }, []);

  return (
    <div className="bg-white h-full relative ">
      <div className="block lg:flex h-full">
        <div className="bg-[url('../../assets/svgs/member.svg')] w-full bg-cover bg-no-repeat min-h-full h-screen hidden lg:block"></div>
        <div className="w-full h-screen grid items-start p-10 lg:items-center lg:p-0">
          <div className="block justify-center lg:flex">
            <div className="lg:max-w-xl mx-auto lg:p-10">{children}</div>
            <div></div>
          </div>
        </div>
      </div>
      {/* <div className="bg-[url('../../assets/images/login-f.png')] overflow-hidden w-full h-28 bg-cover bg-no-repeat absolute bottom-0 z-10">
        <div className='absolute top-1/2 right-1/2 translate-x-1/2 z-20 font-medium text-white text-center'>Powered By ARI Technology Co ., JSC</div>
      </div> */}
    </div>
  );
};
export default Layout;
