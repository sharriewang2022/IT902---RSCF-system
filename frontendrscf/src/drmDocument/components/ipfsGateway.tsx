// IPFS Gateway Connector.ts "https://gist.github.com/aignermax/c495c98003da974d17b9c4c481ac23be.js"> 
import ipfsClient from 'ipfs-http-client';

export const IPFSGateways ={ 
  InfuraGateway: "https://ipfs.io/ipfs/",
  YourDedicatedGateway :"https://ipfs.io/ipfs/" 
}; // if you have your own gateway, you can use it here
const projectId = '';   // <---------- your Infura Project ID - You should never have your keys in the frontend, 
// so you might have to find a way to deliver those keys from some kind of backend.
const projectSecret = '';  // Infura Secret - should never be on the real client

const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')


//from infura
//https://www.infura.io/ 
const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  apiPath: '/api/v0/',
  headers: {
    authorization: auth
  }
})

export interface IpfsData{
  Name :string,
  Hash : string,
}
export interface IpfsError {
  Message : string,
  Code : number,
  Type : string, // this just states "error"
}
export type IpfsDataOrError = IpfsData |IpfsError;
export function ReplacePublicGatewayWithYourGateway(jsonOrUrl : string) : string{
  return jsonOrUrl.replaceAll(IPFSGateways.InfuraGateway , IPFSGateways.YourDedicatedGateway);
}
export async function downloadFromIPFS<T>(ipfsUri : string) : Promise<T>
{
  ipfsUri = ReplacePublicGatewayWithYourGateway(ipfsUri);
  const res = await fetch(ipfsUri)
  let receivedObject :T;
  let text;
  try {
    text = await res.text();
    let textButWithYourGateway = ReplacePublicGatewayWithYourGateway(text);
    receivedObject = JSON.parse(textButWithYourGateway) as T;
  } catch(err){
    throw new Error("could not parse json, got text instead: " + JSON.stringify(err) + " parsed text:" + text + "  ");
  }
  return receivedObject;
}

export async function uploadToIPFS(data :string | Blob |File ) : Promise<string>{
  const result = await callIpfsCommand("add" , data);
  let url = IPFSGateways.YourDedicatedGateway + result.Hash;
  return url;
}

function isIpfsData( toBeDetermined : IpfsDataOrError) : toBeDetermined is IpfsData{
  if ( (toBeDetermined as IpfsData).Hash ){
    return true;
  }
  return false;
}
async function callIpfsCommand( args :string , data : string | Blob |File) : Promise<IpfsData>{
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  const formData = new FormData();
  if((data as File).name){
    // formData.append("file" , data , (data as File).name);
    formData.append("file", (data as File).name);
  } else {
    formData.append("file", data );
  }
  
  const options = {
    method: 'POST',
    headers:{
      Accept: "application/json",
      Authorization :auth,
    },
    mode: "cors",
    body: formData,
  } as RequestInit ;

  let res = await fetch("https://ipfs.infura.io:5001/api/v0/" + args, options);
  let text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err){
    console.error(err);
  }
  
  if(isIpfsData(json)){
    return json;
  }else if( (json as IpfsError).Message){
    throw new Error (json.Message);
  } else {
    throw new Error("error parsing result " + text);
  }
} 