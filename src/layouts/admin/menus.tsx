import React from 'react';

import { keyRole } from '@utils';
import './index.less';
import { Calendar, Cog, User } from '@svgs';

const Layout = [
  {
    icon: <Calendar className="h-6 w-6" />,
    name: 'Dashboard',
  },
  {
    icon: <User className="h-6 w-6" />,
    name: 'User',
    permission: keyRole.P_USER_LISTED,
    queryParams: { filter: '{"roleCode":"staff"}' },
  },
  {
    icon: <Cog className="h-6 w-6" />,
    name: 'Setting',
    child: [
      {
        name: 'Code',
        permission: keyRole.P_CODE_LISTED,
        queryParams: { filter: '{"type":"position"}' },
      },
      {
        name: 'Data',
        permission: keyRole.P_DATA_LISTED,
        queryParams: { filter: '{"type":"partner"}' },
      },
      {
        name: 'Post',
        permission: keyRole.P_POST_LISTED,
        queryParams: { filter: '{"type":"projects"}' },
      },
      {
        name: 'Parameter',
        permission: keyRole.P_PARAMETER_LISTED,
        queryParams: { code: 'phone' },
      },
    ],
  },
];

export default Layout;
