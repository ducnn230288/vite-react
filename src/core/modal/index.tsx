import React, { forwardRef, useImperativeHandle, PropsWithChildren, Ref } from 'react';
import { Modal as AntModal, Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import { Button } from '../button';

export const Modal = forwardRef(
  (
    {
      facade,
      keyState = 'isVisible',
      title,
      widthModal = 800,
      onOk,
      firstChange = true,
      textSubmit,
      textCancel,
      className = '',
      footerCustom,
      children,
    }: Type,
    ref: Ref<{ handleCancel: () => any }>,
  ) => {
    useImperativeHandle(ref, () => ({ handleCancel }));
    const { data, isLoading, ...state } = facade;
    const { t } = useTranslation();
    const handleCancel = () => facade.set({ [keyState]: false });
    const handleOk = async () => {
      if (onOk) onOk();
      else handleCancel();
    };

    return (
      <AntModal
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        width={widthModal}
        title={title && <h3 className="font-bold text-lg">{title(data)}</h3>}
        open={state[keyState]}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={className}
        footer={
          !!onOk &&
          ((footerCustom && footerCustom(handleOk, handleCancel)) || (
            <div className="flex justify-end gap-2">
              <Button
                text={t(textCancel || '') || t('components.datatable.cancel')}
                className="!bg-white !text-teal-900 btn-cancel"
                onClick={handleCancel}
              />
              <Button
                isLoading={isLoading}
                text={t(textSubmit || '') || t('components.form.modal.save')}
                className="!bg-teal-900"
                disabled={!firstChange}
                onClick={handleOk}
              />
            </div>
          ))
        }
      >
        <Spin spinning={isLoading}>{children}</Spin>
      </AntModal>
    );
  },
);
Modal.displayName = 'HookModal';
type Type = PropsWithChildren<{
  facade: any;
  keyState?: string;
  title?: (data: any) => string;
  widthModal: number;
  onOk?: () => any;
  onCancel?: () => void;
  firstChange?: boolean;
  textSubmit?: string;
  textCancel?: string;
  className?: string;
  footerCustom?: (handleOk: () => Promise<void>, handleCancel: () => void) => JSX.Element[] | JSX.Element;
}>;
