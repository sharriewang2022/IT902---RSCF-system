import React, {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Card, Input, DatePicker ,Button,Checkbox,Upload, Image,Radio,Select, Tag} from "antd";
import {DATE_FORMAT} from "../../config/sysConfig";
import SelectRetailer from "./operateRetailer";
import SelectOrderMark from "./orderMark";
import homePic from "../../images/homePic.jpg";
import type {OrderPurchaseType} from "../../util/variableTypes";

const {RangePicker} = DatePicker;
interface Iprops {
  setCurrent: Function;
  setOrderActionInfo: Function;
  orderActionInfo: OrderPurchaseType;
}
const fallback="https://images.pexels.com/photos/14401/pexels-photo-14401.jpeg"
interface retailerType{
  id?:number
  name?:string
  type?:string
  address?:string
}

function CreateOrderActionInfo(props: Iprops) {

  const [retailerList,setRetailerList] = useState<retailerType[]>([])
  // show retailer
  const [showRetailer,setShowRetailer] = useState(false)
  const {orderActionInfo, setCurrent, setOrderActionInfo } = props; 
  const [orderMark,setOrderMark] = useState({picture:'',type:'',name:'',id:''})
  const [orderMarkType,setOrderMarkType] = useState(1)
  const [showOrderMark,setShowOrderMark] =useState(false)
  // listen orderMark to change orderActionInfo's orderMark
  useEffect(()=>{
    setOrderActionInfo({...orderActionInfo,orderMark:orderMark.id})
  },[orderMark])
  // list retailerList, change orderInfo
  useEffect(()=>{
    console.log("listen order")
    setOrderActionInfo({...orderActionInfo,retailer:retailerList.map(item=>item.id).join(',')})
  },[retailerList])
  return (
    <div className="CreateOrderActionInfo">
      <Card type="inner" title="Order Action">
        {/* {JSON.stringify(orderActionInfo)} */}
        <p>
          <span className="label">Order Name:</span>
          <span>
            <Input
              value={orderActionInfo.orderName}
              onChange={(e) => {
                setOrderActionInfo({ ...orderActionInfo, orderName: e.target.value });
              }}
            />
          </span>
        </p>
        <p>
          <span className="label">Order Time: </span>
          <span>
            <RangePicker
              onChange={(value, str) => {
                setOrderActionInfo({
                  ...orderActionInfo,
                  orderStartTime: str[0],
                  orderEndTime: str[1],
                });
              }}
              format={DATE_FORMAT}
              value={[
                orderActionInfo.orderStartTime ? dayjs(orderActionInfo.orderStartTime) : null,
                orderActionInfo.orderEndTime ? dayjs(orderActionInfo.orderEndTime) : null,
              ]}
            />
          </span>
        </p>

        <p>
          <span className="label"> Order Introduction: </span>
          <span>            
            <Input
              value={orderActionInfo.orderDescription}
              onChange={(e) => {
                setOrderActionInfo({ ...orderActionInfo, orderIntroduction: e.target.value });
              }}
            />
          </span>        
        </p>

        <p>
          <span className="hidden">Order Show Home: </span>
          <span className="hidden">            
             <Checkbox 
              onChange={(e) => {
                setOrderActionInfo({ ...orderActionInfo, showHome: Number(e.target.checked) });
              }}
             checked={Boolean(orderActionInfo.showHome)}/>
          </span>
        </p>
        <p>
          <span className="label">Order Picture: </span>
          <span  style={{width:200,display:'inline-block',verticalAlign:'middle'}}>            
            <Upload        
              showUploadList={false} 
              listType="picture-card"
              className="avatar-uploader"
              onChange={info=>{
                if(info.file && info.file.response){         
                  setOrderActionInfo({...orderActionInfo,homePic:'http://127.0.0.1:5000'+info.file.response.file.path})
                }
              }}
              name="file"
              action= "http://127.0.0.1:5000/file/upload"
              >
              {
                orderActionInfo.homePic?<Image preview={false} src={homePic} width={110} fallback={fallback} />:<Button>Upload Picture</Button>
              }
            </Upload>         
          </span>
        </p>

        <p>
          <span className="hidden">Order Style: </span>
          <span className="hidden">            
          <Radio.Group onChange={e=>setOrderActionInfo({...orderActionInfo,showType:e.target.value})} value={orderActionInfo.orderType}>
            <Radio value={1}>One Row One Column</Radio>
            <Radio value={2}>One Row Two Columns</Radio>
            <Radio value={3}>One Row Three Columns</Radio>         
          </Radio.Group>
          </span>
        </p>

        <p>
          <span className="hidden">Order Mark: </span>
          <span className="hidden">            
            <Select
              onChange={e=>{
                setOrderMarkType(e)
                setShowOrderMark(true)
              }}
              defaultValue={1}
              style={{ width: 120 }}         
              options={[{ value: 1, label: 'Order' },{ value: 2, label: 'Action' }]}
            />&emsp;&emsp;
            <Image 
            preview={false}
            onClick={()=>setShowOrderMark(true)}
            src={orderMark.picture} fallback={fallback} width={64}/>
          </span>
        </p>
        {/* showOrderMark is true and send setShowOrderMark() */}
        {showOrderMark && <SelectOrderMark setShowOrderMark={setShowOrderMark} orderMarkType={orderMarkType} setOrderMark={setOrderMark}/>}      
      </Card>
      <Card type="inner" title="Order Rule" >    
        <p>
          <span className="label">Order Amount: </span>
          <span>            
            <Input
              value={orderActionInfo.limitBuy}
              onChange={(e) => {
                setOrderActionInfo({ ...orderActionInfo, limitBuy: e.target.value });
              }}
            />
          </span>
        </p>
        <p>
          <span className="label">DeliverWay: </span>
          <span>            
          <Radio.Group onChange={e=>setOrderActionInfo({...orderActionInfo,deliverWay:e.target.value})} value={orderActionInfo.deliverWay}>
            <Radio value={1}>Self Pickup</Radio>
            <Radio value={2}>Express </Radio>
          </Radio.Group>
          </span>
        </p> 
        <p>
          <span className="hidden">retailer: </span>
          <span className="hidden">            
          <Radio.Group onChange={e=>{
            setOrderActionInfo({...orderActionInfo,retailer:e.target.value})
            if(e.target.value){
              setShowRetailer(true);
            }
            }} value={orderActionInfo.retailer}>
            <Radio value={''}>All retailers</Radio>
            <Radio value={1}>Some retailer</Radio>
          </Radio.Group>
         { orderActionInfo.retailer && <span onClick={()=>setShowRetailer(true)}> </span>}
          </span><span>{retailerList.map(item=>item.name).join(' ,')}</span>
        </p> 
        <p>
          <span className="label">Pickup Time: </span>
          <span>
            <DatePicker
              onChange={(value, str) => {
                setOrderActionInfo({
                  ...orderActionInfo,
                  orderPreTime: str,                 
                });
              }}
              format={DATE_FORMAT}
              value={ orderActionInfo.orderPreTime ? dayjs(orderActionInfo.orderPreTime ) : null                
               }
            />
          </span>
        </p>  
      </Card>
      <p><Button type="primary" onClick={()=>setCurrent(1)}>Next, Select Products</Button></p>
      {showRetailer && <SelectRetailer retailerList={retailerList} setShowRetailer={setShowRetailer} setRetailerList={setRetailerList}></SelectRetailer>}
    </div>
  );
}

export default CreateOrderActionInfo;
