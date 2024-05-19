import request from "../util/request";
import { AxiosResponse } from 'axios';
import { UserType} from "../util/variableTypes";

// log in api
interface ReType{
  code:number
  msg?:string
  token:string,
  loginInfo:any
}

// return: Promise with AxiosResponse<UserType>
export function login(data:UserType):Promise<AxiosResponse<ReType>>{
  return request.post("/user/login",data)
}

// get user menu
// "/menu/getSomeMenu/<string:userId>"
export function getUserMenu(userID: string){
  return request.get("/menu/getSomeMenu/"+userID)
}

/* get user list */
export const getUserList = () =>
  // request<UserType>({
    // url: '/user/users?q=${searchName}',
    // method: 'get',
    request.get("/user/allUsers")
  // });


export function addUser(userParam: UserType){
  return request.post("/user/register",userParam)
}
// export const AddUser = (userValue: UserType) =>
//   request<UserType>({
//     url: '/api/user/addUser?q=${userValue}',
//     method: 'post',
//   });