import React, { Fragment, useEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import Draggabilly from 'draggabilly';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import { gsap } from 'gsap';

import classNames from 'classnames';
import { Arrow } from '@svgs';
const Page = () => {
  const widthColumnDay = 36;
  const dateStart = useRef<Dayjs>(dayjs().startOf('year'));

  useEffect(() => {
    dayjs.locale('vi');
    let wLeft = 0;
    let wRight = 0;
    const left = document.getElementById('left');
    const right = document.getElementById('right');
    new Draggabilly(document.getElementById('drag')!, {
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
      document.querySelectorAll('.drag').forEach((e) =>
        new Draggabilly(e, {
          axis: 'x',
        })
          .on('dragStart', () => {
            if (e.parentElement) widthDrag = e.parentElement.offsetWidth;
          })
          .on('dragMove', (_, __, moveVector) => {
            if (e.parentElement) e.parentElement.style.width = widthDrag + moveVector.x + 'px';
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
  const [date] = useState(remainingMonths(dateStart.current));
  const task = [
    {
      name: 'Q-1 Release',
      assignee: '',
      status: 'In Progress',
      priority: '',
      planned: 43,
      work: 42,
      startDate: dayjs('2023-01-04'),
      endDate: dayjs('2023-01-12'),
      percent: 86,
      level: 0,
    },
    {
      name: 'Roadmap',
      assignee: '',
      status: '',
      priority: '',
      planned: 43,
      work: 42,
      startDate: dayjs('2023-01-04'),
      endDate: dayjs('2023-01-12'),
      percent: 86,
      level: 1,
    },
    {
      name: 'Batch Editing',
      assignee: 'Martin Tamer',
      status: 'Completed',
      priority: 'High',
      planned: 43,
      work: 42,
      startDate: dayjs('2023-01-04'),
      endDate: dayjs('2023-01-12'),
      percent: 86,
      level: 2,
    },
    {
      name: 'Touch Interaction',
      assignee: 'Jack Davolio',
      status: 'Completed',
      priority: 'Normal',
      planned: 14,
      work: 18,
      startDate: dayjs('2023-01-07'),
      endDate: dayjs('2023-01-18'),
      percent: 50,
      level: 2,
    },
    {
      name: 'PDF Export',
      assignee: 'Rose Fuller',
      status: 'On Hold',
      priority: 'Normal',
      planned: 45,
      work: 42,
      startDate: dayjs('2023-01-05'),
      endDate: dayjs('2023-01-14'),
      percent: 72,
      level: 0,
    },
    {
      name: 'Drag Multi-selection',
      assignee: 'Fuller King',
      status: 'Completed',
      priority: 'Critical',
      planned: 32,
      work: 33,
      startDate: dayjs('2023-01-06'),
      endDate: dayjs('2023-01-16'),
      percent: 100,
      level: 0,
    },
    {
      name: 'Touch Interaction',
      assignee: 'Jack Davolio',
      status: 'Completed',
      priority: 'Normal',
      planned: 14,
      work: 18,
      startDate: dayjs('2023-01-07'),
      endDate: dayjs('2023-01-18'),
      percent: 50,
      level: 0,
    },

    {
      name: 'Q-1 Release',
      assignee: '',
      status: 'In Progress',
      priority: '',
      planned: 43,
      work: 42,
      startDate: dayjs('2023-01-04'),
      endDate: dayjs('2023-01-12'),
      percent: 86,
      level: 0,
    },
    {
      name: 'Roadmap',
      assignee: '',
      status: '',
      priority: '',
      planned: 43,
      work: 42,
      startDate: dayjs('2023-01-04'),
      endDate: dayjs('2023-01-12'),
      percent: 86,
      level: 1,
    },
    {
      name: 'Batch Editing',
      assignee: 'Martin Tamer',
      status: 'Completed',
      priority: 'High',
      planned: 43,
      work: 42,
      startDate: dayjs('2023-01-04'),
      endDate: dayjs('2023-01-12'),
      percent: 86,
      level: 2,
    },
    {
      name: 'Touch Interaction',
      assignee: 'Jack Davolio',
      status: 'Completed',
      priority: 'Normal',
      planned: 14,
      work: 18,
      startDate: dayjs('2023-01-07'),
      endDate: dayjs('2023-01-18'),
      percent: 50,
      level: 2,
    },
    {
      name: 'PDF Export',
      assignee: 'Rose Fuller',
      status: 'On Hold',
      priority: 'Normal',
      planned: 45,
      work: 42,
      startDate: dayjs('2023-01-05'),
      endDate: dayjs('2023-01-14'),
      percent: 72,
      level: 0,
    },
    {
      name: 'Drag Multi-selection',
      assignee: 'Fuller King',
      status: 'Completed',
      priority: 'Critical',
      planned: 32,
      work: 33,
      startDate: dayjs('2023-01-06'),
      endDate: dayjs('2023-01-16'),
      percent: 100,
      level: 0,
    },
    {
      name: 'Touch Interaction',
      assignee: 'Jack Davolio',
      status: 'Completed',
      priority: 'Normal',
      planned: 14,
      work: 18,
      startDate: dayjs('2023-01-07'),
      endDate: dayjs('2023-01-18'),
      percent: 50,
      level: 0,
    },
  ];
  const event = [
    {
      name: 'New Year holiday',
      startDate: dayjs('2023-01-06'),
      endDate: dayjs('2023-01-7'),
    },
    {
      name: 'Christmas holidays',
      startDate: dayjs('2023-01-10'),
      endDate: dayjs('2023-01-12'),
    },
    {
      name: 'Q-1 Release',
      startDate: dayjs('2023-01-13'),
    },
    {
      name: 'Q-2 Release',
      startDate: dayjs('2023-02-01'),
    },
    {
      name: 'Q-3 Release',
      startDate: dayjs('2023-03-02'),
    },
  ];

  const loopGetDataset = (e: HTMLElement, key: string): HTMLElement => {
    if (e.parentElement && Object.prototype.hasOwnProperty.call(e.parentElement.dataset, key)) return e.parentElement;
    else if (e.parentElement) return loopGetDataset(e.parentElement, key);
    else return e;
  };
  const handleHover = (e: any) => {
    if (e.target) {
      const index = parseInt(loopGetDataset(e.target as HTMLElement, 'index').dataset.index!);
      ['left', 'right'].forEach(
        (id) =>
          document
            .querySelector(`#${id} > table > tbody > tr:nth-of-type(${index})`)
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

    ['left', 'right'].forEach((id) => {
      let isCollapse = true;
      document.querySelectorAll(`#${id} > table > tbody > tr`).forEach((tr: any) => {
        const trIndex = parseInt(tr.dataset.index);
        const trLevel = parseInt(tr.dataset.level);
        if (trIndex > index && isCollapse) {
          if (trLevel > level) {
            tr.querySelectorAll('td').forEach((td: any) => {
              time.current[index].to(td, { fontSize: '-0px', lineHeight: '-0px', height: '-0px', opacity: '-0' }, '0');
            });
          } else isCollapse = false;
        }
      });
    });
  };
  const NameColumn = ({ name }: { name: string }) => (
    <th align={'left'} className="capitalize border px-4 h-12 text-xs relative">
      {name}
      <div className="w-0.5 h-12 absolute right-0 top-0 cursor-ew-resize hover:bg-gray-200 drag"></div>
    </th>
  );

  return (
    <Fragment>
      <div className="h-full pb-10">
        <h1 className="text-3xl text-teal-900 font-bold text-center mb-14 ">{t('routes.auth.login.Welcome')}</h1>
        <div className="relative">
          <div
            id={'drag'}
            className={'w-1 h-full bg-gray-300 cursor-ew-resize hover:bg-red-500 absolute left-1/2 -ml-0.5'}
          ></div>
          <div className={'w-full flex gap-0.5'}>
            <div id={'left'} className={'overflow-auto h-64'} style={{ flexBasis: '50%' }}>
              <table className={'w-full min-w-[600px] border-b'}>
                <thead>
                  <tr>
                    <NameColumn name={'Product Release'}></NameColumn>
                    <NameColumn name={'Assignee'}></NameColumn>
                    <NameColumn name={'Status'}></NameColumn>
                    <NameColumn name={'Priority'}></NameColumn>
                    <NameColumn name={'Planned'}></NameColumn>
                    <NameColumn name={'Work Log'}></NameColumn>
                  </tr>
                </thead>
                <tbody>
                  {task.map((item, index) => (
                    <tr
                      key={index}
                      onMouseOver={handleHover}
                      onMouseOut={handleHover}
                      data-index={index}
                      data-level={item.level}
                    >
                      <td className="border-x pl-5 py-0 h-6">
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
            <div id={'right'} className={'overflow-auto relative h-64'} style={{ flexBasis: '50%' }}>
              <div
                className="h-full absolute top-0 left-0 -z-10 pt-12 flex"
                style={{ width: date.total * widthColumnDay + 'px' }}
              >
                {event.map((item, index) => {
                  if (item.endDate)
                    return (
                      <div
                        key={index}
                        className={'bg-gray-200 h-[calc(100%-3rem)] absolute top-12 flex items-center justify-center'}
                        style={{
                          width: (item.endDate.diff(item.startDate, 'day') + 1) * 12 + 'px',
                          left: item.startDate.diff(dateStart.current, 'day') * 12 + 'px',
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
                          'border-red-600 border-l border-dashed h-[calc(100%-3rem)] absolute top-12 flex justify-center items-center'
                        }
                        style={{
                          left: item.startDate.diff(dateStart.current, 'day') * 12 + 'px',
                        }}
                      >
                        <div className="px-2 py-1 bg-red-500 text-white rounded-r-xl">{item.name}</div>
                      </div>
                    );
                })}
              </div>
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
              <table className={'w-full min-w-[600px] border-b'} style={{ width: date.total * widthColumnDay + 'px' }}>
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
    </Fragment>
  );
};
export default Page;
