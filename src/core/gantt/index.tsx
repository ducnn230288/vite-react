import React, { Fragment, useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import dayjs, { Dayjs } from 'dayjs';
import Draggabilly from 'draggabilly';
import { gsap } from 'gsap';
import { Arrow } from '@svgs';
import classNames from 'classnames';

export const Gantt = ({
  widthColumnDay = 36,
  dateStart,
  task = [],
  event = [],
}: {
  widthColumnDay: number;
  dateStart: Dayjs;
  task: {
    name: string;
    assignee?: string;
    status?: string;
    priority?: string;
    planned?: number;
    work?: number;
    startDate: Dayjs;
    endDate?: Dayjs;
    percent?: number;
    level: number;
  }[];
  event: {
    name: string;
    startDate: Dayjs;
    endDate?: Dayjs;
  }[];
}) => {
  const id = useRef('gantt-' + nanoid());
  useEffect(() => {
    dayjs.locale('vi');
    let wLeft = 0;
    let wRight = 0;
    const left = document.querySelector(`#${id.current} .left`);
    const right = document.querySelector(`#${id.current} .right`);
    new Draggabilly(document.querySelector(`#${id.current} .drag-side`)!, {
      axis: 'x',
    })
      .on('dragStart', () => {
        if (left && right) {
          const width = left.parentElement!.offsetWidth;
          if (left.style.flexBasis.indexOf('%') > 0) left.style.flexBasis = width / 2 + 'px';
          if (right.style.flexBasis.indexOf('%') > 0) right.style.flexBasis = width / 2 + 'px';
          wLeft = parseFloat(left.style.flexBasis.split('px')[0]);
          wRight = parseFloat(right.style.flexBasis.split('px')[0]);
        }
      })
      .on('dragMove', (_, __, moveVector) => {
        if (left && right) {
          const p = moveVector.x;
          left.style.flexBasis = wLeft + p + 'px';
          right.style.flexBasis = wRight - p + 'px';
        }
      });

    setTimeout(() => {
      let widthDrag = 0;
      let index = 0;
      document.querySelectorAll(`#${id.current} .drag`).forEach((e) =>
        new Draggabilly(e, {
          axis: 'x',
        })
          .on('dragStart', () => {
            if (e.parentElement) widthDrag = e.parentElement.offsetWidth;
            if (e.parentElement?.parentElement)
              index = Array.prototype.slice.call(e.parentElement.parentElement.children).indexOf(e.parentElement);
          })
          .on('dragMove', (_, __, moveVector) => {
            if (e.parentElement) e.parentElement.style.width = widthDrag + moveVector.x + 'px';
            document.querySelector(`#${id.current} .left tbody > tr > td:nth-of-type(${index + 1})`)!.style.width =
              widthDrag + moveVector.x + 'px';
          })
          .on('dragEnd', () => {
            e.style.removeProperty('left');
            e.style.removeProperty('top');
          }),
      );
    });
  }, []);

  const remainingMonths = (date: Dayjs) => {
    const month = date.month();
    const year = date.year();
    const objDate: any = {};
    let totalDay = 1;
    let lengthDay = 0;
    for (let i = month; i < 12; i++) {
      if (!objDate[year]) objDate[year] = {};
      if (!objDate[year][i]) objDate[year][i] = [];
      const dayInMonth = dayjs().month(i).daysInMonth();
      for (let j = totalDay; j <= dayInMonth; j += 3) {
        if (j + 3 > dayInMonth) totalDay = j + 3 - dayInMonth;
        objDate[year][i].push(dayjs(year + '-' + (i < 10 ? '0' : '') + (i + 1) + '-' + (j < 10 ? '0' : '') + j));
      }
      lengthDay += objDate[year][i].length;
    }
    return { obj: objDate, total: lengthDay };
  };
  const [date] = useState(remainingMonths(dateStart));

  const getScrollBarWidth = () => {
    const el = document.createElement('div');
    el.style.cssText = 'overflow:scroll; visibility:hidden; position:absolute;';
    document.body.appendChild(el);
    const width = el.offsetWidth - el.clientWidth;
    el.remove();
    return width;
  };

  useEffect(() => {
    if (task.length)
      document.querySelectorAll(`#${id.current} .left tbody > tr:nth-of-type(1) > td`).forEach((e, index, arr) => {
        document.querySelector(`#${id.current} .left thead > tr > th:nth-of-type(${index + 1})`)!.style.width =
          e.clientWidth + (arr.length - 1 === index ? getScrollBarWidth() : 0) + 'px';
        e.style.width = e.clientWidth + 'px';
      });
  }, [task]);

  const loopGetDataset = (e: HTMLElement, key: string): HTMLElement => {
    if (e.parentElement && Object.prototype.hasOwnProperty.call(e.parentElement.dataset, key)) return e.parentElement;
    else if (e.parentElement) return loopGetDataset(e.parentElement, key);
    else return e;
  };
  const handleHover = (e: any) => {
    if (e.target) {
      const index = parseInt(loopGetDataset(e.target as HTMLElement, 'index').dataset.index!) + 1;
      ['left', 'right'].forEach(
        (className) =>
          document
            .querySelector(`#${id.current} .${className} tbody > tr:nth-of-type(${index})`)
            ?.querySelectorAll('td')
            .forEach((td: HTMLTableCellElement) => td.classList.toggle('bg-blue-100')),
      );
    }
  };
  const time = useRef<any>({});
  const handleCollapse = (e: any) => {
    const index = parseInt(e.target.parentElement.parentElement.parentElement.dataset.index);
    const level = parseInt(e.target.parentElement.parentElement.parentElement.dataset.level);

    if (time.current[index]) {
      time.current[index][time.current[index].reversed() ? 'play' : 'reverse']();
      return;
    } else {
      time.current[index] = gsap.timeline({ defaults: { duration: 0.2, ease: 'power1.inOut' } });
      time.current[index].to(e.target, { transform: 'rotate(0deg)' }, '0');
    }

    ['left', 'right'].forEach((className) => {
      let isCollapse = true;
      document.querySelectorAll(`#${id.current} .${className} tbody > tr`).forEach((tr: any) => {
        const trIndex = parseInt(tr.dataset.index);
        const trLevel = parseInt(tr.dataset.level);
        if (trIndex > index && isCollapse) {
          if (trLevel > level) {
            tr.querySelectorAll('td').forEach((td: any) => {
              time.current[index].to(td, { fontSize: '-0px', lineHeight: '-0px', height: '-0px', opacity: '-0' }, '0');
              time.current[index].to(td.querySelector('svg'), { height: '-0px', width: '-0px' }, '0');
            });
          } else isCollapse = false;
        }
      });
    });
  };

  const handleScroll = (e: any) => {
    document.querySelector(`#${id.current} .event`)!.style.top = e.target.scrollTop + 'px';
    ['left', 'right'].forEach((className) =>
      document.querySelector(`#${id.current} .${className} .overflow-scroll`)!.scrollTo({ top: e.target.scrollTop }),
    );
  };
  const NameColumn = ({ name, isDrag = true }: { name: string; isDrag?: boolean }) => (
    <th align={'left'} className="capitalize border px-4 h-12 text-xs relative">
      {name}
      {isDrag && <div className="w-0.5 h-12 absolute right-0 top-0 cursor-ew-resize drag"></div>}
    </th>
  );

  return (
    <div id={id.current} className="relative">
      <div
        className={'w-1 h-full bg-gray-300 cursor-ew-resize hover:bg-red-500 absolute left-1/2 -ml-0.5 drag-side'}
      ></div>
      <div className={'w-full flex gap-0.5'}>
        <div className={'left overflow-hidden'} style={{ flexBasis: '50%' }}>
          <table className={'w-full min-w-[600px]'}>
            <thead>
              <tr>
                <NameColumn name={'Product Release'}></NameColumn>
                <NameColumn name={'Assignee'}></NameColumn>
                <NameColumn name={'Status'}></NameColumn>
                <NameColumn name={'Priority'}></NameColumn>
                <NameColumn name={'Planned'}></NameColumn>
                <NameColumn name={'Work Log'} isDrag={false}></NameColumn>
              </tr>
            </thead>
          </table>

          <div className="overflow-scroll h-64" onScroll={handleScroll}>
            <table className={'w-full min-w-[600px] border-b'}>
              <tbody>
                {task.map((item, index) => (
                  <tr
                    key={index}
                    onMouseOver={handleHover}
                    onMouseOut={handleHover}
                    data-index={index}
                    data-level={item.level}
                  >
                    <td className="border-x pl-5 py-0 h-6 overflow-hidden">
                      <div
                        className={'flex items-center gap-1'}
                        style={{ paddingLeft: item.level * (widthColumnDay / 3) + 'px' }}
                      >
                        {!!task[index + 1] && task[index + 1].level > item.level && (
                          <Arrow onClick={handleCollapse} className={'w-3 h-3 -ml-4 cursor-pointer rotate-90'} />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="border-x px-4 py-0 h-6">{item.assignee}</td>
                    <td
                      className={classNames('border-x px-4 py-0 h-6 text-white', {
                        'bg-blue-600': item.status === 'In Progress',
                        'bg-green-600': item.status === 'Completed',
                        'bg-gray-600': item.status === 'On Hold',
                      })}
                    >
                      {item.status}
                    </td>
                    <td
                      className={classNames('border-x px-4 py-0 h-6 text-white', {
                        'bg-red-500': item.priority === 'Critical',
                        'bg-orange-500': item.priority === 'High',
                        'bg-yellow-500': item.priority === 'Normal',
                      })}
                    >
                      {item.priority}
                    </td>
                    <td className="border-x px-4 py-0 h-6">{item.planned} hours</td>
                    <td className="border-x px-4 py-0 h-6">{item.work} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={'right relative overflow-hidden'} style={{ flexBasis: '50%' }}>
          <table className={'w-full min-w-[600px]'} style={{ width: date.total * widthColumnDay + 'px' }}>
            <thead>
              <tr>
                {Object.keys(date.obj).map((year) =>
                  Object.keys(date.obj[year]).map((month, index) => (
                    <th
                      key={index}
                      align={'left'}
                      className={'capitalize border-l border-r border-t px-4 h-6 text-xs'}
                      style={{
                        width: dayjs().year(parseInt(year)).month(parseInt(month)).daysInMonth() * 12 + 'px',
                      }}
                    >
                      {dayjs().month(parseInt(month)).format('MMMM')} {year}
                    </th>
                  )),
                )}
              </tr>
            </thead>
          </table>
          <table className={'w-full min-w-[600px]'} style={{ width: date.total * widthColumnDay + 'px' }}>
            <thead>
              <tr>
                {Object.keys(date.obj).map((year) =>
                  Object.keys(date.obj[year]).map((month) =>
                    date.obj[year][month].map((day: Dayjs, index: number) => (
                      <th key={index} className={'capitalize border-x font-normal h-6 text-xs'}>
                        {day.format('DD')}
                      </th>
                    )),
                  ),
                )}
              </tr>
            </thead>
          </table>

          <div className="overflow-scroll h-64 relative" onScroll={handleScroll}>
            <div
              className="event h-full absolute top-0 left-0 flex"
              style={{ width: date.total * widthColumnDay + 'px' }}
            >
              {event.map((item, index) => {
                if (item.endDate)
                  return (
                    <div
                      key={index}
                      className={'bg-gray-200 h-full absolute flex items-center justify-center'}
                      style={{
                        width: (item.endDate.diff(item.startDate, 'day') + 1) * 12 + 'px',
                        left: item.startDate.diff(dateStart, 'day') * 12 + 'px',
                      }}
                    >
                      <div
                        className="rotate-90 whitespace-nowrap w-0 text-center"
                        style={{ marginTop: -item.name.length * 6 + 'px' }}
                      >
                        {item.name}
                      </div>
                    </div>
                  );
                else
                  return (
                    <div
                      key={index}
                      className={
                        'border-red-600 border-l border-dashed h-full absolute flex justify-center items-center'
                      }
                      style={{
                        left: item.startDate.diff(dateStart, 'day') * 12 + 'px',
                      }}
                    >
                      <div className="px-2 py-1 bg-red-500 text-white rounded-r-xl">{item.name}</div>
                    </div>
                  );
              })}
            </div>
            <table className={'w-full min-w-[600px] border-b'} style={{ width: date.total * widthColumnDay + 'px' }}>
              <tbody>
                {task.map((item, index) => (
                  <tr
                    key={index}
                    onMouseOver={handleHover}
                    onMouseOut={handleHover}
                    data-index={index}
                    data-level={item.level}
                  >
                    {Object.keys(date.obj).map((year) =>
                      Object.keys(date.obj[year]).map((month) =>
                        date.obj[year][month].map((day: Dayjs, i: number) => (
                          <td key={i} className={'capitalize border-x font-normal h-6 relative py-0'}>
                            {day.diff(item.startDate, 'day') <= 2 && day.diff(item.startDate, 'day') > -1 && (
                              <Fragment>
                                {!!item.endDate ? (
                                  <div
                                    className={classNames('absolute top-1 z-10 overflow-hidden h-4', {
                                      'bg-gray-400': !!task[index + 1] && task[index + 1].level > item.level,
                                      'rounded-md bg-blue-400': !task[index + 1] || task[index + 1].level <= item.level,
                                    })}
                                    style={{
                                      width: (item.endDate.diff(day, 'day') + 1) * 12 + 'px',
                                      marginLeft: item.startDate.diff(day, 'day') * 12 + 'px',
                                    }}
                                  >
                                    <div
                                      className={classNames('text-center text-white text-xs h-4', {
                                        'bg-gray-600': !!task[index + 1] && task[index + 1].level > item.level,
                                        'bg-blue-600': !task[index + 1] || task[index + 1].level <= item.level,
                                      })}
                                      style={{ width: item.percent + '%' }}
                                    >
                                      {item.percent}%
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={'absolute top-1.5 left-1.5 z-10 h-3 w-3 bg-black rotate-45 '}
                                    style={{ marginLeft: item.startDate.diff(day, 'day') * 12 + 'px' }}
                                  ></div>
                                )}
                              </Fragment>
                            )}
                          </td>
                        )),
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
