import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type MessageState = {
  count: number;
  product: {
    ID: string;
    name: string;
    manufacturer: string;
    supplier: string;
    currentLocation: string;
    productProblem: string;
  };
};

const initialState = {
  count: -1,
  product: {
    ID: "",
    name: "",
    manufacturer: "",
    supplier: "",
    currentLocation: "",
    productProblem:""
  },
} as MessageState;

export const messageSlice = createSlice({
  name: "Messages",
  initialState,
  reducers: {
    addProductId: (state, action: PayloadAction<string>) => {
      state.product.ID = action.payload;
    },
    addProductName: (state, action: PayloadAction<string>) => {
      state.product.name = action.payload;
    },
    addManufacturer: (state, action: PayloadAction<string>) => {
      state.product.manufacturer = action.payload;
    },
    reportProductProblem: (state, action: PayloadAction<string>) => {
      state.product.productProblem = action.payload;
    },
    startCount: (state) => {
      state.count = 5;
    },
    decrementCount: (state) => {
      state.count -= 1;
    },
  },
});

export const {addProductId, addProductName, addManufacturer, reportProductProblem, startCount, decrementCount } =  messageSlice.actions;
export default messageSlice.reducer;
