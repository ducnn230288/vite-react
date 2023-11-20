import { CheckboxOptionType, FormInstance } from 'antd';
import { TableGet } from '../data-table';
export enum EFormType {
  onlyNumber = 'only_number',
  hidden = 'hidden',
  number = 'number',
  text = 'text',
  name = 'name',
  tab = 'tab',
  addable = 'addable',
  editor = 'editor',
  upload = 'upload',
  tableTransfer = 'table_transfer',
  password = 'password',
  textarea = 'textarea',
  slider = 'slider',
  sliderNumber = 'slider_number',
  date = 'date',
  dateRange = 'date_range',
  time = 'time',
  timeRange = 'time_range',
  checkbox = 'checkbox',
  radio = 'radio',
  tag = 'tag',
  chips = 'chips',
  select = 'select',
  treeSelect = 'tree_select',
  otp = 'otp',
  switch = 'switch',
}
export enum EFormModeSelect {
  multiple = 'multiple',
  tags = 'tags',
}
export enum EFormPickerDate {
  time = 'time',
  date = 'date',
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
}
export enum EFormRuleType {
  required = 'required',
  email = 'email',
  min = 'min',
  max = 'max',
  custom = 'custom',
  phone = 'phone',
  url = 'url',
  onlyText = 'only_text',
  onlyTextSpace = 'only_text_space',
  textarea = 'textarea',
}
export class FormModel {
  constructor(
    public name: string,
    public title: string = '',
    public formItem?: FormItem,
  ) {}
}

export class FormItem {
  type?: EFormType;
  col?: number;
  condition?: (value: string, form: FormInstance, index: number, values: any) => boolean;
  list?: CheckboxOptionType[];
  rules?: FormItemRule[];
  mode?: EFormModeSelect;
  tab?: string;
  column?: FormModel[];
  disabled?: (values: any, form?: FormInstance) => boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  sliderMarks?: Record<number, string>;
  symbol?: string;
  initialValues?: { start: string; end: string };
  convert?: (data: any) => any;
  onChange?: (value: any, form: FormInstance, reRender: any) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement, Element>, form: FormInstance, name: string) => void;
  disabledDate?: (current: any, form: FormInstance) => boolean;
  showTime?: boolean;
  picker?: EFormPickerDate;
  onCalendarChange?: (current: any, form: FormInstance, reRender: any) => void;
  api?: FormApi;
  get?: TableGet;
  label?: string;
  maxTagCount?: number;
  tag?: {
    avatar: string;
    label: string;
    value: string;
    params: (getFieldValue: any, fullTextSearch: string, value: any) => any;
    api: string;
  };
  showSearch?: boolean;
  mask?: any;
  addonBefore?: (form: FormInstance) => JSX.Element;
  addonAfter?: (form: FormInstance) => JSX.Element;
  maxLength?: number;
  textAdd?: string;
  onAdd?: (values: any, form: FormInstance) => void;
  isTable?: boolean;
  showRemove?: any;
  idCheck?: any;
  firstLoad?: (data: any) => void;
  notDefaultValid?: boolean;
  render?: (form: FormInstance, values: any, generateForm: void, index: number, reRender: void) => JSX.Element;
}
export class FormItemList {
  label?: string | JSX.Element;
  value: any;
  checked?: boolean;
}

export class FormItemRule {
  type?: EFormRuleType;
  message?: string;
  value?: any;
  validator?: ({ getFieldValue }: any) => { validator(rule: any, value: string): Promise<void> };
  min?: number;
  max?: number;
}

export class FormItemTab {
  label?: string;
  value: any;
  disabled?: boolean;
}
export class FormApi {
  link?: () => string;
  format?: (item: any) => CheckboxOptionType;
  params?: (form: FormInstance, fullTextSearch: string) => any;
}

export class FormModalRefObject {
  handleEdit?: (item?: { id?: string }, isGet?: boolean) => Promise<void>;
  handleDelete?: (id: string) => Promise<any>;
  form?: FormInstance<any>;
}
