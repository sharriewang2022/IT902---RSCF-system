import React,{ useEffect, useState } from 'react';
import {getProduts} from '../../api/orderApi';
import {Button,Card,Row,Col,Input,Table,Image} from 'antd'
import type { ColumnsType } from 'antd/es/table';
import type {ProductType} from "../../util/variableTypes";
import homePic from "../../images/homePic.jpg";

// IType select id from productType
interface ITtype extends Pick<ProductType, "ID"> {};
//List: uniArray<productType> 
function uniArray<T extends ITtype>(list:T[]){ 
  return list.filter((item:T,index:number)=>{
    // item.id to find index
    var ind = list.findIndex((target:T)=>target.ID===item.ID)
    // If index == ind
    if(index===ind){return true}
    else{return false}
  })
}

interface Iprops{
  setShowSelectProduct:Function
  setSelectProductList:Function
  selectProductList:any
}

const columns:ColumnsType<ProductType> = [
  { title: 'Product ID',
  dataIndex: 'ProductID'}, 
  { title: 'Product Name',
  dataIndex: 'ProductName'},
  { title: 'Product Picture',
  dataIndex: 'picture',  
  render:(urls:string)=>{
      var temp;
      if(!urls){
        return <Image src={homePic} width={60}/>  
      }
      if(urls.includes(",")){
        temp = urls.split(",")
      }else{
        temp = urls.split("|")
      }
      return  <Image src={temp[0]} width={60}/>  
    }
  },
  { title: 'Price',
  dataIndex: 'ProductPrice'},
  { title: 'Number',
  dataIndex: 'ProductNumber'},
  { title: 'Category',
  dataIndex: 'CategoryID'},
  { title: 'BlockchainInfo',
  dataIndex: 'BlockchainHash'},
  { title: 'Items',
  dataIndex: 'ProductItems'},
  { title: 'Specific',
  dataIndex: 'Specific'} 
]

function SelectProduct(props:Iprops) {
  const [params,setParams] = useState<ProductType>({productId:""})
  const [pagination,setPagination] =useState({current:1,total:1,pageSize:5})
  const [originData,setOriginData] = useState<ProductType[]>([])
  const [targetData,setTargetData] = useState<ProductType[]>([])
  const [selOrignRows,setSelOriginRows] = useState<ProductType[]>([])
  const [selTargetRows,setSelTargetRows] =useState<ProductType[]>([])

  const getProduct = ()=>{
    getProduts({...params,size:pagination.pageSize,current:pagination.current})
    .then(res=>{
      if(res.data !== undefined ){
        if(res.data.code===200){    
          setOriginData(res.data.data)
          var paginationData = res.data.pagination;
          setPagination({current:Number(paginationData.page),pageSize:paginationData.per_page,total:paginationData.total})
        }
      }
    })
  }

  useEffect(()=>{
    getProduct()
  },[pagination.current])

  useEffect(()=>{
    //productList 
    setTargetData(props.selectProductList)
  },[])

  // Add product
  function toRight(){
    const totalSelectedlist = selOrignRows.concat(targetData)
    setTargetData(uniArray<ProductType>(totalSelectedlist))
    var leftList = originData.filter(item=>{
      var flag = selOrignRows.some(target=>target.ID===item.ID)
        return !flag;
      })
    setOriginData(leftList)
  }

  //cancel product
  function toLeft(){
    const totalSelectedlist = selTargetRows.concat(originData)
    setOriginData(uniArray<ProductType>(totalSelectedlist))
    var rightList = targetData.filter(item=>{    
      var flag = selTargetRows.some(target=>target.ID===item.ID)      
      return !flag;
    })
    setTargetData(rightList)
  }

  return ( <div className="SelectProduct">
    <div className="content">
      <div className='origin'>
        <Card type='inner' title="Choose product">
          <div className='form'>             
            <Row style={{margin:"24px 0"}}>
              <Col span={14}>
                <label>Product Name:</label>
                <Input value={params.productName} onChange={(e)=>setParams({...params,productName:e.target.value})}/>
              </Col>
              <Col span={10}>
                <Button style={{marginLeft:65}} onClick={()=>getProduct()}>Search</Button>
              </Col>
            </Row>
            <Table 
             rowKey="ProductID"
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
        <Card type='inner' title=" Cancel selected product">
        <Table 
            rowKey="ID"
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
      <Button style={{backgroundColor:"#87CEFA"}} onClick={()=>props.setShowSelectProduct(false)}>Cancel</Button>
      <Button style={{backgroundColor:"#87CEFA"}} onClick={()=>{
        props.setSelectProductList(targetData);
        props.setShowSelectProduct(true)
      }}>Confirm</Button>
    </div>
  </div> );
}

export default SelectProduct;