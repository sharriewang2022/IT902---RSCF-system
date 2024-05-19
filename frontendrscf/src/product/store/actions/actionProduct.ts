import { GoodRSCF, ClientDetails, OrderRSCF } from "../../services/interfaceTypes";
import { ACTIONRSCF } from "./actionProductTypes";

export function setLoginStatus(payload: {
  status: boolean;
  // clientType: ClientType;
}) {
  return {
    type: ACTIONRSCF.SET_LOGIN_STATUS,
    payload,
  };
}

export function resetStates() {
  return {
    type: ACTIONRSCF.RESET,
  };
}

export const setAllGoodRSCFs = (payload: GoodRSCF[]) => {
  return {
    type: ACTIONRSCF.GET_ALL_GOODS,
    payload,
  };
};

export const setGoodOrderRSCFs = (payload: OrderRSCF[]) => {
  return {
    type: ACTIONRSCF.GET_GOOD_ORDERS,
    payload,
  };
};

export const setSomeGoodRSCFs = (payload: GoodRSCF[]) => {
  return {
    type: ACTIONRSCF.GET_SOME_GOODS,
    payload,
  };
};

export const setClientDetails = (payload: ClientDetails) => {
  return {
    type: ACTIONRSCF.SET_CLIENT_DETAILS,
    payload,
  };
};

export const setNewGoodRSCF = (payload: GoodRSCF) => {
  return {
    type: ACTIONRSCF.SET_NEW_GOOD,
    payload,
  };
};

export const setNewOrderRSCF = (payload: OrderRSCF) => {
  return {
    type: ACTIONRSCF.SET_NEW_ORDER,
    payload,
  };
};

export const getClientsList = (payload: ClientDetails[]) => {
  return {
    type: ACTIONRSCF.GET_CLIENTLIST,
    payload,
  };
};

export const setSearchedGoodRSCF = (payload: GoodRSCF[]) => {
  return {
    type: ACTIONRSCF.SET_SEARCHED_GOOD,
    payload,
  };
};
