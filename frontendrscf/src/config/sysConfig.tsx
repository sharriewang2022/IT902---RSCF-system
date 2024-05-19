export const config = {
    VERSION: process.env.VERSION
}; 

// export const SERVER_BASE_URL = "http://127.0.0.1:3000"
// export const SERVER_BASE_URL = "http://10.7.3.95:5000"
export const SERVER_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL||"";


export const APP_DATE_FORMAT = 'DD/MM/YY HH:mm';
export const APP_TIMESTAMP_FORMAT = 'DD/MM/YY HH:mm:ss';
export const APP_LOCAL_DATE_FORMAT = 'DD/MM/YYYY';
export const APP_LOCAL_DATETIME_FORMAT = 'YYYY-MM-DDThh:mm';
export const APP_WHOLE_NUMBER_FORMAT = '0,0';
export const APP_TWO_DIGITS_AFTER_POINT_NUMBER_FORMAT = '0,0.[00]';
 
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss"
export const DATE_FORMAT = "YYYY-MM-DD"


export const IPFS_HOST = process.env.REACT_APP_IPFS_HOST||"";
export const IPFS_PORT = 5001;

//Ganache contract address
// export const SMART_CONTRACT_ADDRESS = process.env.REACT_APP_SMART_CONTRACT_ADDRESS||"";


export const SMART_CONTRACT_ADDRESS = "0xd4291e50e418488BcF0B34fBC518FcfbF78C1064";
//Ganache account address
export const BLOCKCHAIN_ACCOUNT_ADDRESS = process.env.REACT_APP_BLOCKCHAIN_ACCOUNT_ADDRESS||"";

export const FILE_SIZE_LIMIT = 5;