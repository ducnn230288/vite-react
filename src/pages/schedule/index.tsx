import { DataTable } from "@core/data-table";
import React, { useEffect, useRef } from 'react';
import { SettingOutlined, CalendarOutlined } from '@ant-design/icons';
import { Cascader, Input, Select, Space, Table } from 'antd';
import "./index.less"
import { Button } from "@core/button";
import { Plus, Tich } from "@svgs";
import { DownOutlined } from '@ant-design/icons';
import {  CodeFacade, TimeFacade } from "@store";
const columns = [
  {
    title: 'Ngày',
    dataIndex: 'daystart',
    key: 'daystart',
  },
  {
    title: 'Tên người dùng',
    dataIndex: 'name',
    key: 'name',
    render:(name)=><div className="text-blue-500">{name}</div>
  },
  {
    title: 'Todo',
    dataIndex: '',
    key: 'todo',
    render: ( record) =><><div className="flex"> <p className="font-semibold">{record.MNT}</p><p>:{record.namework}</p></div></>
  },
  {
    title: 'Thời gian',
    dataIndex: '',
    key: 'time',
    render: ( record) =>
    <>
      <div className="flex"> 
        <p >{record.checkin}</p>
        <p>-{record.checkout}</p>
      </div>
      <div>{record.timework}</div>
    </>

  },
  {
    title: 'Bản tính',
    dataIndex: 'board',
    key: 'board',
  },
  {
    title: 'Thao tác',
    dataIndex: 'DKN',
    key: 'DKN',
    render:(DKN)=>{
      if(DKN)
      return(
        <Button
        text={DKN}   
        className=" !bg-blue-600"
         />)
      }
  },
];
const data = [
  { key:1,
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
    key:2,
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
    conclude:"Hoàn thành",
    DKN:"Xem ĐKN",
   },
    {
    key:3,
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
    {
    key:4,
    name:"Lê Văn Nhật Huy",
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
];
const onChange = (value: string) => {
  console.log(`selected ${value}`);
};
const onSearch = (value: string) => {
  console.log('search:', value);
};
const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  
const Page = () => (
  <div className="max-w-[1200px] mx-auto">
    <div className="flex justify-between pb-10">
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
  <Table
      columns={columns}
      expandable={{
        expandedRowRender: (record) => (
        <>
        <div className="m-2 shadow-xl p-5">
        <div className="grid grid-cols-12 ">
    <div className="col-span-9">
        <div className="grid grid-cols-12">
            <div className="col-span-6">  
                <div className="grid grid-cols-12">
                    <div className="col-span-5 ">
                        <div className="leading-10">Tên người dùng</div>
                        <div className="leading-10">Check in</div>
                        <div className="leading-10">Thời gian làm việc</div>
                    </div>
                    <div className="col-span-7">
                        <div className="leading-10">{record.name}</div>
                        <div className="leading-10">{record.checkin}</div>
                        <div className="leading-10">{record.timework}</div>
                    </div>
                </div>
            </div>
            <div className="col-span-6">
                <div className="grid grid-cols-12">
                    <div className="col-span-6">
                        <div className="leading-10">Ngày</div>
                        <div className="leading-10">Check out</div>
                        <div className="leading-10">Công việc</div>
                    </div>
                    <div className="col-span-6">
                        <div className="leading-10">{record.daystart}</div>
                        <div className="leading-10">{record.checkout}</div>
                        <div className="leading-10">{record.work}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>
    <div className="text-2xl font-semibold mt-5">Danh Sách công việc</div>
    <div className="border-t-2 border-b-2 shadow-md mt-5">
      <div className="grid grid-cols-12">
            <div className="col-span-6">
            <div className="grid grid-cols-12 pb-5 pt-2 pl-2">
              <div className="col-span-1">
                <div>#</div>
                <div className=" pt-8" >1</div>
            
            </div>
            <div className="col-span-1 ">
                <div>Hoàn thành</div>
                <div className="pl-2 pt-2"><Tich className="w-5 h-5 text-center"></Tich></div>
            </div>
            <div className="col-span-7 pl-5">
                <div>Dự án</div>
                <div className=" pt-8">{record.project}</div>
            </div>
            <div className="col-span-3">
                <div >Tên công Việc</div>
                <div className=" pt-8">{record.namework}</div>
            </div>
            </div>
            </div>
      </div>
    </div>
  </div>
        
  
        </>
        ),
        rowExpandable: (record) => record.timework !== 'Not Expandable',
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <DownOutlined  onClick={(e) => onExpand(record, e)} />
          ) : (
            <DownOutlined rotate={270} onClick={(e) => onExpand(record, e)} />
          ),
      }}
      dataSource={data}
    />
  </div>
  
    
  
);

export default Page;