/* supplychain interface types */

export interface CategoryType {
    id?:number|string
    CategoryID?:string
    CategoryName?:string
    parentID?:string 
    parentName?:string
    manufacturer?:string
    supplier?:string
    specs?:string
    size?:number
    current?:number
}

export interface ProductType {
    ID?:number|string
    productId:string
    productName?:string
    price?:number
    amount?:number
    productItems?:string
    blockchainHash?:string
    category?:string
    manufacturer?:string
    supplier?:string
    specific?:string
    currentLocation?:string
    size?:number
    current?:number
}

export interface DocumentType {
    id?:number|string
    documentId:string
    documentName?:string
    documentPaths?:string
    documentItems?:string
    //file ipfs hashcode
    fileIPFSHash?:string
    //file ipfs hashcode stored on blockchain for checking consistent
    blockchainHash?:string
    isFileChanged?:string
}


//type used in Order management
export type ActitivyProType = ProductType&{
    groupBuyId?:number|string
    salePrice?:string
    limitBuy?:number
    rate?:number
    stock?:number
    order?:number
}

export interface OrderMarkType{
    id?:number|string
    name?:string
    picture?:string
    type?:number
    current?:number
    size?:number
}
export interface OrderPurchaseType {
    id?:number|string
    userName?:string
    orderId?:string
    orderName?:string
    orderStartTime?:string
    orderEndTime?:string
    orderStatus?:string
    orderAmount?:number
    orderUnitPrice?:number
    products?:string
    retailer?:string
    orderDescription?:string
    orderPreTime?:string
    showHome?:string
    orderMark?:string|number
    limitBuy?:number
    deliverWay?:number
    pickTime?:string
    homePic?:any
    orderType?:number
    currentPage?:number
}

export interface UserType {
    userName:string
    userPassword:string
    role:string
    userEmail:string
    userID: string
    telephone: number
}

export interface LoginResponseType {
    code?:number
    token:string
    msg?:string
    loginInfo:{
        userId: string
        id: string
        userName: string
        token: string
        loginTime: any
    }
}

/* redux definition */
// action type
export interface ActionType{
    type:string
    payload?:any
}