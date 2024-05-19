import React,{useEffect ,useState} from "react";
import {Form, Button, ToggleButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AddProductToDataBase} from "../../api/productApi";
import {ProductType, CategoryType} from "../../util/variableTypes";
import {getRandomNumber} from "../../util/stringUtil";
// import {useBlock} from "../../contexts/blockContext";
import { GoodRSCFApiCall } from "../services/hooksProduct";
import { GoodRSCF, ClientHistory } from "../services/interfaceTypes";
import { getCurrentEpoch, getCustomDateEpoch } from "../services/utilProduct";
import { getCategoryList } from "../../api/categoryApi";
import '../../../src/App.css';

function ProductView () {
  const { addSomeGoodRSCF } = GoodRSCFApiCall();
  const [productDetails, setProductDetails] = useState<GoodRSCF>({} as GoodRSCF);
  const [ errors, setErrors ] = useState([])
  const [ categories, setCategories ] = useState<CategoryType[]>([])
  // const {addProduct,productCount,updateLocation} = useBlock();

  const [formData, setFormData] = useState<ProductType>({
    productId: '',
    productName: '',
    price: 0,
    amount: 0,
    productItems: '',
    blockchainHash: '',
    category: '',
    manufacturer: '',
    supplier: '',
    specific:'',
    currentLocation:'',
    // createDate: Date
  })

  useEffect(() => {

    async function getCategoryListEffect(){
      var categoryListTemp = await getCategoryList();
      return categoryListTemp;
    }

    var categoryList = getCategoryListEffect();
    if (categoryList) {
      categoryList.then(res=>{
        setCategories(res);
      })
    }   
  }, []);

  function handleFormChange(e:React.ChangeEvent<HTMLInputElement>) {
      const key = e.target.name;
      const value = e.target.value;
      //get value from user's input
      setFormData({...formData, [key]: value})
  }

  async function handleFormSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(!formData.currentLocation){  
      formData.currentLocation = "unsure";
    }
    if(formData.productName && formData.manufacturer && formData.supplier){
      formData.productId = getRandomNumber(16)+"";
      //default user is sa
      //let clientIdPara = sessionStorage.getItem("userName") || "sa";
      const clientHistoryTemp:ClientHistory = { 
        clientId: formData.supplier,  
        date: getCurrentEpoch()
      }
      let clientHistoryArray: ClientHistory[] = [clientHistoryTemp];
      // if formData.amount is null then 1
      let batchCountPara = formData.amount || 1;
      
      const goodRESCFObject = {
        ...productDetails,
        goodRSCFName: formData.productName,
        goodRSCFId: formData.productId,
        manufacturerName: formData.manufacturer,
        manufacturer: "address",//address
        batchCount: batchCountPara,
        expDateEpoch: getCurrentEpoch(),
        manDateEpoch: getCurrentEpoch(),
        goodRSCFType: "1",
        categoryName: formData.category ||"",      
        goodRSCFHistory: {
          manufacturer: clientHistoryTemp,
          supplier: clientHistoryTemp,
          retailer:  clientHistoryTemp,
          customers: clientHistoryArray
        },
        // composition: [formData.productItems||""],
        // sideEffects: [formData.category ||""],
        composition: ["1"],
        sideEffects: ["1"],
      };

      console.log(goodRESCFObject, "add goodRSCF to blockchain");
      const result = await addSomeGoodRSCF(goodRESCFObject);
      formData.blockchainHash = goodRESCFObject.manufacturer
      console.log("test blockchain:" + result)
    }  
    const message = await AddProductToDataBase(formData); 
    if(message){
      alert(message);
    }       
  }

  function getProductsList(){
    window.open("./#/productListView", "_blank")
  }

  return (
    <div className="App-header">
    <div>
      {/*<h1>Product</h1>

       <div className="input-group flex-nowrap">
    <span className="input-group-text" id="addon-wrapping">Article Title</span>
    <input type="text" className="form-control" placeholder="Please enter the new article name..." aria-label="Username" aria-describedby="addon-wrapping"/>
    <button className="btn btn-primary" type="submit" id="article-update-button">Update</button>
    </div> */}
  
      <Form onSubmit={handleFormSubmit} id="productForm" >
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formProductName" >  
            <Form.Label className="input-group-text labelMargin">Product Name: </Form.Label>
            <Form.Control className="form-control rounded-3" name="productName" 
              type="text" placeholder="product name" required
              value={formData.productName}
              onChange={handleFormChange}
            />
            <Form.Label><span style={{color: 'red'}}>*</span></Form.Label> 
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId=" formPrice"> 
            <Form.Label className="labelMargin">Price: </Form.Label>
            <Form.Control className="form-control rounded-3" name="price" type="number" placeholder="" required
              value={formData.price}
              onChange={handleFormChange}
            />
            <Form.Label><span style={{color: 'red'}}>*</span></Form.Label> 
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formAmount"> 
            <Form.Label className="labelMargin">Amount: </Form.Label>
            <Form.Control className="form-control rounded-3" name="amount" type="number" placeholder="" required
              value={formData.amount}
              onChange={handleFormChange}
            />
            <Form.Label><span style={{color: 'red', textAlign:'center'}}>*</span></Form.Label> 
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formProductItem"> 
            <Form.Label className="labelMargin">Product Item: </Form.Label>
            <Form.Control className="form-control rounded-3" name="productItems" type="text" placeholder="" required
              value={formData.productItems}
              onChange={handleFormChange}
            />
            <Form.Label><span style={{color: 'red'}}>*</span></Form.Label>
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formCategory"> 
            <Form.Label className="labelMargin">Category: </Form.Label>
            {/* <Form.Control className="form-control rounded-3" name="category" type="select" placeholder="" required
              value={formData.category}
              onChange={handleFormChange}
            /> */}
            <Form.Control as="select"  name="category" required
                value={formData.category}
                onChange={handleFormChange}>
                <option>Select Category</option>
                {categories && categories.map(item=>
                    <option value={item.CategoryName}>{item.CategoryName}</option>
                )}
            </Form.Control>
            <Form.Label><span style={{color: 'red'}}>*</span></Form.Label>
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formManufacturer"> 
            <Form.Label className="labelMargin">Manufacturer: </Form.Label>
            <Form.Control className="form-control rounded-3" name="manufacturer" type="text" placeholder="" required
              value={formData.manufacturer}
              onChange={handleFormChange}
            />
            <Form.Label><span style={{color: 'red'}}>*</span></Form.Label>
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formSupplier"> 
            <Form.Label className="labelMargin">Supplier: </Form.Label>
            <Form.Control className="form-control rounded-3" name="supplier" type="text" placeholder="" required
              value={formData.supplier}
              onChange={handleFormChange}
            />
            <Form.Label><span style={{color: 'red'}}>*</span></Form.Label>
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formSpecific"> 
            <Form.Label className="labelMargin">Discription: </Form.Label>
            <Form.Control className="form-control rounded-3" name="specific" type="text" placeholder="" 
              value={formData.specific}
              onChange={handleFormChange}
            />
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formProductName" >  
            <Form.Label className="labelMargin">Product ID: </Form.Label>
            <Form.Control className="form-control rounded-3" name="productId" 
              type="text" placeholder="product ID" readOnly
              value={formData.productId}
              onChange={handleFormChange}
            />
        </Form.Group>
        <Form.Group className="input-group flex-nowrap mb-3" controlId="formBlockchainHash"> 
            <Form.Label className="labelMargin">Blockchain Hash: </Form.Label>
            <Form.Control className="form-control rounded-3" name="blockchainHash" type="text" 
              placeholder="" readOnly
              value={formData.blockchainHash}
              onChange={handleFormChange}              
            />
            {errors.length > 0 ? <div className="error-container">{errors.map(error => <p className="error" key={error}>{error}</p>)}</div> : <div></div>}
        </Form.Group>
        <Button className="btn btn-primary buttonMargin"  type="submit" form="productForm">
            Save
        </Button>
        <Button className="btn btn-primary" variant="primary" onClick={getProductsList}>
            Product List
        </Button>             
    </Form>
  </div>
      </div>
    );
}

export default ProductView;
