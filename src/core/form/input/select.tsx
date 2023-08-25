import React, { useEffect, useState } from 'react';
import { FormInstance, Select } from 'antd';

import { TableGet } from '@models';
import { arrayUnique, cleanObjectKeyNull } from '@utils';

const Component = ({
  formItem,
  form,
  value,
  showSearch = true,
  maxTagCount,
  onChange,
  placeholder,
  disabled,
  get,
  ...prop
}: Type) => {
  const [_list, set_list] = useState(formItem.list ? formItem.list : []);
  const facade = get?.facade() || {};
  let list = !get ? _list : facade[get.key || 'result']?.data?.map(get.format).filter((item: any) => !!item.value);
  const [_temp, set_temp] = useState();
  const loadData = async (fullTextSearch: string) => {
    if (get) {
      const { time, queryParams } = facade;
      const params = cleanObjectKeyNull(
        get.params ? get.params(fullTextSearch, form.getFieldValue) : { fullTextSearch },
      );
      if (!facade[get.key || 'result'].data || new Date().getTime() > time || JSON.stringify(params) != queryParams)
        facade[get.method || 'get'](params);
    } else if (formItem.list) {
      set_list(
        formItem.list.filter(
          (item: any) =>
            !item?.label?.toUpperCase || item?.label?.toUpperCase().indexOf(fullTextSearch.toUpperCase()) > -1,
        ),
      );
    }
  };
  useEffect(() => {
    if (formItem.firstLoad) {
      facade.get(formItem.firstLoad());
    }
  }, []);

  useEffect(() => {
    if (get?.data) {
      let data = get.data();
      if (get?.format && data) {
        if (formItem.mode === 'multiple') data = data.map(get.format);
        else data = [get.format(data)];
        if (JSON.stringify(data) !== JSON.stringify(_temp)) set_temp(data);
      }
    }
  }, [get?.data]);
  if (_temp) list = list?.length ? arrayUnique([..._temp, ...list], 'value') : _temp;

  return (
    <Select
      maxTagCount={maxTagCount}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      listHeight={200}
      filterOption={false}
      showSearch={true}
      loading={facade?.isLoading || false}
      allowClear
      // onBlur={() => loadData('')}
      onSearch={showSearch ? (value) => loadData(value) : undefined}
      value={value}
      maxTagPlaceholder={(array) => '+' + array.length}
      mode={formItem.mode}
      optionFilterProp="label"
      onSelect={(value) => formItem?.onSelect && formItem?.onSelect(value, form)}
      onDropdownVisibleChange={(open) => open && !facade?.isLoading && loadData('')}
      {...prop}
    >
      {formItem &&
        list?.map((item: any, index: number) => (
          <Select.Option key={`${item.value}${index}`} value={item.value} disabled={item.disabled}>
            {item.label}
          </Select.Option>
        ))}
    </Select>
  );
};
type Type = {
  formItem: any;
  form: FormInstance;
  value?: any;
  showSearch?: boolean;
  maxTagCount: number | 'responsive';
  onChange: (e: any) => any;
  placeholder: string;
  disabled: boolean;
  get?: TableGet;
};
export default Component;
