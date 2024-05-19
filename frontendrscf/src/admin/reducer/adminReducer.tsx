import React from 'react';
import { SET_USER,SET_TOKEN,SET_MENU, SET_ROUTES} from "../../util/constant"
import type { ActionType } from "../../util/variableTypes"
import { 
  ContainerOutlined,
} from '@ant-design/icons';

const initialState = {
  userInfo:{},
  token:"",
  menu:[
    {label: 'Overview',
      key: '/dashboard',
      icon: <ContainerOutlined onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
    }
  ],//Dynamic Menu
  routes:[],//Dynamic route
}

function adminReducer(state=initialState,action:ActionType){

  switch(action.type){
    // set user information, new info is action.payload
    case SET_USER:
      return {...state,userInfo:action.payload}
    // set token, action.payload is new token
    case SET_TOKEN:
      return {...state,token:action.payload}
    // set menu
    case SET_MENU:
      return {...state,menu:action.payload}
    // set route
    case SET_ROUTES:
      return {...state,routes:action.payload}
    default:
      return state;
  }
}

export default adminReducer