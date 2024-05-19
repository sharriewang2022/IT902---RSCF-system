import  React,{ useState,useEffect } from 'react' 
import { getOrderMark } from '../../api/orderApi'
import dayjs from 'dayjs'
import {Card,Button} from 'antd' 
import {DATETIME_FORMAT} from "../../config/sysConfig";
import {ORDERPURCHASE_STATE,SHOW_HOME,DILIVER_TYPE} from "../../util/constant";
import type {OrderPurchaseType, OrderMarkType}  from "../../util/variableTypes";
interface Iprops{
  orderActionInfo:OrderPurchaseType
}
function OrderPurchaseInfo(props:Iprops) {
  const [orderMark,setOrderMark] = useState<OrderMarkType>({})
  const orderActionInfo = props.orderActionInfo;
  const state = Number(orderActionInfo.orderStatus)
 
  useEffect(()=>{
    getOrderMark({id:orderActionInfo.orderMark})
    .then(res=>{
      setOrderMark(res.data.data[0])
    })
  },[])
  return ( <div>    
    {/* <p>{JSON.stringify(orderActionInfo)}</p> */}
   
    <Card type='inner' title="Order Status">
      <p>{ORDERPURCHASE_STATE[state]}</p>
      {state<=2?<Button>Finished</Button>:''}
    </Card>
    <Card type='inner' title="Order Info">
      <p>
        <span> Order Name: </span>
        <span>{orderActionInfo.orderName}</span>
      </p>
      <p>
        <span> Order Time: </span>
        <span>{dayjs(orderActionInfo.orderStartTime).format(DATETIME_FORMAT)} to {dayjs(orderActionInfo.orderEndTime).format(DATETIME_FORMAT)}</span>
      </p>
      <p>
        <span> Order Pretime: </span>
        <span>{dayjs(orderActionInfo.orderPreTime).format(DATETIME_FORMAT)}</span>
      </p>
      <p>
        <span> Order Home: </span>
        <span>{SHOW_HOME[Number(orderActionInfo.showHome)]}</span>
      </p>
      <p>
        <span> Order Mark: </span>
        <span><img src={orderMark.picture} alt='tag' width="60" /></span>
      </p>
    </Card>
    <Card type='inner' title="Order Rules">
      <p>
          <span>Amount: </span>
          <span>{orderActionInfo.limitBuy===999?'999':orderActionInfo.limitBuy}</span>
      </p>
      <p>
          <span>DeliverWay: </span>
          <span>{DILIVER_TYPE[Number(orderActionInfo.deliverWay)]}</span>
      </p>
      <p>
          <span> Pickup Time: </span>
          <span>{dayjs(orderActionInfo.pickTime).format(DATETIME_FORMAT)}</span>
      </p>
    </Card>
  </div> );
}

export default OrderPurchaseInfo;