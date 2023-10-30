import React, { Fragment } from 'react';
import { t } from 'i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Gantt } from '@core/gantt';

const Page = () => {
  const widthColumnDay = 36;
  const dateStart = dayjs().startOf('year');
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
      name: 'Finished',
      startDate: dayjs('2023-01-31'),
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

  return (
    <Fragment>
      <div className="h-full pb-10">
        <h1 className="text-3xl text-teal-900 font-bold text-center mb-14 ">{t('routes.auth.login.Welcome')}</h1>
        <Gantt widthColumnDay={widthColumnDay} dateStart={dateStart} task={task} event={event} />
      </div>
    </Fragment>
  );
};
export default Page;
