import React,{ useEffect, useState } from 'react';
import {Button,Table,Input} from 'antd'
import SelectProduct from  './selectProduct'
import {addOrderAction, addOrderChainProduct, UpdateOrderAction} from '../../api/orderApi'
import type {OrderPurchaseType, ActitivyProType} from "../../util/variableTypes";
import { GoodRSCFApiCall } from "../../product/services/hooksProduct";
import { OrderRSCF } from "../../product/services/interfaceTypes";
import {useBlock} from "../../contexts/blockContext";

 
interface Iprops {
  setCurrent: Function;
  setOrderActionInfo: Function;
  orderActionInfo: OrderPurchaseType;
}

function OrderProducts(props:Iprops) {
  //add order product to blockchain
  const { addSomeOrderRSCF } = GoodRSCFApiCall();
  // show product list
  const [showSelectProduct,setShowSelectProduct] = useState(false) 
  //order product
  const [orderProductList,setOrderProductList] =useState<any>([]) 
  //set select product list
  const [selProductList,setSelProductList] =useState<any>([])

  const [orderAmount,setOrderAmount] =useState<number>(0)
  const [orderUnitPrice,setOrderUnitPrice] =useState<number>(0)
 
  //products list in one order
const columns = [
  {
    title:"Product ID",
    dataIndex:'ProductID'
  },
  {
    title:"Product Name",
    dataIndex:'ProductName'
  },
  {
    title:"Price",
    dataIndex:'ProductPrice',
    render:(value:string,row:ActitivyProType,index:number)=>{     
      return <Input 
        onChange={(e)=>{
          var list = orderProductList;
          // e is form inputted value
          list[index].productPrice = e.target.value
          console.log(list,list[index]);
          setOrderProductList([...list]);
        }}
        value={value}/>
    }
  },
  {
    title:"Product Number",
    dataIndex:'ProductNumber'
  },
  {
    title:"Stock",
    dataIndex:'stock'
  },
  {
    title:"Specific",
    dataIndex:'Specific'
  },
  // {
  //   title:"order",
  //   dataIndex:'order'
  // },
]

  useEffect(()=>{
    // the total order products amount
    var orderAmountVar: number = 0
    // the total order products price
    var orderUnitPriceVar: number = 0

    var list = selProductList.map((item:any)=>{
      var obj = {...item};
      // delete product according to its id
      delete obj.id; 
      obj.ProductID = item.ProductID;
      obj.ProductName = item.ProductName;
      obj.ProductPrice = item.ProductPrice;
      obj.ProductNumber = item.ProductNumber;
      obj.ProductItems = item.ProductItems;
      obj.stock = 999;
      obj.order = 0;
      orderAmountVar = orderAmountVar + item.ProductNumber *1;
      orderUnitPriceVar = orderUnitPriceVar + (item.ProductPrice * item.ProductNumber);
      return obj;
    }) 
    setOrderAmount(orderAmountVar)
    setOrderUnitPrice(orderUnitPriceVar)
    setOrderProductList(list)
    setSelProductList(list)
  },[selProductList])
 
  async function finishDone (){
    // add order actitivy to server and then get activityId
    const orderData =  await addOrderAction(props.orderActionInfo)
    if(orderData.data.code != 200){
      window.alert(orderData.data.msg)
      return
    }
    var orderId = orderData.data.orderId; 
    // add selected  products of order with id
    var list = orderProductList.map((item:any)=>addOrderChainProduct({...item,orderId})) 
    // add order prodcts to blockchain
    // order blockchain account address
    var orderBlockchainAddress = "";
    orderProductList.map(async (item:any)=>{           
      var orderRSCF:OrderRSCF ={ 
        orderId:'',
        productId: '',
        productName: '',
        quantity: 0,
        price: 0, 
        customerName:'1',
        orderStatus:'1'
      };
      orderRSCF.orderId = orderId
      orderRSCF.productId = item.ProductID
      orderRSCF.productName = item.ProductName
      orderRSCF.quantity = item.ProductNumber
      orderRSCF.price = item.ProductPrice
      await addSomeOrderRSCF(orderRSCF).then(res=>{
        if(res){
          orderBlockchainAddress = res.customerName||""
          console.log("order:" + orderId +", product"+ res.productName + " is added successfully to blockchain" + orderBlockchainAddress);
        }
      })
    })      
    // several promise
    const gplist = await Promise.all(list)
    // several gplist  join together
    var products = gplist.map(item=>item.data.productName).join(",")
    // var userName = localStorage.getItem('username')
    var userName = sessionStorage.getItem("userName")
    if(userName == null){
      userName ='';
    }
    //  update order products
    const result = await UpdateOrderAction({...props.orderActionInfo, orderId, products, orderAmount, orderUnitPrice, userName})
    if(result.data.code===200){
      props.setCurrent(2);
    }else{
      console.log("fail")
    }
  }
  
  return ( <div className="SelectProducts" >
    <p style={{textAlign:'center'}}>
      <Button style={{backgroundColor:"#87CEFA"}} type='primary' onClick={()=>setShowSelectProduct(true)}>Choose Product</Button>
    </p>
   <Table rowKey="ProductID" pagination={false} dataSource={orderProductList} columns={columns}/>
   {showSelectProduct && <SelectProduct 
      selectProductList={selProductList} 
      setShowSelectProduct={setShowSelectProduct} 
      setSelectProductList={setSelProductList}></SelectProduct>} 
   <p>
     <Button style={{backgroundColor:"#87CEFA"}} onClick={()=>props.setCurrent(0)}>Last Step</Button>  
     <Button style={{backgroundColor:"#87CEFA"}} onClick={()=>finishDone()}>Done</Button>
   </p>
  </div> );
}
export default OrderProducts;
