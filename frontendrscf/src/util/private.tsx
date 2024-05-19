import { Navigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, {ReactNode,FC} from 'react'

interface Iprops{
  children?:ReactNode
}

// permission control function
// define Private is FC type, and instruction generics is Iprops
// props is parameter from father component，chilren is Nested Type
// like interface FC<P> {props:P}
// notice: FC should use real type IProps
const PrivateRoute:FC<Iprops>=(props)=> {
   var token= sessionStorage.getItem("token");
  //  useLocation creates a location object, including path property
   const location = useLocation();
   if(token){
    return <>{props.children}</>
   }else{
    //redirect to login page
    return <Navigate to={'/?redirect='+location.pathname}></Navigate>
   }
}

export default PrivateRoute;