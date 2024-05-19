import React,{ useEffect, useState } from 'react';
import  {Modal,Table} from  'antd'
import  {getOrderMark} from '../../api/orderApi';
import type { ColumnsType } from 'antd/es/table';
import type { OrderMarkType } from "../../util/variableTypes";
 
interface Iprops{
  setShowOrderMark:Function
  orderMarkType:number
  setOrderMark:Function
}
 
const columns:ColumnsType<OrderMarkType> =  [
  { title: 'Name',
  dataIndex: 'name'},
  { title: 'Picture',
  dataIndex: 'picture',
  render:(img:string)=><img src={img} width='32' alt=""/>
 },
 {
  title:"Type",
  dataIndex:"type",
  render:(type:number)=><span>{Number(type)===1?'Order':'Action'}</span>
 }
]
function SelectOrderMark(props:Iprops) {
  const [selOrigin,setSelOrigin] = useState<OrderMarkType[]>([])
  const [orderMarkList,setOrderMarkList] = useState<OrderMarkType[]>([])
  const [pagination,setPagination] = useState({current:1,pageSize:5,total:1})

  const handleOk = () => {
    props.setOrderMark(selOrigin[0])
    props.setShowOrderMark(false)
  };
 
  const handleCancel = () => {
    props.setShowOrderMark(false)   
  };
 
  const getOrderMarks = ()=>{
    getOrderMark({type:props.orderMarkType,current:pagination.current,size:pagination.pageSize})
    .then(res=>{
      setOrderMarkList(res.data.data)
      var pa = res.data.pagination;
      setPagination({current:Number(pa.current),pageSize:pa.size,total:pa.total})
    })
  }
 
  useEffect(()=>{
    getOrderMarks()
  },[pagination.current,props.orderMarkType])

  //modelDialog
  return ( <Modal title="Choose orderMark" open={true} onOk={handleOk} onCancel={handleCancel}>
  <Table 
  rowSelection={{
    type: 'radio',
    onChange:(keys,rows)=>{
      console.log(rows);
      setSelOrigin(rows)
    }
  }}
  size='small' 
  rowKey="id" 
  onChange={pa=>{
    setPagination({...pagination,current:Number(pa.current)})
  }}
  pagination={pagination} 
  columns={columns} dataSource={orderMarkList} />
</Modal> );
}

export default SelectOrderMark;