import React,{useEffect ,useState} from "react";
import {useLocation, useParams, useNavigate } from "react-router-dom";
import SupplyChainRSCF from '../../abis/SupplyChainRSCF.json';
import {ethers} from "ethers";
import {makeStyles} from "@material-ui/core/styles";
import {useAuth} from "../../contexts/authContext";
import {useBlock} from "../../contexts/blockContext";
import { SMART_CONTRACT_ADDRESS,BLOCKCHAIN_ACCOUNT_ADDRESS } from '../../config/sysConfig';
import { TransitionProps } from '@material-ui/core/transitions';
import { GoodRSCFApiCall } from "../../product/services/hooksProduct";
import { ClientDetails, ClientHistory } from "../../product/services/interfaceTypes";
import { epochToDate } from "../../product/services/utilProduct";
import {
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Snackbar,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Hidden,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props:any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    input: {
        color:" #05386B !important",
        FontWeight:"400",
        fontSize: "20px",
        marginTop:"0px",
        marginBottom:"0px"
    },

    notchedOutline:{
        borderWidth: "2px",
        borderColor: "#C0D9D9 !important",
        color:"#87CEFA !important"
    },

    button: {
        marginLeft: "10px",
        backgroundColor: "#C0D9D9",
        color: "#05386B",
        textTransform: "none",  //not change to capital
        "&:hover" :{
            backgroundColor:"#87CEFA",
        }
    },

    divide: {
        background: "#EDF5E1 !important",
        height:"70px",
    }        
}))

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children?: React.ReactElement;
    },
    ref: React.Ref<unknown>
    ) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function FetchLocation(props: any){
    const style = useStyles()      

    const handleClose = () => {
       props.setOpen(false);
   };

    function LocDisp(props:any){
        return(
            <Grid item xs = {12}>
                <Grid container justifyContent = "center">
                    {props.index !== 1 ?<Divider orientation ="vertical" className = {style.divide}/>:null}
                </Grid>
                <Grid container justifyContent = "center">
                <Typography variant = "h6" style = {{
                    color:"#EDF5E1",
                    fontSize:"18px",
                    fontWeight:"350"
                }}>{props.location}</Typography>
                </Grid>
            </Grid>
        )
    }
    return(
    <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
            style: {
                backgroundColor: '#05386B',
            }
        }}
    >
    <DialogTitle id="alert-dialog-slide-title" style = {{
         color: '#87CEFA',
       }}
    >{"All Locationst:"}</DialogTitle>
    <DialogContent>
       <Grid container>
       {/* {props.locations.map((value: string, index: any) => {
           if(value === '' ){
               return
           }else{
             return <LocDisp location ={value} key = {index} index = {index}/>
        }
        })} */}
       </Grid>
    </DialogContent>
    <DialogActions >
      <Button onClick={handleClose} size = "small" style = {{
         backgroundColor: "#87CEFA",
         color: "#05386B",         
     }}> 
       Close
     </Button>
   </DialogActions>
 </Dialog>)
}

