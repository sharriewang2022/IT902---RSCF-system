import { message } from "antd";
import { SERVER_BASE_URL } from "../config/sysConfig";
import axios from "axios";

// npm i --save-dev @types/nprogress
import NProgress from "nprogress";
// import "../styles/nprogress.css"; 
import 'nprogress/nprogress.css'
// import Nprogress from 'nprogress/nprogress.js';

NProgress.settings.showSpinner = false;

const request = axios.create({
  baseURL: SERVER_BASE_URL,
  timeout: 50000,
});

request.interceptors.request.use((config) => {
  let token = sessionStorage.getItem("token");
  NProgress.start();
  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

request.interceptors.response.use(
  (res) => {
    NProgress.done();
    if(res.status!==200){
      // fail
      if (res.status === 401) {
        // no permission
        message.info("no permission");
      } else if (res.status === 500 || res.status === 505) {
        message.info("server error");
      } else if (res.status === 404) {
        message.info("404 no server url");
      } else {
        message.info("request error");
      }
    }
    return res;
    
  },
  (err) => {
    NProgress.done();
    // message.info("request error");
    console.error(err);
    return err;
  }
);

function requestTest(){
  const product ="";
  const headers = {
    "x-access-token": sessionStorage.getItem("jwtToken"),
  };

  axios
    .post("http://localhost:3000/product/getSomeProduct", product, { headers: headers })
    .then((res) => console.log(res));
}

export default  request;