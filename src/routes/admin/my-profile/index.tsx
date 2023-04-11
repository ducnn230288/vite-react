import React, { Fragment, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Spin, Form } from '@components';
import { globalAction, useAppDispatch, useTypedSelector } from '@reducers';
import { ColumnProfile } from './column';

const Page = () => {
  const { t } = useTranslation();
  const { user, isLoading } = useTypedSelector((state: any) => state[globalAction.name]);
  const dispatch = useAppDispatch();
  const listPosition = useRef([]);

  const submit = async (values: any) => {
    dispatch(globalAction.putProfile(values));
  };

  useEffect(() => {
    dispatch(globalAction.profile());
  }, [dispatch]);
  return (
    <Fragment>
      <Spin className="intro-x" spinning={isLoading}>
        <Form
          className="intro-x w-[550px] mx-auto"
          columns={ColumnProfile({ t, listPosition: listPosition.current })}
          handSubmit={submit}
          disableSubmit={isLoading}
          values={{ ...user }}
        />
      </Spin>
    </Fragment>
  );
};
export default Page;
