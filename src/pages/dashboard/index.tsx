import React, { Fragment, useEffect } from 'react';
import { t } from 'i18next';
import Draggabilly from 'draggabilly';
const Page = () => {
  useEffect(() => {
    new Draggabilly(document.getElementById('drag')!, {
      axis: 'x',
    }).on('pointerMove', (_, __, moveVector) => {
      const left = document.getElementById('left');
      const right = document.getElementById('right');
      if (left && right) {
        if (left.style.flexBasis.indexOf('%')) left.style.flexBasis = left.offsetWidth + 'px';
        if (right.style.flexBasis.indexOf('%')) right.style.flexBasis = right.offsetWidth + 'px';
        const width = left.parentElement!.offsetWidth;
        const p = moveVector.x;
        left.style.flexBasis = width / 2 + p + 'px';
        right.style.flexBasis = width / 2 - p + 'px';
      }

      // document.getElementById('right')
    });
  }, []);
  return (
    <Fragment>
      <div className="h-full pb-10">
        <h1 className="text-3xl text-teal-900 font-bold text-center mb-14 ">{t('routes.auth.login.Welcome')}</h1>
        <div className={'w-full flex relative'}>
          <div id={'left'} className={'overflow-hidden'} style={{ flexBasis: '50%' }}>
            <table className={'w-full'}>
              <thead>
                <tr>
                  <th align={'left'}>Product Release</th>
                  <th align={'left'}>Assignee</th>
                  <th align={'left'}>Status</th>
                  <th align={'left'}>Priority</th>
                  <th align={'left'}>Planned Hours</th>
                  <th align={'left'}>Work Log</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Q-1 Release</td>
                  <td></td>
                  <td>In Progress</td>
                  <td></td>
                  <td>2</td>
                  <td>71 days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id={'drag'} className={'w-1 h-16 bg-gray-300 cursor-ew-resize hover:bg-red-500 absolute left-1/2'}></div>
          <div id={'right'} className={'overflow-hidden'} style={{ flexBasis: '50%' }}>
            <table className={'w-full'}>
              <thead>
                <tr>
                  <th align={'left'}>Product Release</th>
                  <th align={'left'}>Assignee</th>
                  <th align={'left'}>Status</th>
                  <th align={'left'}>Priority</th>
                  <th align={'left'}>Planned Hours</th>
                  <th align={'left'}>Work Log</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Q-1 Release</td>
                  <td></td>
                  <td>In Progress</td>
                  <td></td>
                  <td>2</td>
                  <td>71 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
