import React, { Fragment, useEffect, useState } from 'react';
import { t } from 'i18next';
import Draggabilly from 'draggabilly';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
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
        objDate[year][i].push(j);
      }
      lengthDay += objDate[year][i].length;
    }
    return { obj: objDate, total: lengthDay };
  };
  // .startOf('year')
  const [date, setMonths] = useState(remainingMonths(dayjs().startOf('year')));

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
              <table className={'w-full min-w-[600px]'}>
                <thead>
                  <tr>
                    <th align={'left'} className="capitalize border px-4 h-[calc(3.5rem+1px)]">
                      Product Release
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-[calc(3.5rem+1px)]">
                      Assignee
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-[calc(3.5rem+1px)]">
                      Status
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-[calc(3.5rem+1px)]">
                      Priority
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-[calc(3.5rem+1px)]">
                      Planned Hours
                    </th>
                    <th align={'left'} className="capitalize border px-4 h-[calc(3.5rem+1px)]">
                      Work Log
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 h-6">Q-1 Release</td>
                    <td className="border px-4 h-6"></td>
                    <td className="border px-4 h-6">In Progress</td>
                    <td className="border px-4 h-6"></td>
                    <td className="border px-4 h-6">2</td>
                    <td className="border px-4 h-6">71 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div id={'right'} className={'overflow-auto'} style={{ flexBasis: '50%' }}>
              <table className={'w-full min-w-[600px]'} style={{ width: date.total * 35 + 'px' }}>
                <thead>
                  <tr>
                    {Object.keys(date.obj).map((year) =>
                      Object.keys(date.obj[year]).map((month, index) => (
                        <th
                          key={index}
                          align={'left'}
                          className={'capitalize border-l border-r border-t px-4 h-6'}
                          style={{ width: date.obj[year][month].length * 35 + 'px' }}
                        >
                          {dayjs().month(parseInt(month)).format('MMMM')} {year}
                        </th>
                      )),
                    )}
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
              <table className={'w-full min-w-[600px]'} style={{ width: date.total * 35 + 'px' }}>
                <thead>
                  <tr>
                    {Object.keys(date.obj).map((year) =>
                      Object.keys(date.obj[year]).map((month) =>
                        date.obj[year][month].map((day: number, index: number) => (
                          <th key={index} className={'capitalize border font-normal h-8'}>
                            {day < 10 ? 0 : ''}
                            {day}
                          </th>
                        )),
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {Object.keys(date.obj).map((year) =>
                      Object.keys(date.obj[year]).map((month) =>
                        date.obj[year][month].map((day: number, index: number) => (
                          <td key={index} className={'capitalize border font-normal h-6'}></td>
                        )),
                      ),
                    )}
                  </tr>
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
