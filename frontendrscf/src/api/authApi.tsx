import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from '../util/authError'
import { signOut } from '../contexts/authContext'
import { SERVER_BASE_URL } from "../config/sysConfig";

export function authAPIClient(cookiesContext = undefined){
  let cookies = parseCookies(cookiesContext);

  const authApi = axios.create({
    // baseURL: process.env.NEXT_PUBLIC_API_URL,
    baseURL: SERVER_BASE_URL,
    // headers:{
    //   Authorization: `Bearer ${cookies['@rscf.token']}`
    // }
    timeout: 50000,
  })

  authApi.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if(error.response?.status === 401){
      if(typeof window !== undefined){
        signOut();    
      }else{
        return Promise.reject(new AuthTokenError())
      }
    }
    return Promise.reject(error);
  })

  return authApi;
}