import React, { forwardRef, Ref, useImperativeHandle } from 'react';
import { Form as FormAnt } from 'antd';

import { Form } from '../../form';
import { Modal } from '../../modal';
import { convertFormValue } from '@utils';
import { FormModel, FormModalRefObject } from '@models';

export const ModalForm = forwardRef(
  (
    {
      title,
      widthModal = 1200,
      columns,
      textSubmit,
      textCancel,
      className = '',
      footerCustom,
      facade,
      keyState = 'isVisible',
      keyPost = 'post',
      keyPut = 'put',
      keyData = 'data',
      ...propForm
    }: Type,
    ref: Ref<FormModalRefObject>,
  ) => {
    useImperativeHandle(ref, () => ({ handleEdit, handleDelete, form }));
    const [form] = FormAnt.useForm();

    const handleEdit = async (item: { id?: string } = {}, isGet = true) => {
      if (item.id && isGet) facade.getById({ id: item.id, keyState });
      else facade.set({ [keyState]: true, [keyData]: item });
    };
    const handleDelete = async (id: string) => facade.delete(id);

    return (
      <Modal
        facade={facade}
        keyState={keyState}
        widthModal={widthModal}
        textSubmit={textSubmit}
        textCancel={textCancel}
        className={className}
        footerCustom={footerCustom}
        title={() => title(facade[keyData])}
        onOk={async () => {
          return form
            .validateFields()
            .then(async (values) => {
              values = convertFormValue(columns, values);
              if (facade[keyData]?.id) facade[keyPut]({ ...values, id: facade[keyData].id });
              else facade[keyPost]({ ...values });
              return true;
            })
            .catch(() => false);
        }}
      >
        <Form {...propForm} values={{ ...facade[keyData] }} formAnt={form} columns={columns} />
      </Modal>
    );
  },
);
ModalForm.displayName = 'HookModalForm';
type Type = {
  facade?: any;
  keyState?: string;
  keyPost?: string;
  keyPut?: string;
  keyData?: string;
  title: (data: any) => string;
  widthModal?: number;
  columns: FormModel[];
  textSubmit?: string;
  textCancel?: string;
  className?: string;
  footerCustom?: (handleOk: () => Promise<any>, handleCancel: () => void) => JSX.Element[] | JSX.Element;
  idElement?: string;
};
