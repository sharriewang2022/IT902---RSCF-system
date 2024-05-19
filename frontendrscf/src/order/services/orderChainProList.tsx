import React,{ useEffect, useState } from 'react';
import {Table } from 'antd'
import { getOrderPurchaseProducts } from '../../api/orderApi';
import type {OrderPurchaseType} from "../../util/variableTypes";
import type { ColumnsType } from 'antd/es/table';
 
interface Iprops{
  orderActionInfo:OrderPurchaseType
}
const columns: ColumnsType<any> = [
  {
    title: 'Product ID',
    dataIndex: 'id',
  },
  {
    title: 'Product Picture',
    dataIndex: 'gallery',
    render:(urls:string)=>{
      var  temp ;
      if( urls.includes(',')){
        temp = urls.split(",")       
      }else{ temp = urls.split("|")}
      return <img src={temp[0]} width="120" alt='' />
    }
  },
  {
    title: 'Product Name',
    dataIndex: 'productName',
  },
  {
    title: 'Specific',
    dataIndex: 'specs',
  },
  {
    title: 'Price',
    dataIndex: 'price',
  },
  {
    title: 'Sale Price',
    dataIndex: 'salePrice',
  },
  {
    title: 'Rate',
    dataIndex: 'rate',
    render:text=>text+"%"
  },
  {
    title: 'TotalAmount',
    dataIndex: 'limitBuy',    
  },
  {
    title: 'Stock',
    dataIndex: 'stock',    
  },
  {
    title: 'Order',
    dataIndex: 'id',    
  },
]

// get products list
function OrderChainProList(props:Iprops) {
  const [pagination, setPagination] = useState({ total: 1, current: 1,pageSize:2 });
  const [products,setProducts] = useState([])
  function getProducts(){                                         
    getOrderPurchaseProducts({...pagination,orderPurchaseId:props.orderActionInfo.id,size:2})
    .then(res=>{
      setProducts(res.data.data)
      var p = res.data.pagination;
      setPagination({...pagination, current: Number(p.current), total: p.total });
    })
  }

  useEffect(()=>{
    getProducts()
  },[pagination.current])
  
  return ( <div>
    <Table  
    rowKey="id" 
    onChange={(pa: any) => {
      setPagination({ ...pagination, current: pa.current });
    }}
    pagination={pagination}
    dataSource={products} 
    columns={columns} />;
  </div> );
}

export default OrderChainProList;