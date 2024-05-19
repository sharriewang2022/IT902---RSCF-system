import { getCurrentEpoch } from "./utilProduct";
import { SMART_CONTRACT_ADDRESS, BLOCKCHAIN_ACCOUNT_ADDRESS } from '../../config/sysConfig';
import { GoodRSCF, OrderRSCF, FileHashRSCF, ClientDetails } from "./interfaceTypes";
import { Contract, ethers } from "ethers";
import { List } from "reactstrap";

//refer ABI smart contract methods
const ContractABI = require("../../abis/SupplyChainRSCF.json");

declare let window: any;

export class SupplyChainRSCFService {
  private static instance: SupplyChainRSCFService;
  private _supplyChainContract!: Contract;
  private _accountAdress: string | undefined;

  // private constructor() {
  //   this._supplyChainContract = this.getContract(CONTRACT_ADDRESS);
  // }
  public static getInstance(): SupplyChainRSCFService {
    if (!SupplyChainRSCFService.instance) {
      SupplyChainRSCFService.instance = new SupplyChainRSCFService();
    }
    return SupplyChainRSCFService.instance;
  }

  checkedWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return false;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      this._accountAdress = accounts[0];
      console.log("blockchain account Address:"+this._accountAdress );
      this._supplyChainContract = this.getSmartContract();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  async ethEnabled() {
    return await this.checkedWallet();
  }

  getSmartContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();    
    return new ethers.Contract(SMART_CONTRACT_ADDRESS, ContractABI["abi"], signer);
  }

  async getSomeDetails(): Promise<ClientDetails> {
    try {
      await this.ethEnabled();
      const _client: ClientDetails = await this._supplyChainContract.getClientDetails(
        this._accountAdress
      );
      return _client;
    } catch (error) {
      console.log(error, "error");
      throw new Error("Error while fetching some clients detail");
    }
  }

  async getClientDetail(address: string): Promise<ClientDetails> {
    try {
      await this.ethEnabled();
      const _client: ClientDetails = await this._supplyChainContract.getClientDetails(
        address
      );
      return _client;
    } catch (error) {
      console.log(error, "error");
      throw new Error("Error while getting clients detail");
    }
  }
  async getAllGoodRSCFs(): Promise<GoodRSCF[]> {
    try {
      await this.ethEnabled();
      const _list = await this._supplyChainContract.getAllGoodRSCFs();
      const goodRSCFList: GoodRSCF[] = _list;
      return goodRSCFList;
    } catch (error) {
      console.log(error);
      throw new Error("All Goods list could not be get");
    }
  }

  async getSomeGoodRSCFs(): Promise<GoodRSCF[]> {
    try {
      await this.ethEnabled();
      const _list = await this._supplyChainContract.getSomeGoodRSCFs();
      const goodRSCFList: GoodRSCF[] = _list;
      return goodRSCFList;
    } catch (error) {
      console.log(error);
      throw new Error("Some Good list could not be get");
    }
  }

  async getSingleGoodRSCF(goodRSCFId: string): Promise<GoodRSCF> {
    try {
      await this.ethEnabled();
      const data = await this._supplyChainContract.getSingleGoodRSCF(goodRSCFId);
      console.log("getSingleGoodRSCF from blockchain:" + data);
      const goodRSCF: GoodRSCF = data[0];
      const newGoodRSCFData = { ...goodRSCF, goodRSCFHistory: data[1] };
      return newGoodRSCFData;
    } catch (error) {
      throw new Error("One Single Good could be get" + error);
    }
  }

  async addGoodRSCF(goodRSCF: GoodRSCF): Promise<boolean> {
    try {
      await this.ethEnabled();
      const currentEpoch = getCurrentEpoch();
      goodRSCF.manufacturer = this._accountAdress;
      const addGoodRSCF = await this._supplyChainContract.addGoodRSCF(
        goodRSCF,
        currentEpoch
      );
      console.log(goodRSCF, "addGoodRSCF");
      return addGoodRSCF;
    } catch (error) {
      console.log("error", error);
      throw new Error("Good add failed!");
    }
  }

  async sellGoodRSCF(partyAddress: string, goodRSCFId: string): Promise<boolean> {
    try {
      const currentEpoch = getCurrentEpoch();
      const sell = await this._supplyChainContract.sellGoodRSCF(
        partyAddress,
        goodRSCFId,
        currentEpoch
      );
      return sell;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async addParty(party: ClientDetails): Promise<boolean> {
    try {
      const addClient = await this._supplyChainContract.addParty(party);
      return addClient;
    } catch (error) {
      console.log(error);
      throw new Error("Add client could not be get");
    }
  }

  async getSomeClientsList(): Promise<ClientDetails[]> {
    try {
      await this.ethEnabled();
      const _list: ClientDetails[] =
        await this._supplyChainContract.getSomeClientsList();
      return _list;
    } catch (error) {
      console.log(error);
      throw new Error("Some Clients list could not be get");
    }
  }

  async addOrderRSCF(orderRSCF:OrderRSCF): Promise<OrderRSCF> {
    try {
      await this.ethEnabled(); 
      const currentEpoch = getCurrentEpoch();
      orderRSCF.customerName = this._accountAdress;
      const addOrderRSCF = await this._supplyChainContract.addOrderRSCF(
        orderRSCF,
        currentEpoch
      );
      console.log(addOrderRSCF, "addOrderRSCF");
      return orderRSCF;
    } catch (error) {
      console.log("error", error);
      throw new Error("Order add failed!");
    }
  }

  //get one product related orders
  async getProductOrderRSCF(productIdParam: string): Promise<OrderRSCF[]> {
    try {
      await this.ethEnabled();
      const allOrderData = await this._supplyChainContract.getAllOrderRSCF();
      console.log("getAllOrderRSCF from blockchain:" + allOrderData);
      var orderProductData:Array<OrderRSCF>= [];
      var orderRSCFTemp:OrderRSCF= {
        orderId: "",
        customerName: "", //address
        productId: "",
        productName: "",
        orderStatus: "",
        quantity: 0,
        price: 0,
      };
      allOrderData.map((item:any)=>{  
        if(item.productId == productIdParam) { 
          orderRSCFTemp.orderId = item.orderId;
          orderRSCFTemp.productId = item.productId;
          orderRSCFTemp.productName = item.productName;
          orderRSCFTemp.customerName = item.customerName;
          orderRSCFTemp.orderStatus = item.orderStatus;
          //solidity bigNumber change to typescript number 
          orderRSCFTemp.quantity = Number(item.quantity); 
          orderRSCFTemp.price = Number(item.price);   
          orderProductData.push(orderRSCFTemp);
        }      
      }) 
      return orderProductData;
    } catch (error) {
      throw new Error("One product related orders could be get" + error);
    }
  }

  // add file IPFS hashcode to blockchain for security
  async addFileIPFSHashRSCF(fileHashRSCF:FileHashRSCF): Promise<FileHashRSCF> {
    try {
      await this.ethEnabled(); 
      const addFileIPFSHash = await this._supplyChainContract.addFileHashCode(fileHashRSCF);
      console.log(addFileIPFSHash, "addFileIPFSHash");
      return addFileIPFSHash;
    } catch (error) {
      console.log("error", error);
      throw new Error("File IPFS hashcode add failed!");
    }
  }

  //get all file IPFS hashcode stored on the blockchain
  async getAllFileIPFSHash(): Promise<FileHashRSCF[]> {
    try {
      await this.ethEnabled();
      const allFileIPFSHashData = await this._supplyChainContract.getAllFileIPFSHash();
      console.log("getAllFileIPFSHash from blockchain:" + allFileIPFSHashData);
      const allFileIPFSHash: FileHashRSCF[] = allFileIPFSHashData;
      return allFileIPFSHash;
    } catch (error) {
      throw new Error("One product related orders could be get" + error);
    }
  }
}
