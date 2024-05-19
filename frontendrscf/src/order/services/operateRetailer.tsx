import React,{ useEffect, useState }  from 'react'; 
import {getRetailers} from '../../api/orderApi';
import {Button,Card,Row,Col,Input,Table} from 'antd';
import type { ColumnsType } from 'antd/es/table';
 
interface ITtype extends Pick<retailerType, "id"> {};
 
function uniArray<T extends ITtype>(list:T[]){
 
  return list.filter((item:T,index:number)=>{ 
    var ind = list.findIndex((target:T)=>target.id===item.id)
    if(index===ind){return true}
    else{return false}
  })
}

interface Iprops{
  setShowRetailer:Function
  setRetailerList:Function
  retailerList: retailerType[]
}

interface retailerType{
  id?:number
  name?:string
  type?:string
  address?:string
}

 
const columns:ColumnsType<retailerType> =[
  { title: 'Retailer ID',
  dataIndex: 'id'}, 
  { title: 'Retailer Name',
  dataIndex: 'name'},
  { title: 'Address',
  dataIndex: 'address'},
  { title: 'Type',
  dataIndex: 'type'} 
]
function SelectRetailer(props:Iprops) { 
  const [params,setParams] = useState<retailerType>({}) 
  const [pagination,setPagination] =useState({current:1,total:1,pageSize:5}) 
  const [originData,setOriginData] = useState<retailerType[]>([])
  const [targetData,setTargetData] = useState<retailerType[]>([])
  const [selOrignRows,setSelOriginRows] = useState<retailerType[]>([])
  const [selTargetRows,setSelTargetRows] =useState<retailerType[]>([])

  const getRetailer = ()=>{
    getRetailers({...params,size:pagination.pageSize,current:pagination.current})
    .then(res=>{
      setOriginData(res.data.data)
      var pa = res.data.pagination;
      setPagination({current:Number(pa.current),pageSize:pa.size,total:pa.total})
    })
  }

  useEffect(()=>{
    getRetailer()
  },[pagination.current])
  useEffect(()=>{
    setTargetData(props.retailerList)
  },[])

  function toRight(){
    const list = selOrignRows.concat(targetData)
    setTargetData(uniArray<retailerType>(list))
    var leftList = originData.filter(item=>{
      var flag = selOrignRows.some(target=>target.id===item.id)
      return !flag;
    })
    setOriginData(leftList)
  }

  function toLeft(){
    const list = selTargetRows.concat(originData)
    setOriginData(uniArray<retailerType>(list))
    var rightList = targetData.filter(item=>{    
      var flag = selTargetRows.some(target=>target.id===item.id)      
      return !flag;
    })
    setTargetData(rightList)
  }

  return ( <div className="SelectRetailer">
    <div className="content">
      <div className='origin'>
        <Card type='inner' title="Choose Retailer">
          <div className='form'>
            <Row>
              <Col span={14}>
                <label>Retailer Name: </label>
                <Input value={params.name} onChange={(e)=>setParams({...params,name:e.target.value})}/>
              </Col>
              <Col span={10}>
                <label>Retailer Style: </label>
                <Input value={params.type} onChange={(e)=>setParams({...params,type:e.target.value})}/>
              </Col>
            </Row>
            <Row style={{margin:"24px 0"}}>
            <Col span={14}>
                <label>Address: </label>
                <Input value={params.address} onChange={(e)=>setParams({...params,address:e.target.value})}/>
              </Col>
              <Col span={10}>
                <Button style={{marginLeft:65}} onClick={()=>getRetailer()}>Search</Button>
              </Col>
            </Row>
            <Table 
            rowKey="id"
             rowSelection={{
              type: 'checkbox',
              onChange:(keys,rows)=>{
               setSelOriginRows(rows)
              }
            }}
            onChange={pa=>{
              setPagination({...pagination,current:Number(pa.current)})
            }}
            pagination={pagination} 
            size='small'
            columns={columns} 
            dataSource={originData}></Table>
          </div>
        </Card>
      </div>
      <div className='btns'>
          <Button onClick={()=>toRight()}>Add&gt;&gt;</Button>
          <Button onClick={()=>toLeft()}>&lt;&lt;Cancel</Button>
      </div>
      <div className='target'>
        <Card type='inner' title="Selected Retailer:">
        <Table 
            rowKey="id"
             rowSelection={{
              type: 'checkbox',
              onChange:(keys,rows)=>{
               setSelTargetRows(rows)
              }
            }}
            pagination={false} 
            size='small'
            columns={columns} 
            dataSource={targetData}></Table>
        </Card>
      </div>
    </div>
    <div className='footer'>
      <Button onClick={()=>props.setShowRetailer(false)}>Cancel</Button>
 
      <Button type='primary' onClick={()=>{  
        props.setRetailerList(targetData);
        props.setShowRetailer(false)
      }}>Confirm</Button>
    </div>
  </div> );
}

export default SelectRetailer;