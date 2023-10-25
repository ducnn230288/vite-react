import { CheckboxOptionType } from 'antd';

export enum ETableAlign {
  left = 'left',
  right = 'right',
  center = 'center',
}
export enum ETableFilterType {
  search = 'search',
  checkbox = 'checkbox',
  radio = 'radio',
  date = 'date',
}
export class DataTableModel {
  name?: string;
  title?: any;
  tableItem?: TableItem;
}

export class TableItem {
  filter?: TableItemFilter;
  width?: number;
  fixed?: string;
  sorter?: boolean;
  onCell?: (record: any) => { style?: any; onClick?: any; className?: string };
  align?: ETableAlign;
  onClick?: any;
  render?: (text: any, item: any) => JSX.Element | string;
  defaultSortOrder?: string;
  defaultFilteredValue?: string;
}

export class TableItemFilter {
  type?: ETableFilterType;
  list?: TableItemFilterList[];
  get?: TableGet;
  name?: string;
}

export class TableGet {
  facade?: any;
  key?: string;
  method?: string;
  format?: (item: any) => CheckboxOptionType;
  params?: (fullTextSearch: string, value?: any) => any;
  data?: any;
}

export class TableItemFilterList {
  label?: string;
  value?: string | number;
}
export class TableRefObject {
  constructor(
    public onChange: (request?: any) => void,
    public handleDelete: (id: string) => void,
  ) {}
}
