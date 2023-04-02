import React, { Fragment, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import { Swappable } from '@shopify/draggable';
import { v4 } from 'uuid';
import { t } from 'i18next';
import { Popconfirm, Tooltip } from 'antd';
import { ModalForm } from '@components';
import { listStyle } from '@utils';

export const DraggableLayout = ({ value, onChange }: { value: any; onChange?: any }) => {
  const id = useRef(v4());
  const idNext = useRef();
  const indexEdit = useRef(-1);
  const [isLoading, set_isLoading] = useState(false);
  const [list, set_list] = useState(value);

  useEffect(() => {
    if (!isLoading) {
      const head = document.getElementsByTagName('head')[0];
      const style = document.createElement('style');
      style.setAttribute('id', 'style' + id.current);
      style.type = 'text/css';
      style.appendChild(document.createTextNode(convertCSS()));
      head.appendChild(style);
    } else {
      const style: any = document.getElementById('style' + id.current);
      style.innerHTML = '';
      style.appendChild(document.createTextNode(convertCSS()));
    }
    set_isLoading(false);
    setTimeout(() => {
      const containers = document.getElementById('draggable' + id.current);
      if (containers) {
        const draggable = new Swappable(containers, {
          draggable: '.draggable',
          handle: '.handle',
          mirror: {
            constrainDimensions: true,
          },
        });
        draggable.on('drag:out', ({ originalSource, over }: any) => {
          if (over.id !== originalSource.id) {
            idNext.current = over.id;
          }
        });
        draggable.on('drag:stop', ({ originalSource }: any) => {
          const indexNext: number = idNext.current || 0;
          const indexPrev = originalSource.id;
          const dataPrev = list[indexPrev];
          const dataNext = list[indexNext];
          list.splice(indexPrev, 1, { ...dataNext, col: dataPrev.col });
          list.splice(indexNext, 1, { ...dataPrev, col: dataNext.col });
          reload();
        });
      }
    });
  }, [list]);

  const reload = () => {
    set_isLoading(true);
    set_list([...list]);
    onChange(list);
  };

  const convertCSS = () => {
    let css = '';
    list.forEach((item: any, index: number) => {
      if (index === 0) {
        css += `#draggable${id.current} .draggable:first-child {grid-column: span ${item.col} / span ${item.col};}`;
      } else {
        css += `#draggable${id.current} .draggable:nth-child(${index + 1}) {grid-column: span ${item.col} / span ${
          item.col
        };} #draggable${id.current} .draggable.draggable--original~.draggable:nth-child(${
          index + 2
        }) {grid-column: span ${item.col} / span ${item.col};}`;
      }
    });
    return css;
  };
  const modalFormRef = useRef<any>();

  return (
    <Fragment>
      <div className="justify-end flex mb-2 gap-2">
        <div
          className="bg-blue-500 text-white px-2 h-7 rounded-md hover:bg-blue-400 inline-flex items-center gap-1"
          onClick={() => {
            indexEdit.current = -1;
            modalFormRef.current.handleEdit({ col: 4 });
          }}
        >
          <i className="las la-plus la-lg"></i>
          {t('routes.admin.Layout.Add')}
        </div>
      </div>
      {/*<ModalForm*/}
      {/*  ref={modalFormRef}*/}
      {/*  title={() => (indexEdit.current === -1 ? t('routes.admin.Layout.Add') : t('routes.admin.Layout.Edit'))}*/}
      {/*  isLoading={isLoading}*/}
      {/*  setIsLoading={set_isLoading}*/}
      {/*  columns={[*/}
      {/*    {*/}
      {/*      title: 'Name',*/}
      {/*      name: 'name',*/}
      {/*      formItem: {*/}
      {/*        col: 6,*/}
      {/*        rules: [{ type: 'required' }],*/}
      {/*      },*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: 'Style',*/}
      {/*      name: 'style',*/}
      {/*      formItem: {*/}
      {/*        col: 6,*/}
      {/*        type: 'select',*/}
      {/*        list: listStyle,*/}
      {/*      },*/}
      {/*    },*/}
      {/*    {*/}
      {/*      name: 'col',*/}
      {/*      title: 'Width',*/}
      {/*      formItem: {*/}
      {/*        type: 'slider',*/}
      {/*        min: 1,*/}
      {/*        max: 4,*/}
      {/*        sliderMarks: {*/}
      {/*          1: '25%',*/}
      {/*          2: '50%',*/}
      {/*          3: '75%',*/}
      {/*          4: '100%',*/}
      {/*        },*/}
      {/*        col: 6,*/}
      {/*        rules: [{ type: 'required' }],*/}
      {/*      },*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: t('Image'),*/}
      {/*      name: 'image',*/}
      {/*      formItem: {*/}
      {/*        col: 6,*/}
      {/*        type: 'upload',*/}
      {/*        mode: 'multiple',*/}
      {/*      },*/}
      {/*    },*/}
      {/*    {*/}
      {/*      title: 'Content',*/}
      {/*      name: 'content',*/}
      {/*      formItem: {*/}
      {/*        type: 'editor',*/}
      {/*      },*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*  Post={(value: any) => {*/}
      {/*    if (indexEdit.current === -1) {*/}
      {/*      list.push(value);*/}
      {/*    } else {*/}
      {/*      list.splice(indexEdit.current, 1, value);*/}
      {/*      indexEdit.current = -1;*/}
      {/*    }*/}
      {/*    reload();*/}
      {/*  }}*/}
      {/*  widthModal={600}*/}
      {/*  idElement={'user'}*/}
      {/*/>*/}
      {!isLoading && (
        <article id={'draggable' + id.current} className="w-full grid gap-2 grid-cols-4 mb-2">
          {list.map((item: any, index: number) => (
            <div className="draggable" id={index.toString()} key={index}>
              <div className="flex items-center gap-2 cursor-move">
                <i className="las la-arrows-alt la-lg handle" />
                {item.name}
              </div>
              <div>
                <Tooltip title={t('routes.admin.Layout.Edit')}>
                  <i
                    className="las la-edit la-lg cursor-pointer"
                    onClick={() => {
                      indexEdit.current = index;
                      modalFormRef.current.handleEdit(item);
                    }}
                  />
                </Tooltip>
                <Tooltip title={t('routes.admin.Layout.Delete')}>
                  <Popconfirm
                    placement="left"
                    title={t('components.datatable.areYouSureWant')}
                    icon={<i className="las la-question-circle text-2xl text-yellow-500 relative -top-1.5 left-1" />}
                    onConfirm={() => {
                      list.splice(index, 1);
                      reload();
                    }}
                    okText={t('components.datatable.ok')}
                    cancelText={t('components.datatable.cancel')}
                  >
                    <i className="las la-trash la-lg cursor-pointer" />
                  </Popconfirm>
                </Tooltip>
              </div>
            </div>
          ))}
        </article>
      )}
    </Fragment>
  );
};

DraggableLayout.propTypes = {
  value: PropTypes.array,
};

DraggableLayout.defaultProps = {
  value: [],
};
