import React, {Component, useState} from 'react';
import ipfsClient from 'ipfs-http-client';
import { IPFS_HOST, IPFS_PORT } from '../../config/sysConfig'
import './App.css';

//react+ipfs upload & download
// https://segmentfault.com/q/1010000016618801

const ipfs = ipfsClient.create({
    host: IPFS_HOST,
    port: IPFS_PORT,
    protocol: 'http',
    apiPath: '/api/v0/',
    // headers: {
    //   authorization: auth
    // }
  })

const hash = 'QmdkpWSqP1eCMyY5epNLzqdp1M16nUYM2CkxwZPZy3vQHc';
function Utf8ArrayToStr(array: any) {
  var out,
    i,
    len,
    c;
  var char2,
    char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
        break;
      default:
        break;
    }
  }

  return out;
}

interface ipfsProps {
}

interface ipfsState {
  strHash: any,
  strContent: any,
  imgSrc: any
}

class IPFSFile extends Component <ipfsProps, ipfsState> {

  //class component can not use hook
  constructor(props: ipfsProps) {
    super(props);
    this.state = {
      strHash: null,
      strContent: null,
      imgSrc: null
    }
  }

  uploadInputRef = React.useRef<HTMLInputElement>(null);


  saveTextBlobOnIpfs = (blob:any) => {
    return new Promise(function(resolve, reject) {
      const descBuffer = Buffer.from(blob, 'utf-8');
      ipfs.add(descBuffer).then((response) => {
        console.log(response)
        // resolve(response.hash);        
        let hash = response.path;
        resolve(hash);
      }).catch((err: any) => {
        console.error(err)
        reject(err);
      })
    })
  }

  saveImageOnIpfs = (reader: FileReader) => {
    return new Promise(async function(resolve, reject) {      
      // ipfs.add(buffer).then((response) => {
      //   console.log(response)
      //   resolve(response[0].hash);
      // }      
      // ).catch((err: any) => {
      //   console.error(err)
      //   reject(err);
      // })
      try {
        // const buffer = Buffer.from(reader.result);
        if(reader.result != undefined && typeof reader.result != "string" ){
          var uint8Array = new Uint8Array(reader.result);
          const buffer = Buffer.from(uint8Array);
          let results = await ipfs.add(buffer);
          let hash = results.path;
          resolve(hash);
        }          
      } catch (err) {
          console.error(err);
          reject(err);
      }
    })
  }

  render() {
    return (<div>
      <input type="file" ref={this.uploadInputRef} id="fileId" name="fileName" />
      <br/>
      <input ref="ipfsContent"/>
      <button onClick={() => {
        const files = this.uploadInputRef.current?.files;
        if (files) {
            var reader = new FileReader();
            // reader.readAsDataURL(file);
            reader.readAsArrayBuffer(files[0])
            reader.onloadend = (e) => {
                console.log(reader);
                // upload file to IPFS
                this.saveImageOnIpfs(reader).then((hash) => {
                console.log(hash);
                this.setState({
                    imgSrc: hash,
                    strHash: hash
                })
                });
            }
        }
          // let ipfsContent = this.refs.ipfsContent.value;
          // console.log(ipfsContent);
          // this.saveTextBlobOnIpfs(ipfsContent).then((hash) => {
          //   console.log(hash);
          //   this.setState({strHash: hash});
          // });
        }}>Upload to IPFS</button>
      <p>http://ipfs.io/ipfs/{this.state.strHash}</p>
      <button onClick={() => {
          console.log('Read file from ipfs')
          let hash = this.state.strHash;

          //get a file addressed by a valid IPFS Path.
          const stream =  ipfs.cat(hash)
          console.log(stream);
          let strContent = Utf8ArrayToStr(stream);
          console.log(strContent);
          this.setState({strContent: strContent});

          // ipfs.cat(hash).then((stream:any) => {
          //   console.log(stream);
          //   let strContent = Utf8ArrayToStr(stream);
          //   console.log(strContent);
          //   this.setState({strContent: strContent});
          // });
        }}>Read File</button>
      <h1>{"https://ipfs.io/ipfs/" + this.state.imgSrc}</h1>
      <img alt="blockchain blog"  src={"http://127.0.0.1:8080/ipfs/" + this.state.imgSrc}/>
      </div>);
  }
}

export default IPFSFile;