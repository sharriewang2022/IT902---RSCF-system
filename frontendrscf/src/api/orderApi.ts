import request from "../util/request";
import type {OrderMarkType, OrderPurchaseType, ProductType, ActitivyProType} from "../util/variableTypes";

export const getOrderList = () => request.get("/order/allOrders")

export function getOrderPurchase(params:OrderPurchaseType){
  return request.get("/order/orderPurchase",{params})
}

export function getOrderMark(params:OrderMarkType){
  return request.get("/order/getOrderMark",{params})
}
interface Ptype {
  orderPurchaseId?:string|number
  size?:number
}
 
export function getOrderPurchaseProducts(params:Ptype){
  return request.get("/order/getOrderPurchaseProducts",{params})
}
interface Stype {
  id?:string|number
  size?:number
  current?:number
}
 
export function getRetailers(params:Stype){
  return request.get("/order/getRetailers",{params})
}
 
export function getProduts(params:ProductType){
  return request.get("/product/allProducts",{params})
}

export function addOrderChainProduct(data:OrderPurchaseType){
  return request.post("/order/addOrderProductItem",data)
}
 
export function addOrderAction(data:OrderPurchaseType){
  return request.post("/order/addOrder",data)
}
 
export function UpdateOrderAction(data:OrderPurchaseType){
  return request.post("/order/updateOrder",data)
}