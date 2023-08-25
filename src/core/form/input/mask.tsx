import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { FormInstance } from 'antd';

const Component = ({
  mask,
  value,
  addonBefore,
  addonAfter,
  form,
  disabled,
  maxLength,
  placeholder,
  onBlur,
  onChange,
  ...prop
}: Type) => {
  const input = useRef<any>();

  useEffect(() => {
    setTimeout(() => {
      if (mask && input.current) {
        // @ts-ignore
        import('inputmask').then(({ default: Inputmask }) => Inputmask(mask).mask(input.current));
      }
    });
  }, []);
  return (
    <div className={classNames('flex items-center', { 'ant-input border rounded-xl': !!addonBefore || !!addonAfter })}>
      {!!addonBefore && <div>{addonBefore(form)}</div>}
      <input
        ref={input}
        className={classNames('w-full h-10 text-gray-600 bg-white px-4', {
          'ant-input': !addonBefore && !addonAfter,
          'border rounded-xl': !addonBefore && !addonAfter,
          'rounded-l-xl border-r': !addonBefore && !!addonAfter,
          'rounded-r-xl border-l': !!addonBefore && !addonAfter,
          'border-r border-l': !!addonBefore && !!addonAfter,
          'bg-zinc-100 border-none focus:shadow-none text-zinc-400': disabled,
        })}
        readOnly={disabled}
        value={value || ''}
        maxLength={maxLength}
        placeholder={placeholder}
        onBlur={onBlur}
        onChange={onChange}
        {...prop}
      />
      {!!addonAfter && <div>{addonAfter(form)}</div>}
    </div>
  );
};
type Type = {
  mask?: string;
  value?: string;
  addonBefore?: (form: FormInstance) => JSX.Element;
  addonAfter?: (form: FormInstance) => JSX.Element;
  form: FormInstance;
  disabled: boolean;
  maxLength?: number;
  placeholder: string;
  onBlur: (e: any) => any;
  onChange: (e: any) => any;
};
export default Component;
