import React, { Fragment } from 'react';
import { t } from 'i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Gantt } from '@core/gantt';

const Page = () => {
  const widthColumnDay = 36;
  const dateStart = dayjs('2015-07-01');
  const task = [
    {
      id: '1',
      name: 'Start Project',
      assignee: '',
      status: 'In Progress',
      priority: '',
      planned: 43,
      work: 42,
      startDate: dayjs('2015-07-06'),
      percent: 86,
      level: 0,
      success: '3,5,8',
    },
    {
      id: '2',
      name: 'Demolition',
      assignee: '',
      status: '',
      priority: '',
      planned: 43,
      work: 42,
      startDate: dayjs('2015-07-06'),
      endDate: dayjs('2015-07-15'),
      percent: 86,
      level: 1,
    },
    {
      id: '3',
      name: 'Remove fixtures and cabinets',
      assignee: 'Martin Tamer',
      status: 'Completed',
      priority: 'High',
      planned: 43,
      work: 42,
      startDate: dayjs('2015-07-06'),
      endDate: dayjs('2015-07-08'),
      percent: 1,
      level: 2,
      success: '4',
    },
    {
      id: '4',
      name: 'Demolish interior walls',
      assignee: 'Martin Tamer',
      status: 'Completed',
      priority: 'High',
      planned: 43,
      work: 42,
      startDate: dayjs('2015-07-09'),
      endDate: dayjs('2015-07-15'),
      percent: 86,
      level: 2,
      success: '6',
    },
    {
      id: '5',
      name: 'Remove siding',
      assignee: 'Jack Davolio',
      status: 'Completed',
      priority: 'Normal',
      planned: 14,
      work: 18,
      startDate: dayjs('2015-07-06'),
      endDate: dayjs('2015-07-07'),
      percent: 50,
      level: 2,
      success: '6',
    },
    {
      id: '6',
      name: 'Demolition complete',
      startDate: dayjs('2015-07-15'),
      level: 2,
    },
    {
      id: '7',
      name: 'Foundation',
      assignee: 'Rose Fuller',
      status: 'On Hold',
      priority: 'Normal',
      planned: 45,
      work: 42,
      startDate: dayjs('2015-07-06'),
      endDate: dayjs('2015-08-07'),
      percent: 72,
      level: 1,
    },
    {
      id: '8',
      name: 'Excavate for foundation',
      assignee: 'Fuller King',
      status: 'Completed',
      priority: 'Critical',
      planned: 32,
      work: 33,
      startDate: dayjs('2015-07-06'),
      endDate: dayjs('2015-07-14'),
      percent: 100,
      level: 2,
      success: '9',
    },
    {
      id: '9',
      name: 'Build foundation',
      assignee: 'Fuller King',
      status: 'Completed',
      priority: 'Critical',
      planned: 32,
      work: 33,
      startDate: dayjs('2015-07-15'),
      endDate: dayjs('2015-07-21'),
      percent: 100,
      level: 2,
      success: '10',
    },
    {
      id: '10',
      name: 'Drying Time',
      assignee: 'Fuller King',
      status: 'Completed',
      priority: 'Critical',
      planned: 32,
      work: 33,
      startDate: dayjs('2015-07-22'),
      endDate: dayjs('2015-08-04'),
      percent: 100,
      level: 2,
      success: '11',
    },
    {
      id: '11',
      name: 'Complete foundation inspection',
      assignee: 'Fuller King',
      status: 'Completed',
      priority: 'Critical',
      planned: 32,
      work: 33,
      startDate: dayjs('2015-08-05'),
      endDate: dayjs('2015-08-05'),
      percent: 100,
      level: 2,
      success: '12',
    },
    {
      id: '12',
      name: 'Backfill foundation',
      assignee: 'Fuller King',
      status: 'Completed',
      priority: 'Critical',
      planned: 32,
      work: 33,
      startDate: dayjs('2015-08-06'),
      endDate: dayjs('2015-08-07'),
      percent: 100,
      level: 2,
      success: '13',
    },
    {
      id: '13',
      name: 'Basics complete',
      startDate: dayjs('2015-08-06'),
      level: 2,
    },
  ];
  const event = [
    {
      name: 'New Year holiday',
      startDate: dayjs('2015-07-15'),
      endDate: dayjs('2015-07-16'),
    },
    {
      name: 'Christmas holidays',
      startDate: dayjs('2015-08-15'),
      endDate: dayjs('2015-08-15'),
    },
    {
      name: 'Q-1 Release',
      startDate: dayjs('2015-07-09'),
    },
    // {
    //   name: 'Q-2 Release',
    //   startDate: dayjs('2015-07-30'),
    // },
    // {
    //   name: 'Q-3 Release',
    //   startDate: dayjs('2015-08-10'),
    // },
  ];

  return (
    <Fragment>
      <div className="h-full pb-10">
        <h1 className="text-3xl text-teal-900 font-bold text-center mb-14 ">{t('routes.auth.login.Welcome')}</h1>
        <Gantt widthColumnDay={widthColumnDay} dateStart={dateStart} data={task} event={event} />
      </div>
    </Fragment>
  );
};
export default Page;
