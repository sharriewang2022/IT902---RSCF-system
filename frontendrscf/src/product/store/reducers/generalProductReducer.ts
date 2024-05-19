import { AnyAction } from "redux";
import { ACTIONRSCF } from "../actions/actionProductTypes";
import { StateProductType } from "./stateProductType";
import { ClientDetails, ClientRole } from "../../services/interfaceTypes";

const initialState: StateProductType = {
  isClientLoggedIn: false,
  isLoading: false,
  error: "",
  goodRSCFs: [],
  myGoodRSCFs: [],
  clientDetails: {} as ClientDetails,
  searchedGoodRSCFs: [],
  addedClientList: [],
  productOrderRSCFs:[],
};

export function generalProductReducer(
  state = initialState,
  action: AnyAction
): StateProductType {
  switch (action.type) {
    case ACTIONRSCF.SET_LOGIN_STATUS: {
      const { status } = action.payload;
      let clientGet;
      if (action.payload) {
        clientGet = localStorage.getItem("LOGGEDIN_CLIENT");
        if (clientGet) {
          clientGet = JSON.parse(clientGet);
        }
      }
      let client: ClientDetails = {
        email: clientGet[3],
        name: clientGet[2],
        id_: clientGet[1],
        role: roleMap(clientGet[0]),
      };
      return {
        ...state,
        isClientLoggedIn: status,
        clientDetails: client ?? null,
      };
    }

    case ACTIONRSCF.GET_ALL_GOODS:
      return {
        ...state,
        goodRSCFs: action.payload,
      };

    case ACTIONRSCF.SET_CLIENT_DETAILS:
      let client: ClientDetails = action.payload;
      localStorage.setItem("LOGGEDIN_CLIENT", JSON.stringify(client));
      return {
        ...state,
        clientDetails: action.payload,
      };

    case ACTIONRSCF.SET_NEW_GOOD:
      const obj = action.payload;
      return {
        ...state,
        goodRSCFs: [...state.goodRSCFs, obj],
      };

    case ACTIONRSCF.GET_SOME_GOODS:
      return {
        ...state,
        myGoodRSCFs: action.payload,
      };

    case ACTIONRSCF.GET_CLIENTLIST:
      return {
        ...state,
        addedClientList: action.payload,
      };
      
    case ACTIONRSCF.SET_SEARCHED_GOOD:
      return {
        ...state,
        searchedGoodRSCFs: action.payload,
      };

    case ACTIONRSCF.GET_GOOD_ORDERS:
      return {
        ...state,
        productOrderRSCFs: action.payload,
      };

    case ACTIONRSCF.RESET:
      return initialState;

    default:
      return state;
  }
}
export default generalProductReducer;

function roleMap(role: number): ClientRole {
  switch (role) {
    case 0:
      return ClientRole.Manufacturer;
    case 1:
      return ClientRole.Supplier;
    case 2:
      return ClientRole.Retailer;
    case 3:
      return ClientRole.Administrator;
    default:
      return ClientRole.Customer;
  }
}
