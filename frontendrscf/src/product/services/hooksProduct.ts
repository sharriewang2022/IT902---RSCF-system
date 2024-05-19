import React,{ useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { GoodRSCF, OrderRSCF, FileHashRSCF, ClientDetails } from "./interfaceTypes";
import { SupplyChainRSCFService } from "./supplyChainRSCF";
import {
  setAllGoodRSCFs,
  setClientDetails,
  setNewGoodRSCF,
  getClientsList,
  setSomeGoodRSCFs,
  setGoodOrderRSCFs,
  setNewOrderRSCF,
} from "../store/actions/actionProduct";
import { toastError, toastSuccess } from "./toastMessages";

export const GoodRSCFApiCall = () => {
  const apiInstance = SupplyChainRSCFService.getInstance();
  const dispatch = useDispatch();
  const [goodRSCFData, setGoodRSCFData] = useState<GoodRSCF>();
  const [loading, setLoading] = useState(false);
  const [goodRSCFListLoading, setGoodRSCFListLoading] = useState(false);
  const [someGoodRSCFListLoading, setSomeGoodRSCFListLoading] = useState(false);
  const [goodRSCFDetailsLoading, setGoodRSCFDetailsLoading] = useState(false);
  const [clientListLoading, setClientListLoading] = useState(false);

  const getClientList = useCallback(async () => {
    try {
      setClientListLoading(true);
      const clients = await apiInstance.getSomeClientsList();
      dispatch(getClientsList(clients));
    } catch (error) {
      console.log(error);
      toastError("Failed to get client");
    } finally {
      setClientListLoading(false);
    }
  }, []);

  const getSomeGoodRSCFs = useCallback(async () => {
    try {
      setSomeGoodRSCFListLoading(true);
      const listData = await apiInstance.getSomeGoodRSCFs();
      dispatch(setSomeGoodRSCFs(listData));
    } catch (error) {
      console.log(error);
      toastError("Failed to get my goodRSCFs");
    } finally {
      setSomeGoodRSCFListLoading(false);
    }
  }, []);

  const getGoodRSCFs = useCallback(async () => {
    try {
      setGoodRSCFListLoading(true);
      const listData: GoodRSCF[] = await apiInstance.getAllGoodRSCFs();
      dispatch(setAllGoodRSCFs(listData));
    } catch (error) {
      console.log(error);
      toastError("Could not retrive goodRSCF list");
    } finally {
      setGoodRSCFListLoading(false);
    }
  }, []);

  //get one proudct related orders
  const getProductOrderRSCF = useCallback(async (goodId: string) => {
    try {
      setGoodRSCFListLoading(true);
      const listData: OrderRSCF[] = await apiInstance.getProductOrderRSCF(goodId);
      dispatch(setGoodOrderRSCFs(listData));
      return listData;
    } catch (error) {
      console.log(error);
      toastError("Could not retrive goodRSCF list");
    } finally {
      setGoodRSCFListLoading(false);
    }
  }, []);

  const getGoodRSCFDetails = useCallback(async (goodRSCFId: string) => {
    try {
      setGoodRSCFDetailsLoading(true);
      const goodRSCFDataTemp: GoodRSCF = await apiInstance.getSingleGoodRSCF(
        goodRSCFId
      );
      setGoodRSCFData(goodRSCFDataTemp);
      return goodRSCFDataTemp;
    } catch (error) {
      console.log(error);
      toastError("Failed to retrive GoodRSCF details");
    } finally {
      setGoodRSCFDetailsLoading(false);
    }
  }, []);

  const getClientDetails = useCallback(async () => {
    try {
      const clientDetails: ClientDetails = await apiInstance.getSomeDetails();
      dispatch(setClientDetails(clientDetails));
    } catch (error) {
      toastError("Couldnt retrive client details");
    }
  }, [dispatch]);

  const getIndividualDetails = useCallback(async (id : any) => {
    try {
      const clientDetails: ClientDetails = await apiInstance.getClientDetail(id);
      return clientDetails;
    } catch (error) {
      toastError("Couldnt retrive client details");
    }
  }, []);

  const sellSomeGoodRSCF = useCallback(
    async (partyAddress: string, goodRSCFId: string) => {
      try {
        const sellerDetails: boolean = await apiInstance.sellGoodRSCF(
          partyAddress,
          goodRSCFId
        );
        if (sellerDetails) {
          toastSuccess("GoodRSCF successfully sold");
        }
      } catch (error) {
        toastError("Something went wrong");
      }
    },
    []
  );

  const addSomeGoodRSCF = useCallback(async (goodRSCF: GoodRSCF) => {
    try {
      const goodRSCFAdded = await apiInstance.addGoodRSCF(goodRSCF);
      if (goodRSCFAdded) {
        dispatch(setNewGoodRSCF(goodRSCF));
        toastSuccess("Transaction to add new goodRSCF has been initiated.");
        return true;
      }
    } catch (error) {
      toastError("Failed to add goodRSCF");
    }
  }, []);

  const addSomeOrderRSCF = useCallback(async (orderRSCF: OrderRSCF) => {
    try {
      const orderRSCFAdded = await apiInstance.addOrderRSCF(orderRSCF);
      if (orderRSCFAdded) {
        dispatch(setNewOrderRSCF(orderRSCF));
        toastSuccess("Transaction to add new order has been initiated.");
        return orderRSCFAdded;
      }
    } catch (error) {
      toastError("Failed to add order");
    }
  }, []);

  const addFileIPFSHash = useCallback(async (fileHashRSCF: FileHashRSCF) => {
    try {
      const fileHashRSCFAdded = await apiInstance.addFileIPFSHashRSCF(fileHashRSCF);
      if (fileHashRSCFAdded) {
        toastSuccess("Transaction to add new file IPFS hashcode has been completed.");
        return fileHashRSCFAdded;
      }
    } catch (error) {
      toastError("Failed to add order");
    }
  }, []);

  //get all file IPFS hashcode stored on the blockchain for comparing
  const getFileIPFSHash = useCallback(async () => {
    try {
      setGoodRSCFListLoading(true);
      const listData: FileHashRSCF[] = await apiInstance.getAllFileIPFSHash();
      return listData;
    } catch (error) {
      console.log(error);
      toastError("Could not retrive goodRSCF list");
    } finally {
      setGoodRSCFListLoading(false);
    }
  }, []);

  const addClients = useCallback(async (client: ClientDetails) => {
    try {
      setLoading(true);
      const clientAdded = await apiInstance.addParty(client);
      console.log(clientAdded);
      toastSuccess("client added successfully");
    } catch (error) {
      toastError("Failed to add client");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getGoodRSCFs,
    getGoodRSCFDetails,
    goodRSCFData,
    setGoodRSCFData,
    getClientDetails,
    sellSomeGoodRSCF,
    addSomeGoodRSCF,
    getProductOrderRSCF,
    addSomeOrderRSCF,
    addFileIPFSHash,
    getFileIPFSHash,
    addClients,
    getClientList,
    getSomeGoodRSCFs,
    getIndividualDetails,
    loading,
    clientListLoading,
    goodRSCFListLoading,
    someGoodRSCFListLoading,
    goodRSCFDetailsLoading,
  };
};
