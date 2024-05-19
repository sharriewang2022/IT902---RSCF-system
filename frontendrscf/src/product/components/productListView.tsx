import React, { useEffect, useState } from 'react';
// import qs from 'npm install redux react-redux';
import { Table } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { getProductListNoPagination } from '../../api/productApi';
import { ProductType} from "../../util/variableTypes";

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const columns: ColumnsType<ProductType> = [
  {
    title: 'Product ID',
    dataIndex: 'productId',
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
    dataIndex: 'amount',
  },
  {
    title: 'Product Items',
    dataIndex: 'productItems',
  },
  {
    title: 'BlockchainHash',
    dataIndex: 'blockchainHash',
  },
  {
    title: 'Category',
    dataIndex: 'category',
  },
  {
    title: 'Manufacturer',
    dataIndex: 'manufacturer',
  },
  {
    title: 'Supplier',
    dataIndex: 'supplier',
  },
];

const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const ProductListView: React.FC = () => {
  const [productData, setProductData] = useState<ProductType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const getProductTableData = async () => {
    setLoading(true);
    
    var productList = await getProductListNoPagination();
   
    var productTableDataList:Array<ProductType>= [];
 
    if(productList.data.code == 200){
      productList.data.data.map((item:any)=>{
        var obj : ProductType = {
          productId: '',
          productName: '',
          price: 0,
          amount: 0,
          productItems:'',
          blockchainHash:'',
          category:'',
          manufacturer:'',
          supplier:''
        };
        obj.productId = item.ProductID
        obj.productName = item.ProductName
        obj.price = item.ProductPrice
        obj.amount = item.ProductNumber
        obj.productItems = item.ProductItems
        if(item.BlockchainHash == 'undefined'){
          obj.blockchainHash = ''
        }else{
          obj.blockchainHash = item.BlockchainHash
        }
        obj.category = item.CategoryID
        obj.manufacturer = item.ManufacturerID
        obj.supplier = item.SupplierID
   
        productTableDataList.push(obj)        
      }) 
    }
    setProductData(productTableDataList);
    setLoading(false);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: productTableDataList.length,
      },
    });
  }

  useEffect(() => {
    getProductTableData();
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
      setProductData([]);
    }
  };

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.productId}
      dataSource={productData}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default ProductListView;
