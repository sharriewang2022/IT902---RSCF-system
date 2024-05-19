import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3, {Contract} from "web3";
import web3Load from "../trace/metamask/web3Load"
import { Web3Provider } from '@ethersproject/providers';
import { SMART_CONTRACT_ADDRESS, BLOCKCHAIN_ACCOUNT_ADDRESS } from '../config/sysConfig';
import { supplyChainAbiType } from '../util/smartContractTypeforJson';
import SupplyChainRSCF from '../abis/SupplyChainRSCF.json';
import {UpdateProductHashAction} from '../api/productApi'
import { ethers } from "ethers";


interface BlockProviderProps {
  children: JSX.Element | JSX.Element[]
}

interface BlockContextData {
  addProduct: (productId:string, productName:string, manufacturer:string, supplier:string, currentLocation:string) => any;
  account: any;
  productCount:() => any;
  updateLocation:(location: string, id: string, address: string) => {};
  updateProductOrder:(location: string, ids: string, address: string) => any;
  trackProduct:(id:string) => any;
  fetchOwner:(id:string) => any;
  fetchLocations:(id:string) => any;
}

export const blockContext = createContext({} as BlockContextData)

export function useBlock(){
  return useContext(blockContext)
}

export function BlockProvider({children}:BlockProviderProps){
  // 1. fs, path could not run on client sideconst supplyChainAbi = JSON.parse(fs.readFileSync('../abis/SupplyChainRSCF.json', 
  // {encoding: "utf-8",})).abi as unknown as supplyChainAbiType;
  // //json file is in /public/src/abis/SupplyChainRSCF.json
  // const filePath = path.resolve('./public', 'src', 'abis', 'SupplyChainRSCF.json');
  // const supplyChainjson = fs.readFileSync(filePath);
  // const supplyChainAbi = JSON.parse(supplyChainjson?.toString()).abi as unknown as supplyChainAbiType;
  const supplyChainAbi =  SupplyChainRSCF.abi as unknown as supplyChainAbiType;
  const [account , setAccount] = useState("");
  const [supplyChainABI ,setSupplyChainABI] = useState<Contract<supplyChainAbiType>>(new Contract<supplyChainAbiType>(supplyChainAbi));
  // const [smartContract ,setSmartContract] = useState<any>();
  const [isMetamask, setIsMetamask] = useState(false);
  const [web3,setWeb3] = useState<any>();
  const [contractList, setContractList] = useState();
  const [contacts, setContacts] = useState([]);
  const [contract, setContract] = useState<ethers.Contract>();
  const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider>();

  //register MetaMask provider
  useEffect(() => {
    web3Load()
    if(window.ethereum){
        loadBlockChainData()
        window.ethereum.on('accountsChanged', function (accounts:any) {
        setAccount(accounts[0])
      })
      return window.ethereum.off
    }
  },[])
  
  // // register MetaMask provider when network changes
  // useEffect(() => {
  //   loadWeb3()
  //   if(window.ethereum){
  //     window.ethereum.on("accountsChanged", (accounts: any) => {
  //       const provider = new Web3Provider(window.ethereum);
  //       // const provider = new ethers.providers.get(window.ethereum);
  //       // window.web3.setProvider(provider)
  //       console.log(accounts[0]);
  //     });
  //     window.ethereum.on('chainChanged', () => {
  //       // handle what happens when chain changes, prefereably reload the page
  //       const provider = new Web3Provider(window.ethereum);
  //       // error:window.web3.setProvider is not a function
  //       // window.web3.setProvider(provider)
  //       window.location.reload(); 
  //     });
    
  //     // window.ethereum.request({ method: "eth_requestAccounts" })
  //     // .then( (accounts: any) => 
  //     //   {
  //     //     console.log(accounts[0]);
  //     //   }
  //     // )
  //   }
  //   const loadProvider = async () => {
  //     let contractAddress = SMART_CONTRACT_ADDRESS;
  //     const url = "http://localhost:7545";
  //     const provider = new ethers.providers.JsonRpcProvider(url);
  //     const contract = new ethers.Contract(
  //         contractAddress,
  //         SupplyChainRSCF.abi,
  //         provider
  //     );
  //     setContract(contract);
  //     setProvider(provider);
  //     };
  //     loadProvider();
  // }, []);
 
  async function loadWeb3() {
    if (window.ethereum) {
      setIsMetamask(true)
      window.web3 = new Web3(window.ethereum)
      // await window.ethereum.enable()
    }
    else if (window.web3) {
      setIsMetamask(true)
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {          
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');          
    }
  }

  //react connect blockchain smart contract
  //1.Load web3 after has a wallet; 
  //2.(Optional) put web3 object and the accounts from web3.eth.getAccounts() to setState
  //3.Create contract instance with the address from deployment.  can deploy the contract dynamically from the app but more complicated.
  //4.Add the contract to the state
  //Call methods on the contract
  async function loadBlockChainData(){
    // window.ethereum.enable();   
    // const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const web3 = new Web3("http://127.0.0.1:7545")
    const accounts = await web3.eth.getAccounts()
    setWeb3(web3)
    // Get the accounts from MetaMask      
    setAccount(accounts[0]);
    web3.eth.defaultAccount = accounts[0];
    console.log("accounts[0]:" + accounts[0]);

    // Get the network ID
    // const currentNetworkId = parseInt(await window.ethereum.request({ method: 'net_version' }));
    // Get the network data from the contract JSON
    // const networkId = await web3.eth.net.getId();
    // const chainId = await web3.eth.getChainId();
    const contractAddress = SMART_CONTRACT_ADDRESS;   
    //get smart contract in supplyChain.json. parameters: (contractABI, contractAddress）            
    const productContractAbi = new web3.eth.Contract(supplyChainAbi, contractAddress);
    setSupplyChainABI(productContractAbi)       
  }

  // async function loadBlockChainData(){
  //   const web3 = window.web3
  //   setWeb3(web3)
  //   const accounts = await web3.eth.getAccounts()
  //   setAccount(accounts[0])
  //   const networkId = await web3.eth.net.getId()
  //   console.log(networkId)
  //   const supplyAbi = new web3.eth.Contract(supply)
  //   const networkData = supplyAbi.networks[networkId]
  //   const chainABI =   new web3.eth.Contract(supply.abi,networkData.address,{ transactionConfirmationBlocks: 1,gasPrice :200000000000})
  //   setSupplyChainABI(chainABI)
  //   console.log(chainABI)    
  
  // if (currentNetworkId !== chainId) {
  //   try {
  //     await window.ethereum.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{ chainId: `0x${addresses.chainId.toString(16)}` }],
  //     });
  //   } catch (error:any) {
  //     console.error('Error switching network:', error);
  //     if (error.code === 4902) {
  //       console.error(`Please add the mumbai network to your MetaMask wallet`, {
  //         type: 'error',
  //       });
  //     } else {
  //       console.error('User rejected the request.');
  //     }
  //   }
  // }
  // this.contract = this.contract.connect(this.signer);  
  // }

  async function addProduct(productId:string, productName:string, manufacturer:string, supplier:string, currentLocation:string){
    if(supplyChainABI == undefined){
      return;
    } 
    // contract.methods.transfer   
    return supplyChainABI.methods.addProduct(productId, productName, manufacturer, supplier, currentLocation).send({from : account})
      .on('transactionHash', function(hash:any){
        console.log("supplyChainABI addProduct transactionHash:" + hash)
      })
      .on('receipt', function(receipt:any){
        console.log("supplyChainABI addProduct receipt:" + receipt)
        //update product hashcode
        UpdateProductHashAction(productId, receipt.blockHash)
          .then(res=>{
            if(res.data!=undefined){
              console.log(" change product "+ productId +" blockchain hashcode " + receipt.blockHash + " successfully!")
            }else{
              console.log(" change product "+ productId +" blockchain hashcode " + receipt.blockHash + " fail!")
            }
          })
      })
      .on('error', function(error:any){
        console.log("supplyChainABI addProduct error:" + error)
      })      
  }

  function updateLocation(location: string, id: string, address: string){
    return supplyChainABI.methods.changeLocation(location,id,address).send({from : account})
  } 

  function updateProductOrder(location: string, ids: string, address: string){
    var productIDArray = ids.split(",")
    productIDArray.map(
      (productID:string)=>supplyChainABI.methods.changeLocation(location,productID,address).send({from : account})
    )
  } 

  async function trackProduct(id:string){
    if(supplyChainABI == undefined){
      return;
    }
    console.info("product ID: ", id);    
    console.info("contract trackProduct result: ", supplyChainABI);  
 
    // const balance = web3.eth.getBalance(addr)
    const counter = supplyChainABI.methods.fetchProductInfo(id).call({from : account})
    console.info("Ganache  fetchProductInfo: ", counter);  

    // const b =  await supplyChainABI.methods.proOutput().send({from:account});
    // console.info("Ganache  proOutput: ", b);  
    // const a =  await supplyChainABI.methods.getProducts().send({from:account});
    // const count1 = supplyChainABI.methods.proOutput().call({from:account})
    // console.info("Ganache  proOutput: ", count1);    
  }

  function productCount(){
    return supplyChainABI.methods.productCount().send({from:account})
      .then(function(balance){
        console.log("supplyChainABI productCount:" + balance)
      }).catch(function(error){
        console.log("supplyChainABI productCount error:" + error)
      }) 
  }

  function fetchOwner(id:string){
    return supplyChainABI.methods.fetchAddress(id).send({from:account})
      .then(function(balance){
        console.log("supplyChainABI fetchAddress:" + balance)
      }).catch(function(error){
        console.log("supplyChainABI fetchAddress error:" + error)
      }) 
  }

  function fetchLocations(id:string){
    return supplyChainABI.methods.fetchAllLocation(id).send({from:account})
      .then(function(balance){
        console.log("supplyChainABI fetchAllLocation:" + balance)
      }).catch(function(error){
        console.log("supplyChainABI fetchAllLocation error:" + error)
      }) 
  }
  const value = {
    addProduct,
    account,
    productCount,
    updateLocation,
    updateProductOrder,
    trackProduct,
    fetchOwner,
    fetchLocations
  }
  return(
      <blockContext.Provider value = {value}>
        {children}
      </blockContext.Provider>
  ) 
}
