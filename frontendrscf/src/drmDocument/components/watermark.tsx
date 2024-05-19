import React, { memo, useMemo } from "react"
import { renderToString } from "react-dom/server";
import {makeStyles} from "@material-ui/core/styles";

const useStyle = makeStyles((theme)=>({
 
    WaterMaker:{      
      marginTop: "20px",
      marginleft: "100px",
      Width: 100,
      height: 100,
      top: 0,
      left: 0,
      backgroundColor: "#5cdb95",
      color: "#05386B",
      justifySelf:"center",
    }       
}))

const style = useStyle()

const Index = (props: React.PropsWithChildren<{text:string, fillColor?:string, fillOpacity?:number, fontSize?:number}>) => {

 //useMemo() hook with 2 arguments --computes a result, and the depedencies array
 const svgUrl= useMemo(() => {
   const svgRes =  (<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="300px" height="180px" viewBox="0 0 300 180">
     <text x="-160" y="-30" fill={props.fillColor ||'#333'} transform="rotate(-35 220 -220)" fill-opacity={props.fillOpacity  ||'0.1'}
       font-size={`${props.fontSize||'28'}px`}> {props.text}</text>
   </svg>)
   return URL.createObjectURL(new Blob([renderToString(svgRes)], {
     type:'image/svg+xml',
   }))
 }, [props]);
 
 return (<div className={style.WaterMaker}
   style={{ backgroundImage: `url(${svgUrl})` }}
 >
   {props.children}
 </div>)

}

export default memo(Index)
 

{/* <React.StrictMode>
<App />
<WaterMaker text='water'  />
</React.StrictMode> */}