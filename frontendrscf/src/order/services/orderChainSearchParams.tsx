import React,{ useEffect, useState } from 'react';
import { ORDERPURCHASE_STATE } from "../../util/constant";
import { DATE_FORMAT } from "../../config/sysConfig";
import { Col, Row,Input,DatePicker,Radio,Button} from 'antd';
import {OrderPurchaseType}  from "../../util/variableTypes";

interface Iprops{
  params:OrderPurchaseType  
  setParams:Function //set search parameters
  getOrderChain:Function //get order list 
  reset:Function
}
// time picker
const { RangePicker } = DatePicker;
function SeachParams(props:Iprops) { 
  const params = props.params;
  const setParams = props.setParams;
  return ( <div className='searchParams'>
  <Row gutter={8}>
    <Col span={7}>
      <label>Order ID:</label>
      <Input value={params.id} onChange={e=>setParams({...params,id:e.target.value})}/>
    </Col>
    <Col span={7}>
      <label>Order Name: </label>
      <Input value={params.orderName} onChange={e=>setParams({...params,name:e.target.value})}/>
    </Col>
    <Col span={10}>
      <label>Order Start Time:</label>
      <RangePicker
      format={DATE_FORMAT} 
      onChange={(date,strArr)=>{
        console.log(date,strArr)
        setParams({...params,startTime:strArr.join(',')})
      }} />
    </Col>
  </Row>
  <Row gutter={8} style={{margin:"24px 0"}}>
    <Col span={7}>
      <label>Order Products: </label>
      <Input value={params.products} onChange={e=>setParams({...params,products:e.target.value})}/>
    </Col>
    <Col span={7}>
      <label>Order Shops: </label>
      <Input  value={params.retailer} onChange={e=>setParams({...params,retailer:e.target.value})}/>
    </Col>
    <Col span={10}>
      <label>Order End time: </label>
      <RangePicker
         format={DATE_FORMAT} 
         onChange={(date,strArr)=>{          
           setParams({...params,endTime:strArr.join(',')})
         }} 
      />
    </Col>
  </Row>
  <Row gutter={8}>
    <Col span={14}>
     <label>Order Status: &nbsp;</label>
     <Radio.Group defaultValue="" buttonStyle="solid" onChange={e=>setParams({...params,state:e.target.value})}>
      <Radio.Button value="">All</Radio.Button>
      {
        ORDERPURCHASE_STATE.map((item,index)=><Radio.Button key={index} value={index}>{item}</Radio.Button>)
      }
    </Radio.Group>
    </Col>
    <Col span={10}>
      <Button onClick={()=>props.reset()}>Reset</Button>
      <Button type='primary' onClick={()=>props.getOrderChain()}>Search</Button>
    </Col>
  </Row>
  
  </div> );
}

export default SeachParams;