import React from 'react';
import LoginView from "../login/components/loginView";
import AdminView from "../admin/views/adminView";
import ProductView from "../product/components/productView";
import ProductListView from "../product/components/productListView";
import CategoryView from "../category/components/categoryView";
import CategoryListView from "../category/components/categoryListView";
import OrderView from "../order/components/orderView";
import OrderListView from "../order/components/orderListView";
import PrivateRoute from '../util/private'
import LazyLoad from "../util/LazyLoad"
import Dashboard from '../dashboard/Dashboard';
import UploadFileView from "../drmDocument/components/uploadFileView";
import FileListView from "../drmDocument/components/fileListView";
import TrackProductView from "../trace/components/trackProducView";
import ChatbotAppView from "../trace/chatbot/chatbotAppView";
import ProductOrderView from "../product/components/productOrderView";
import RegisterView from "../admin/views/registerView";
import {ManageView} from "../admin/views/manageView";
 


const baseRouter = [
    {path:"/", element:<LoginView/>, children:[] },
    {path:'/dashboard', element:<Dashboard/>},
    {path:"/admin/*", element:<PrivateRoute><AdminView/></PrivateRoute>, 
         children:[{
            path:'',
            element:LazyLoad('/adminView'),
        }]
    },
    {path:'/register', element:<RegisterView/>},
    {path:'/sysManage', element:<ManageView/>},
    {path:'/ChatbotAppView', element:<ChatbotAppView/>},
    {path:'/ProductOrderView', element:<ProductOrderView/>},
    {path:'/file', element:<UploadFileView/>},
    {path:'/fileListView', element:<FileListView/>},    
    {path:'/prodcut', element:<ProductView/>},   
    {path:'/productListView', element:<ProductListView/>},
    {path:'/trackProduct', element:<TrackProductView/>},
    {path:'/category', element:<CategoryView/>},
    {path:'/categoryList', element:<CategoryListView/>},    
    {path:'/order', element:<OrderView/>},
    {path:'/orderListView', element:<OrderListView/>},
];

export default baseRouter;