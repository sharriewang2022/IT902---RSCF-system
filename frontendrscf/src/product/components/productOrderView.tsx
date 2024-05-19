import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { GoodRSCFApiCall } from "../services/hooksProduct";
import { OrderRSCF} from "../services/interfaceTypes";
import { useSearchParams } from 'react-router-dom';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const columns: ColumnsType<OrderRSCF> = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
    sorter: true,
    width: '20%',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    width: '20%',
  },
  {
    title: 'Amount',
    dataIndex: 'quantity',
  },
  {
    title: 'Blockchain Address',
    dataIndex: 'customerName',
  },
  // {
  //   title: 'State',
  //   dataIndex: 'orderStatus',
  // } 
];

const ProductOrderView: React.FC = () => {
    const[searchParams] = useSearchParams();
    const { getProductOrderRSCF } = GoodRSCFApiCall();
    const [productOrderData, setProductOrderData] = useState<OrderRSCF[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
        current: 1,
        pageSize: 10,
        },
    });

    const getProductOrderDataFromBlockchain = async (productId:string) => {
    setLoading(true);    
    var productOrderDataList = await getProductOrderRSCF(productId); 
    if(productOrderDataList){
        setProductOrderData(productOrderDataList);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: productOrderDataList.length,
          },
        });
    }   
  }

  useEffect(() => {
    //get parameter productId from last page
    var productIdParam = searchParams.get("productId")||"";
    console.log("ProductId Parameter is:" + productIdParam);
    getProductOrderDataFromBlockchain(productIdParam);
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
      setProductOrderData([]);
    }
  };

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.orderId}
      dataSource={productOrderData}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default ProductOrderView;
