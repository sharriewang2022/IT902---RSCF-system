import axios from 'axios';
import {SERVER_BASE_URL} from '../../config/sysConfig';

const EMPLOYEE_API_BASE_URL = SERVER_BASE_URL+"/api/products";

class ProductService {

    getProducts(){
        return axios.get(EMPLOYEE_API_BASE_URL);
    }

    createProduct(products: any){
        return axios.post(EMPLOYEE_API_BASE_URL, products);
    }

    getProductById(prod_id: string){
        return axios.get(EMPLOYEE_API_BASE_URL + '/' + prod_id);
    }

    updateProduct(products: any, prod_id: string){
        return axios.put(EMPLOYEE_API_BASE_URL + '/' + prod_id, products);
    }

    deleteProduct(prod_id: string){
        return axios.delete(EMPLOYEE_API_BASE_URL + '/' + prod_id);
    }
}

export default new ProductService()