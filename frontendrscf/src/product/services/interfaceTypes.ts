export interface GoodRSCF {
  goodRSCFName: string;
  goodRSCFId: string;
  manufacturerName: string;
  manufacturer?: string; //address
  batchCount: number;
  expDateEpoch: number;
  manDateEpoch: number;
  goodRSCFType: GoodRSCFType | string;
  categoryName: string;
  composition: string[];
  sideEffects: string[];
  goodRSCFHistory?: GoodRSCFHistory;
}

export interface ClientDetails {
  role: ClientRole;
  id_: string; // metamask address
  name: string;
  email: string;
}

export interface ClientHistory {
  clientId: string; // account Id of the client
  date: number; // Added, Purchased date in epoch in UTC timezone
}

export interface GoodRSCFHistory {
  manufacturer: ClientHistory;
  supplier: ClientHistory;
  retailer: ClientHistory;
  customers: ClientHistory[];
}

export enum ClientRole {
  Administrator,
  Manufacturer,
  Supplier,
  Retailer,
  Customer,
}

export enum GoodRSCFType {
  Furniture, // --0
  Toy, // --1
  Jewelry, // --2
  Food, // --3
  Clothes // --4
}

export interface OrderRSCF {
  orderId: string;
  customerName?: string; //address
  productId: string;
  productName: string;
  orderStatus: string;
  quantity: number;
  price: number;
}

export interface FileHashRSCF {
  documentId: string;
  hashcodeIPFS: string;
  fileName: string;
  filePath: string;
}
