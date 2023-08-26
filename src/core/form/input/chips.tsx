import React from 'react';
import classNames from 'classnames';
import { Button } from '../../button';
import { Times } from '@svgs';

const Component = ({
  onChange,
  value = [],
  placeholder,
  disabled,
}: {
  onChange?: (values: any[]) => void;
  value?: any[];
  placeholder: string;
  disabled: boolean;
}) => {
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && event.target.value) {
      value.push(event.target.value);
      onChange && onChange([...value]);
      event.target.value = '';
    }
  };

  return (
    <div
      className={classNames(
        'chips flex flex-wrap bg-white rounded-xl border px-4 border-solid border-gray-300 py-1.5 min-h-[2.65rem] items-center',
        { 'bg-gray-100': disabled },
      )}
    >
      {value.map((item: any, index: number) => (
        <div key={index} className="bg-teal-100 rounded-xl py-1 px-2 relative mr-2.5 -left-2.5">
          <Button
            icon={<Times className="h-5 w-5 fill-red-600" />}
            className="absolute rounded-full -top-1 -right-2 !bg-red-100 !text-red-600 leading-none z-auto"
            onClick={() => {
              value.splice(index, 1);
              onChange && onChange([...value]);
            }}
            disabled={disabled}
          />
          {item}
        </div>
      ))}
      <input
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        className={'flex flex-1 focus-visible:outline-0 h-[1.775rem]'}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
export default Component;
