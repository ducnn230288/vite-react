import React, { Fragment, useEffect, useState } from 'react';
import { t } from 'i18next';
import Draggabilly from 'draggabilly';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import classNames from 'classnames';
import { Arrow } from '@svgs';
const Page = () => {
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
  }, []);
  const remainingMonths = (date: any) => {
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
  const [date] = useState(remainingMonths(dayjs().startOf('year')));
  const task = [
    {
      name: 'Q-1 Release',
      assignee: '',
      status: 'Completed',
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
  const handleHover = (e: any) => {
    const index = e.target.parentElement.dataset.index;
    ['left', 'right'].forEach(
      (id) =>
        document
          .querySelectorAll(`#${id} > table > tbody > tr`)
          [index]?.querySelectorAll('td')
          .forEach((td: any) => td.classList.toggle('bg-blue-100')),
    );
  };
  const handleCollaps = (e: any) => {
    const index = e.target.parentElement.parentElement.parentElement.dataset.index;
    ['left', 'right'].forEach(
      (id) =>
        document
          .querySelectorAll(`#${id} > table > tbody > tr`)
          [index]?.querySelectorAll('td')
          .forEach((td: any) => ['h-6', 'h-0'].forEach((className) => td.classList.toggle(className))),
    );
  };

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
            <div id={'left'} className={'overflow-auto'} style={{ flexBasis: '50%' }}>
              <table className={'w-full min-w-[600px] border-b'}>
                <thead>
                  <tr>
                    <th align={'left'} className="capitalize border px-4 h-12 text-xs">
                      Product Release
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-12 text-xs">
                      Assignee
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-12 text-xs">
                      Status
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-12 text-xs">
                      Priority
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-12 text-xs">
                      Planned Hours
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-12 text-xs">
                      Work Log
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {task.map((item, index) => (
                    <tr key={index} onMouseOver={handleHover} onMouseOut={handleHover} data-index={index}>
                      <td className="border-x px-4 h-6">
                        <div className={'flex items-center'} style={{ paddingLeft: item.level * 12 + 'px' }}>
                          {!!task[index + 1] && task[index + 1].level > item.level && (
                            <Arrow onClick={handleCollaps} className={'w-4 h-4 -ml-4 cursor-pointer'} />
                          )}
                          {item.name}
                        </div>
                      </td>
                      <td className="border-x px-4 h-6">{item.assignee}</td>
                      <td className="border-x px-4 h-6">{item.status}</td>
                      <td className="border-x px-4 h-6">{item.priority}</td>
                      <td className="border-x px-4 h-6">{item.planned}</td>
                      <td className="border-x px-4 h-6">{item.work}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div id={'right'} className={'overflow-auto'} style={{ flexBasis: '50%' }}>
              <table className={'w-full min-w-[600px] border-b'} style={{ width: date.total * 36 + 'px' }}>
                <thead>
                  <tr>
                    {Object.keys(date.obj).map((year) =>
                      Object.keys(date.obj[year]).map((month, index) => (
                        <th
                          key={index}
                          align={'left'}
                          className={'capitalize border-l border-r border-t px-4 h-6 text-xs'}
                          colSpan={date.obj[year][month].length}
                        >
                          {dayjs().month(parseInt(month)).format('MMMM')} {year}
                        </th>
                      )),
                    )}
                  </tr>
                  <tr>
                    {Object.keys(date.obj).map((year) =>
                      Object.keys(date.obj[year]).map((month) =>
                        date.obj[year][month].map((day: Dayjs, index: number) => (
                          <th key={index} className={'capitalize border font-normal h-6 text-xs'}>
                            {day.format('DD')}
                          </th>
                        )),
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {task.map((item, index) => (
                    <tr key={index} onMouseOver={handleHover} onMouseOut={handleHover} data-index={index}>
                      {Object.keys(date.obj).map((year) =>
                        Object.keys(date.obj[year]).map((month) =>
                          date.obj[year][month].map((day: Dayjs, i: number) => (
                            <td key={i} className={'capitalize border-x font-normal h-6 relative'}>
                              {day.diff(item.startDate, 'day') <= 2 && day.diff(item.startDate, 'day') > -1 && (
                                <div
                                  className={classNames('absolute top-0.5 z-10', {
                                    'h-4 bg-gray-400': !!task[index + 1] && task[index + 1].level > item.level,
                                    'h-5 rounded-md bg-blue-400':
                                      !task[index + 1] || task[index + 1].level <= item.level,
                                  })}
                                  style={{
                                    width: item.endDate.diff(day, 'day') * 12 + 'px',
                                    marginLeft: item.startDate.diff(day, 'day') * 12 + 'px',
                                  }}
                                >
                                  <div
                                    className={classNames('text-center text-white text-xs', {
                                      'h-4 bg-gray-600': !!task[index + 1] && task[index + 1].level > item.level,
                                      'h-5 bg-blue-600 pt-0.5': !task[index + 1] || task[index + 1].level <= item.level,
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
