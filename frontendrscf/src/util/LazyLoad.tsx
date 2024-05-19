import { Space, Spin } from 'antd'
import React, { lazy, Suspense } from "react";


function LazyLoad(url: string) {
    var message = "";
    const Module = lazy(() => {
        return new Promise((resolve, reject) => {
            import('../admin/views' + url)
            // import(url) -- can not use variable               
                .then(res => resolve(res))  // success
                .catch(err => {
                    //import above url component fail
                    resolve(import("./views/" + "ErrorPage"))
                    console.log(err)
                    message = JSON.parse(err);
                    console.log(message)
                })
        })
    })
    console.log("Module", Module)
    //  put to Suspense 
    // here could not divide into two lines
    return <Suspense
        fallback={<Space size='large'  style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center',display:'flex'}}>    
        <Spin size="large"  tip="loading..." />
        </Space>}>   
        <Module/>
    </Suspense>
}

export default LazyLoad;