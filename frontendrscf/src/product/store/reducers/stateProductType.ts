import { GoodRSCF, OrderRSCF,ClientDetails } from "../../services/interfaceTypes";

export type StateProductType = {
  isClientLoggedIn: boolean;
  isLoading: boolean;
  error: string;
  goodRSCFs: GoodRSCF[];
  myGoodRSCFs: GoodRSCF[];
  clientDetails: ClientDetails;
  addedClientList: ClientDetails[];
  searchedGoodRSCFs: GoodRSCF[];
  productOrderRSCFs: OrderRSCF[];
};
