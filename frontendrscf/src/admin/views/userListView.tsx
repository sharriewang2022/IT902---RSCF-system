import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { getUserList } from '../../api/adminApi';

interface DataType {
  userId: string;
  userName: {
    firstName: string;
    lastName: string;
  };
  email: string;
  telephone: number;
  role: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'User Name',
    dataIndex: 'userName',
    sorter: true,
    render: (userName) => `${userName.firstName}`,
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Telephone',
    dataIndex: 'telephone',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    filters: [
      { text: 'Administrator', value: 'administrator' },
      { text: 'Supplier', value: 'supplier' },
      { text: 'Manufacturer', value: 'manufacturer' },
      { text: 'Distributer', value: 'distributer' },
      { text: 'Retailer', value: 'retailer' },
      { text: 'Customer', value: 'customer' },
    ],
  },
];

const UserList: React.FC = () => {
  const [userData, setUserData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  }); 

  const getUserTableData = async () => {
    setLoading(true);    
    var userList = await getUserList();   
    var userTableDataList:Array<DataType>= []; 
    if(userList.data.code == 200){
      userList.data.data.map((item:any)=>{
        var obj : DataType = {
          userId:'',
          userName: {firstName:'', lastName:''},
          email: '',
          telephone: 0,
          role:'Administrator'
        };
        obj.userId = item.UserID
        obj.userName.firstName = item.UserName
        obj.userName.lastName = item.UserName
        obj.email = item.Email
        obj.telephone = item.Telephone        
        if(item.RoleID == '3001') {
          obj.role = 'administrator'
        }else if(item.RoleID == '3002'){
          obj.role = 'supplier'
        }else if(item.RoleID == '3003'){
          obj.role = 'manufacturer'
        }else if(item.RoleID == '3004'){
          obj.role = 'distributer'
        }else if(item.RoleID == '3005'){
          obj.role = 'retailer'
        }else {
          obj.role = 'customer'
        }
        userTableDataList.push(obj)        
      }) 
    }

    setUserData(userTableDataList);
    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: userTableDataList.length,
      },
    });
  }

  useEffect(() => {
    getUserTableData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (
    // pagination: TablePaginationConfig,
    // filters: Record<string, FilterValue>,
    // sorter: SorterResult<DataType>,
    pagination: any,
    filters: any,
    sorter: any,
  ) => {     
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination && pagination.pageSize !== tableParams.pagination?.pageSize) {
      setUserData([]);
    }
  };

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.userId}
      dataSource={userData}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default UserList;
