import request from "../util/request";
import { AxiosResponse } from 'axios';
import { CategoryType } from "../util/variableTypes";
 
interface resultCategoryType{
  code: number
  msg?: string
  categoryInfo: CategoryType[]
}

/* get all category list */
// export const getCategoryList = () => request.get("/category/allCategorys")
export const getCategoryList = async ()  => {
  sessionStorage.setItem("categoryName", "");
  let resultData : CategoryType[] = [];
  let res = await request.get("/category/allCategory")

  if(res.data !== undefined ){
    if(res.data.code===200){    
      resultData = res.data.categoryInfo; 
    }
  }else{
    console.log( "The category could not be searched");
  }
    return resultData;
}

export async function AddCategoryToDataBase(categoryParam: CategoryType){
  sessionStorage.setItem("categoryName", "");
  var resultMessage = "";
  await request.post("/category/addCategory",categoryParam).then((res:AxiosResponse<resultCategoryType>)=>{
    if(res.data !== undefined ){
      if(res.data.code===200){     
        // save category Name to local storage
        sessionStorage.setItem("categoryName", categoryParam.CategoryName + "");
        resultMessage = "Category name: " + categoryParam.CategoryName +" is added successfully!";       
      }else{        
        resultMessage = res.data.msg + "";
        console.log(resultMessage);
      }         
    }else{
      resultMessage = "The category could not be added";
      console.log(resultMessage);
    }
  }) 
  return resultMessage;
}