function TrackProductView(){
    const [id,setId] = useState("");
    // const {trackProduct, fetchOwner, fetchLocations} = useBlock();
    const [name,setName] = useState("");
    const [manufactureName,setManufactureName] = useState("");
    const [manufacturer,setManufacturer] = useState("");
    const [cLocation,setCLocation] = useState("");
    const [productDate,setProductDate] = useState("");
    const [owner,setOwner] = useState("");
    const [blockHash,setBlockHash] = useState("");
    const [transactionHash,setTransactionHash] = useState("");
    const [blockNumber,setBlockNumber] = useState("");
    const [err,setErr] = useState("");
    const [openErr,setOpenErr] = useState(false);
    const [locations,setLocations] = useState(["Enter Product ID first"]);

    const { productid } = useParams();
    const navigateOpenWin = useNavigate();
    const {
        getGoodRSCFDetails,
        goodRSCFData,
        goodRSCFDetailsLoading,
        getIndividualDetails,
        getClientList,
        getGoodRSCFs,
        getSomeGoodRSCFs,
      } = GoodRSCFApiCall();
    const [productHistory, setProductHistory] = useState<any>();

    useEffect(() => {
        if (productid) {
            getGoodRSCFDetails(productid);
        }
    }, [productid]);

    function isEmpty(object: object) {
        for (const property in object) {
            return true;
        }
        return false;
    }
    
    function checkAddress(id: string) {
        return "0x0000000000000000000000000000000000000000" === id;
    }
    
    const customerParse = async (customerarr: ClientHistory[]) => {
        const newObj = await Promise.all(customerarr.map(async (arr: ClientHistory) => {
          const userData = await getIndividualDetails(arr.clientId.toString());
          return {
            id_: arr.clientId,
            date: arr.date,
            type: "customer",
            id: userData?.id_,
            name: userData?.name,
          };
        }));
        console.log(newObj, "customer");
        return newObj;
    };
    
    useEffect(() => {
        (async () => {
          const newHistoryArray = [];
          if (goodRSCFData?.goodRSCFHistory) {
            console.log(goodRSCFData?.goodRSCFHistory, "goodRSCFData?.goodRSCFHistory");
            for (const property in goodRSCFData?.goodRSCFHistory) {
              if (
                property === "manufacturer" &&
                isEmpty(goodRSCFData.goodRSCFHistory.manufacturer)
              ) {
                getClientList();
                const userData = await getIndividualDetails(
                    goodRSCFData.goodRSCFHistory.manufacturer.clientId.toString()
                );
                console.log(userData, "manufacturer");
                if (userData) {
                  const details = {
                    ...goodRSCFData.goodRSCFHistory.manufacturer,
                    type: "manufacturer",
                    email: userData?.email,
                    id: userData?.id_,
                    name: userData?.name,
                  };
                  newHistoryArray.push(details);
                }
              } else if (
                property === "customers" &&
                isEmpty(goodRSCFData.goodRSCFHistory.customers)
              ) {
                const result = await customerParse(
                    goodRSCFData.goodRSCFHistory.customers
                );
                newHistoryArray.push(...result);
              } else if (
                property === "supplier" &&
                isEmpty(goodRSCFData.goodRSCFHistory.supplier) &&
                !checkAddress(goodRSCFData.goodRSCFHistory.supplier.clientId.toString())
              ) {
                const userData = await getIndividualDetails(
                    goodRSCFData.goodRSCFHistory.supplier.clientId.toString()
                );
                console.log(userData, "supplier");
                if (userData) {
                  const details = {
                    ...goodRSCFData.goodRSCFHistory.supplier,
                    type: "supplier",
                    email: userData?.email,
                    id: userData?.id_,
                    name: userData?.name,
                  };
                  newHistoryArray.push(details);
                }
              } else if (
                property === "retailer" &&
                isEmpty(goodRSCFData.goodRSCFHistory.retailer) &&
                !checkAddress(goodRSCFData.goodRSCFHistory.retailer.clientId.toString())
              ) {
                const clientData = await getIndividualDetails(
                    goodRSCFData.goodRSCFHistory.retailer.clientId.toString()
                );
                console.log(clientData, "retailer");
                if (clientData) {
                  const details = {
                    ...goodRSCFData.goodRSCFHistory.retailer,
                    type: "retailer",
                    email: clientData?.email,
                    id: clientData?.id_,
                    name: clientData?.name,
                  };
                  newHistoryArray.push(details);
                }
              }
            }
          }
          console.log(newHistoryArray);
          setProductHistory(newHistoryArray);
        })();
    }, [goodRSCFData]);
  
    async function handleFetchInfo(id: string){
        try {
            if(!id || id ==="Search Product ID"){
                window.alert("Need Product ID")
                throw("Need Product ID")
            }
            // const temp = getProductDetails(id)
            const someGoodRSCFs = await getSomeGoodRSCFs() 
            // console.log("aaaaaaaaa"+temp);
            const selGoodInfo = await getGoodRSCFDetails(id) 
            console.log("Searched good details:" + selGoodInfo);                           
            if(selGoodInfo){
                setOwner("")
                setName(selGoodInfo?.goodRSCFName)
                setManufactureName(selGoodInfo?.manufacturerName)
                setManufacturer(selGoodInfo.manufacturer||"")
                 
                let manDate = epochToDate(selGoodInfo.manDateEpoch)
                console.log("Manufacture Date:" + manDate);
                setProductDate(manDate)
                // setProductDate(epochToDate(Number(selGoodInfo.expDateEpoch.toString())))
                // setBlockHash(traceProductData.blockHash)
                // setTransactionHash(traceProductData.transactionHash)
                // setBlockNumber(traceProductData.blockNumber)
                // setBlockNumber(traceProductData.blockContext)
                // setSCAddressFrom(traceProductData.from)
            } else {
                throw("There is no such product ID.")
            }
        }
        catch(error){
            console.log(error);
            setOpenErr(true)
        }
    }

    const handleClose = (event: React.MouseEvent, reason:string) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenErr(false)
    };

    async function chatbotStart(id: string){
        window.open("./#/chatbotAppView", "_blank")  
    }

    async function getProductOrders(id: string){
        // window.open("./#/productOrderView", "_blank")  
        // parameter "productId" tranfered to new page "productOrderView"
        // navigateOpenWin('/productOrderView?productId='+id);  
        const url = "/productOrderView"; 
        const params = { productId: id}; 
        const query = new URLSearchParams(params).toString();
        const newTab = window.open(`./#${url}?${query}`, "_blank"); // new tab
        if(newTab){
            newTab.focus(); // focus on new tab
        }
        //navigateOpenWin(url); // trigger base router       
    }  

    const style = useStyles();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    return(
        <div style = {{
            position:"absolute",
            top:"10",
            left:"0",
            bottom:"0",
            right:"0",
            height:"100%",
            width:"100%",
          }}>
        {openErr &&<Snackbar open={openErr} autoHideDuration={6000} onClose={()=>handleClose}>
        <Alert onClose={handleClose} severity="error">
            {err}
        </Alert>
        </Snackbar>}

        <Container style = {{ marginTop: "50px",  marginLeft: "100px"}}>
        <div>
        <TextField
            id = "productID"
            name = "productID"
            type = "text"
            placeholder="Searched Product ID"
            variant= "outlined"
            size = "small"
            
            style = {{
                width:"600px",                
                border: "0px solid #05386B",
                color:"#EDF5E1"
            }}

            InputProps={{
                classes : {
                    notchedOutline:style.notchedOutline,
                    input:style.input
                },
                inputProps: { min: 0}
            }} 
            
            onChange = {(e) => setId(e.target.value)}
        />

        <Button className = {style.button} style = {{
            fontSize:"15px",
            color: "#05386B",
            transform:"translateY(30%)",
            cursor: "pointer"
            }} onClick = {() => {handleFetchInfo(id)}}>Search
        </Button>

        <Button className = {style.button} style = {{
            fontSize:"15px",
            color: "#05386B",
            transform:"translateY(30%)",
            cursor: "pointer"
            }} onClick = {() => {chatbotStart(id)}}>Chatbot
        </Button>

        <Button className = {style.button} style = {{
            fontSize:"15px",
            color: "#05386B",
            transform:"translateY(30%)",
            cursor: "pointer"
            }} onClick = {() => {getProductOrders(id)}}>Related Orders
        </Button>
    </div>

    <Grid item xs = {8}>
        <Grid container justifyContent = "center" alignItems = "center">
        <Box style = {{
            background:"#05386B",
            marginTop:"50px",
            justifySelf:"center",
            width: "700px",
            padding:"10px",
            color:"#EDF5E1",
            borderRadius: "4px",
            boxShadow: "0px 0px 12px 2px rgba(15, 15, 15, 0.2)"        
        }}>
        <Grid container spacing = {4}>
            <Grid item xs = {12}>
                <Grid container spacing  = {1}  justifyContent = "center" >
                    <Grid item xs = {3}><h5 style = {{fontWeight:"350"}} className = "labelText">Product Name:</h5></Grid>
                    <Grid item xs = {6}><h5 style = {{fontSize:"30px",fontWeight:"350"}}>{name}</h5></Grid>
                </Grid>
            </Grid>

            <Grid item xs = {12}>
                <Grid container spacing  = {1} >
                    <Grid item xs = {3}><h5 style = {{fontWeight:"250"}}className = "labelText">Manufacture Blockchain Address:</h5></Grid>
                    <Grid item xs = {6}><h5 style = {{fontWeight:"350"}}>{manufacturer}</h5></Grid>
                </Grid>
            </Grid>

            <Grid item xs = {12}>
                <Grid container spacing  = {1} >
                    <Grid item xs = {3}><h5 style = {{fontWeight:"250"}}className = "labelText">Manufacture Name:</h5></Grid>
                    <Grid item xs = {6}><h5 style = {{fontWeight:"350"}}>{manufactureName}</h5></Grid>
                </Grid>
            </Grid>

            <Grid item xs = {12}>
                <Grid container spacing  = {1}>
                    <Grid item xs = {3}><h5 style = {{fontWeight:"250"}}  className = "labelText">Registered on:</h5></Grid>
                    <Grid item xs = {6}><h5 style = {{fontWeight:"350"}}>{productDate}</h5></Grid>
                </Grid>
            </Grid>

            <Grid item xs = {12} style = {{visibility:"hidden"}}>
                <Grid container spacing  = {1}>
                    <Grid item xs = {3}><h5 style = {{fontWeight:"350"}}  className = "labelText">Current Location:</h5></Grid>
                    <Grid item xs = {6}><h6 style = {{fontSize:"10px",fontWeight:"350"}}>{cLocation}</h6></Grid>
                </Grid>
            </Grid>

            <Grid item xs = {12} style = {{visibility:"hidden"}}>
                <Grid container spacing  = {1}>
                    <Grid item xs = {3}><h5 style = {{fontWeight:"350"}}  className = "labelText">Current blockHash:</h5></Grid>
                    <Grid item xs = {6}><h6 style = {{fontSize:"10px", fontWeight:"350"}}>{blockHash}</h6></Grid>
                </Grid>
            </Grid>

            <Grid item xs = {12} style = {{visibility:"hidden"}}>
                <Grid container spacing  = {1}>
                    <Grid item xs = {3}><h5 style = {{fontWeight:"350"}}  className = "labelText">Block Number:</h5></Grid>
                    <Grid item xs = {6}><h6 style = {{fontSize:"10px", fontWeight:"350"}}>{blockNumber}</h6></Grid>
                </Grid>
            </Grid>

            <Grid item xs = {12}>
            <Grid container justifyContent = "center">
            <h6 style = {{cursor: "pointer", visibility:"hidden"}} onClick ={handleClickOpen}>Search more locations</h6>
            </Grid>
            </Grid>
        </Grid>
        
        <FetchLocation  open = {open} setOpen = {setOpen} locations = {locations}/>
    </Box>
    </Grid>
    </Grid>
    
    </Container>

    </div>
    
    )
}

export default TrackProductView;