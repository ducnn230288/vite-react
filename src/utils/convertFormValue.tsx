import dayjs from 'dayjs';
import { FormModel } from '@models';

export const convertFormValue = (columns: FormModel[], values: { [selector: string]: any }, exportData = true) => {
  columns
    .filter((item) => !!item && !!item.formItem)
    .map((item) => {
      if (item.formItem && item.formItem.convert) {
        values[item.name] = item.formItem.convert(values[item.name]);
      } else {
        switch (item.formItem!.type) {
          case 'switch':
            if (typeof values[item.name] === 'undefined') values[item.name] = false;
            break;
          case 'upload':
            if (values[item.name] && typeof values[item.name] === 'object' && exportData) {
              if (!item.formItem?.mode && values[item.name].length > 0) values[item.name] = values[item.name][0].url;
              else if (values[item.name].length > 1) {
                values[item.name] = values[item.name].filter((_item: any) => _item.status === 'done' || !_item.status);
              }
            }
            break;
          case 'date':
            if (values[item.name]) {
              if (exportData) {
                values[item.name] = values[item.name]
                  .add(new Date().getTimezoneOffset() / 60, 'hour')
                  .format('YYYY-MM-DDTHH:mm:ss[Z]');
              } else values[item.name] = dayjs(values[item.name]);
            }
            break;
          case 'date_range':
            if (!!values[item.name] || typeof item.name === 'object') {
              if (exportData) {
                values[item.name] = [
                  values[item.name][0]
                    .add(new Date().getTimezoneOffset() / 60, 'hour')
                    .format('YYYY-MM-DDTHH:mm:ss[Z]'),
                  values[item.name][1]
                    .add(new Date().getTimezoneOffset() / 60, 'hour')
                    .format('YYYY-MM-DDTHH:mm:ss[Z]'),
                ];
              } else values[item.name] = [dayjs(values[item.name][0]), dayjs(values[item.name][1])];
            }
            break;
          case 'number':
            if (!exportData && values && values[item.name])
              values[item.name] = !item.formItem?.mask ? parseFloat(values[item.name]) : values[item.name].toString();
            if (exportData) values[item.name] = parseFloat(values[item.name]);
            break;
          case 'tab':
            if (!exportData) {
              item?.formItem?.list?.sort((a: any, b: any) =>
                a[item!.formItem!.tab!] < b[item!.formItem!.tab!]
                  ? -1
                  : a[item!.formItem!.tab!] > b[item!.formItem!.tab!]
                  ? 1
                  : 0,
              );
              values[item.name] = item?.formItem?.list?.map((subItem, i) => {
                const result: { [selector: string]: any } = {
                  [item!.formItem!.tab!]: values[item.name]
                    ? values[item.name][i][item!.formItem!.tab!]
                    : subItem.value,
                };
                item!
                  .formItem!.column!.filter((col) => !!col.formItem)
                  .forEach((col) => {
                    switch (col!.formItem!.type) {
                      case 'upload':
                        result[col.name] =
                          values[item.name]?.length && values[item.name]
                            ? values[item.name][i][col.name] || null
                            : null;
                        break;
                      default:
                        result[col.name] =
                          values[item.name]?.length && values[item.name] ? values[item.name][i][col.name] || '' : '';
                    }
                  });
                return result;
              });
              if (values[item.name]?.length) {
                values[item.name]?.sort((a: any, b: any) =>
                  a[item!.formItem!.tab!] < b[item!.formItem!.tab!]
                    ? -1
                    : a[item!.formItem!.tab!] > b[item!.formItem!.tab!]
                    ? 1
                    : 0,
                );
              }
            }
            break;
          case 'select':
            if (!exportData && item?.formItem?.mode === 'multiple' && values[item.name]) {
              values[item.name] = values[item.name].map((item: any) => (item.id ? item.id : item));
            }
            break;
          case 'tree_select':
            if (values[item.name])
              values[item.name] = exportData ? values[item.name].value : { value: values[item.name] };
            break;
          case 'textarea':
            if (!exportData && !values[item.name]) values[item.name] = '';
            break;
          default:
            if (!item?.formItem?.mask && typeof values[item.name] === 'string') {
              values[item.name] = values[item.name].trim();
            } else if (
              !!item?.formItem?.mask &&
              item?.formItem?.mask?.alias === 'numeric' &&
              item?.formItem?.mask?.groupSeparator &&
              item?.formItem?.mask?.radixPoint &&
              item?.formItem?.mask?.onBeforePaste
            ) {
              values[item.name] =
                values[item.name] &&
                values[item.name]
                  .trim()
                  .replaceAll(item.formItem.mask.groupSeparator, '')
                  .replaceAll(item.formItem.mask.radixPoint, '.');
            }
        }
      }
      return item;
    });
  return values;
};
