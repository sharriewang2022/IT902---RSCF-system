import RequestHeaders from "./requestHeaders";
import { SERVER_BASE_URL } from "../config/sysConfig";

const FetchRequest = () => {
    const request = async (url: string, method: string = 'GET', body?: any) => {
        const requestParams: any = {
            headers: RequestHeaders,
            method: method,
        };
        if (!['GET'].includes(method)) {
            requestParams.body = JSON.stringify(body);
        }
        let response = await fetch(`${SERVER_BASE_URL}/${url}`, requestParams);
        return await response.json();
    }
    return request;

}
export default FetchRequest;