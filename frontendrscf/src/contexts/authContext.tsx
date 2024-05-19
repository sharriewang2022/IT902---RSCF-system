import React from 'react';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import { AxiosResponse } from 'axios'
import { authApi } from '../api/authApiClient'
import { UserType } from '../util/variableTypes';
import { addUser } from '../api/adminApi';

interface AuthContextData {
  currentUser: UserType | undefined | null;
  isAuthenticated: boolean;
  // login: (credentials: SignInProps) => Promise<void>;
  login: (username:string, password:string, role:string) => Promise<void>;
  signUp: (credentials: UserType) =>  Promise<void>;
  logout: () => Promise<void>;
  updatemail : (email:string) => void;
  updatePass : (pass:string) => void;
  updateRoleInBase : (role:string, id:string) => void;
  updateUserInBase : (userName:string, id:string, address:string) => Promise<void>;
  updateAddressInBase: (userName:string, caddress:string, address:string, id:string) => Promise<void>;
  addressToName:(address: string) => Promise<void>;  
}

interface SubscriptionProps {
  id: string;
  status: string;
}

type AuthProviderProps = {
  children: ReactNode | JSX.Element | JSX.Element[];
} 

interface SignInProps {
  email: string;
  password: string;
}

interface SignUpProps{
  name: string;
  email: string;
  password: string;
  role: string
}

export const AuthContext = createContext({} as AuthContextData)

export function useAuth(){
  return useContext(AuthContext)
}

export function signOut(){
  console.log("ERORR signOut");  
  try{
    destroyCookie(null, '@rscf.token', { path: '/' })
  }catch(err){
    console.log("Error is from signOut")
  }
}

export function AuthProvider({ children }: AuthProviderProps){
  const [currentUser, setCurrentUser] = useState<UserType>()
  const isAuthenticated = !!currentUser;

  useEffect(() => {
    const { '@rscf.token': token } = parseCookies();

    if(token){
      authApi.get('/user/getSomeUser/'+token).then(response => {
        const { userName, userPassword, role, userEmail, uid, telephone} = response.data;
        setCurrentUser({    
          userName,
          userPassword,
          role,
          userEmail,
          userID: uid,
          telephone
        })
      })
      .catch(()=> {
        signOut()
      })
    }
  }, [])

  async function login( username:string , password:string, userRole:string ){
  // async function login({ email, password }: SignInProps){
    try{
      const response = await authApi.post("/user/login", {
        username, password, userRole
      })
      const {userName, userPassword, role, userEmail, uid, telephone, token} = response.data;
      setCookie(undefined, '@rscf.token', userName, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mês
        path: '/'
      })
      setCurrentUser({
        userName,
        userPassword,
        role,
        userEmail,
        userID: uid,
        telephone
      })
      authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }catch(err){
      console.log("Error to login system!", err)
    }
  }
  //add new user
  async function signUp({ userName, userEmail, userPassword, role, userID, telephone}: UserType){
    try{
      addUser({
        userName, userEmail, userPassword, role, userID, telephone
      })
    }catch(err){
      console.log(err);
    }
  }

  async function logout(){
    try{
      destroyCookie(null, '@rscf.token', { path: '/' })
      setCurrentUser(undefined);
    }catch(err){
      console.log("logoutUser error", err)
    }
}

function updateRoleInBase(role:string, id:string) {
    // return authApi.post("users/" + id).update({
    //     role:role,
    // })
}

async function updateUserInBase(userName:string, id:string, address:string) {
//     return authApi.ref("users/" + id).update({
//         username:userName
//     })
}

async function updateAddressInBase(userName:string, caddress:string, address:string, id:string) {
//     return authApi.ref("users/" + id).update({
//        address:address
//     }) 
}

function updatemail(emailStr: string) {
    if(currentUser !== undefined){
        setCurrentUser({ userName:currentUser.userName, 
            userPassword : currentUser.userPassword,
            telephone : currentUser.telephone,
            userID : currentUser.userID,
            role: currentUser.role,
            userEmail: emailStr});
    }
}

function updatePass(pass:string) {
    if(currentUser !== undefined){
        setCurrentUser({ userName:currentUser.userName, 
            userPassword :  pass,
            telephone : currentUser.telephone,
            userID : currentUser.userID,
            role: currentUser.role,
            userEmail: currentUser.userEmail});
    }
}

async function addressToName(address:string){

    try{
        const response = await authApi.post("/addressToName", {
          address,
        })
  
        const {userName, userPassword, role, userEmail, uid, telephone, token} = response.data;
  
        setCookie(undefined, '@rscf.token', token, {
          maxAge: 60 * 60 * 24 * 30, // Expirar em 1 
          path: '/'
        })
  
        setCurrentUser({
          userName,
          userPassword,
          role,
          userEmail,
          userID: uid,
          telephone
        })  
        authApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }catch(err){
        console.log("addressToName error", err) 
    }
}   

return(
    <AuthContext.Provider 
      value={{ 
          currentUser, 
          isAuthenticated, 
          login,
          signUp,
          logout, 
          addressToName,
          updatemail,
          updatePass,
          updateRoleInBase,
          updateUserInBase,
          updateAddressInBase,
      }}>
      {children}
    </AuthContext.Provider>
  )
}