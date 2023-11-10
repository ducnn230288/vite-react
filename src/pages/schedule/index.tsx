import { DataTable } from "@core/data-table";
import React, { useRef } from 'react';
import { SettingOutlined, CalendarOutlined } from '@ant-design/icons';
import { Cascader, Input, Select, Space, Table } from 'antd';
import "./index.less"
import { Button } from "@core/button";
import { Plus } from "@svgs";
import { DownOutlined } from '@ant-design/icons';
const onChange = (value: string) => {
  console.log(`selected ${value}`);
};
const onSearch = (value: string) => {
  console.log('search:', value);
};
const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const datafake={
  }
  const fakedata=
  [
    {
    name:"Khánh trần",
    daystart:"03/11 Fr",
    MNT:"MNT",
    namework:"API config",
    checkin:"8:15",
    checkout:"17:30",
    board:"Y",
    operation:"accept",
    timework:"7:45",
    work:"1",
    project:"Montor",
    conclude:"Hoàn thành"
   },
    {
    name:"Johny Đỗ",
    daystart:"03/11 Fr",
    MNT:"MNT",
    namework:"Balance",
    checkin:"8:00",
    checkout:"17:30",
    board:"Y",
    operation:"accept",
    timework:"8:00",
    work:"1",
    project:"Balance",
    conclude:"Hoàn thành"
   },
    {
    name:"Nguyễn văn sĩ",
    daystart:"03/11 Fr",
    MNT:"MNT",
    namework:"API config",
    checkin:"8:15",
    checkout:"17:30",
    board:"Y",
    operation:"accept",
    timework:"7:45",
    work:"1",
    project:"Uhouse",
    conclude:"Hoàn thành"
   },
  ] 
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'username',
      key: 'usernam',
    },
    {
      title: 'Todo',
      dataIndex: 'todo',
      key: 'todo',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      
    },
    {
      title: 'Bản tính',
      dataIndex: 'board',
      key:  'board',

      
    },
    {
      title: 'Thao tác',
      dataIndex: 'T',
      key: 'T',
      
    },
  ];
  const data = [
    {
      key: 1,
      day: '03/11 Fr',
      username: "Khánh trần",
      todo: 'MNT:API mainconfig',
      time:"08:14-17:30 07:45:59",
      board:"H",
      T:"",
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    
  ];
const Page = () => (
  <div className="max-w-[1200px] mx-auto">
    <div className="flex justify-between">
    <div> 
      <Space wrap>
        <Input
        style={{
          height:38,
        }}
          suffix={<CalendarOutlined />}
          placeholder="Chọn tháng"
        />
      <Select
        style={{
          height:40,
          width:200
        }}
        showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={filterOption}
        options={[
          {
            value: 'jack',
            label: 'Jack',
          },
          {
            value: 'lucy',
            label: 'Lucy',
          },
          {
            value: 'tom',
            label: 'Tom',
          },
        ]}
      />

      
    </Space>
    </div>
    <div>
    <Button
       icon={<Plus className="icon-cud !h-5 !w-5 "  />}
       text={"Check in"}   
       className=" mr-5 w-[121px] !bg-blue-600"
        />
    <Button
       icon={<Plus className="icon-cud !h-5 !w-5 " />}
       text={"Check out"}   
       className=" max-md:mt-2 !bg-blue-600"
        />
    </div>
  </div>
  
  </div>
  
    
  
);

export default Page;