// import {combineReducers,applyMiddleware} from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import adminReducer from '../admin/reducer/adminReducer'

// createStore
const store = configureStore({
  // the first parameter is reducer combineReducers is the group of some reducers
  reducer : {
    adminReducer,
  },
 
  //add middleware processor
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
        serializableCheck: false,
    }),
  }
)
 
export default store

export type RootState = ReturnType <typeof store.getState>