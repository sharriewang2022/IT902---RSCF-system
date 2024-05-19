import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { getOrderList } from '../../api/orderApi';
import { OrderPurchaseType} from "../../util/variableTypes";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const columns: ColumnsType<OrderPurchaseType> = [
  {
    title: 'Order Name',
    dataIndex: 'orderName',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Status',
    dataIndex: 'orderStatus',
  },
  {
    title: 'Amount',
    dataIndex: 'orderAmount',
  },
  {
    title: 'Unit Price',
    dataIndex: 'orderUnitPrice',
  },
  {
    title: 'Products',
    dataIndex: 'products',
  },
  {
    title: 'Pick Time',
    dataIndex: 'pickTime',
  },
];

const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const OrderListView: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderPurchaseType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const getOrderTableData = async () => {
    setLoading(true);
    
    var orderList = await getOrderList();
   
    var orderTableDataList:Array<OrderPurchaseType>= [];

    if(orderList.data.code == 200){
      orderList.data.data.map((item:any)=>{
        var obj : OrderPurchaseType = {
          orderId: '',
          orderName: '',
          orderStatus: '',
          orderAmount: 0,
          orderUnitPrice: 0,
          products: '',
          deliverWay: 0,
          pickTime: ''
        };
        obj.orderId = item.OrderID
        obj.orderName = item.OrderName
        obj.orderStatus = item.OrderStatus
        obj.orderAmount = item.OrderAmount
        obj.orderUnitPrice = item.UnitPrice
        obj.products = item.products
        obj.deliverWay = item.DeliverWay
        obj.pickTime = item.pickTime
   
        orderTableDataList.push(obj)        
      }) 
    }
    setOrderData(orderTableDataList);
    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: orderTableDataList.length,
      },
    });
  }

  useEffect(() => {
    getOrderTableData();
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
      setOrderData([]);
    }
  };

  return (
    <Table
      columns={columns}
      // rowKey={(record) => record.orderName}
      dataSource={orderData}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default OrderListView;
