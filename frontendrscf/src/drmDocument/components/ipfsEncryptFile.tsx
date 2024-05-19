import ipfsClient from 'ipfs-http-client';
import { MFSEntry } from 'ipfs-core-types/dist/src/files';
import { IPFSPath } from 'ipfs-core-types/dist/src/utils';
import { IPFS_HOST, IPFS_PORT } from '../../config/sysConfig'
import express from "express";
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// an example of IPFS front end client
const { globSource } = ipfsClient;
// const ipfsEndPoint = "http://localhost:5001"
// const ipfs = ipfsClient(ipfsEndPoint);
//  const ipfs = ipfsClient.create(ipfsEndPoint)//(https://ipfs.infura.io:5001);
// const uploadFile = await ipfs.add({ content: file });
// const ipfs = ipfsClient.create({
//     host: IPFS_HOST,
//     port: IPFS_PORT,
//     protocol: 'https',
//     apiPath: '/api/v0/',
//     // headers: {
//     //   authorization: auth
//     // }
//   })

const projectId = '';   //  Infura Project ID 
const projectSecret = '';  // Infura Secret -  never be on the real client

const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

//user infura
const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0/',
    headers: {
        authorization: auth
    }
})

generateKeys()

async function uploadFileEncrypted(file: fs.PathOrFileDescriptor, ipfspath: string) {
  try {
    const buff = fs.readFileSync(file);
    const key = crypto.randomBytes(16).toString('hex'); // 16 bytes -> 32 chars
    const iv = crypto.randomBytes(8).toString('hex');   // 8 bytes -> 16 chars
    const ekey = encryptRSA(key); // 32 chars -> 684 chars
    const ebuff = encryptAES(buff, key, iv);

    const content = Buffer.concat([ // headers: encrypted key and IV (len: 700=684+16)
      Buffer.from(ekey, 'utf8'),   // char length: 684
      Buffer.from(iv, 'utf8'),     // char length: 16
      Buffer.from(ebuff, 'utf8')
    ])
    
    await ipfs.files.write(
      ipfspath,
      content,
      {create: true, parents: true}
    );

    console.log('ENCRYPTION --------')
    console.log('key:', key, 'iv:', iv, 'ekey:', ekey.length)
    console.log('contents:', buff.length, 'encrypted:', ebuff.length)
    console.log(' ')

  } catch (err) {
    console.log(err)
    throw err;
  }
}

async function toArray(asyncIterator: AsyncIterable<MFSEntry>) { 
  const arr=[]; 
  for await(const i of asyncIterator) {
    arr.push(i); 
  }
  return arr;
}

async function downloadFileEncrypted(ipfspath: IPFSPath) {
  try {
    let file_data = await ipfs.files.read(ipfspath)
    
    let edata = []
    for await (const chunk of file_data)
      edata.push(chunk)
    edata.concat(edata)

    //const key = decryptRSA(edata.slice(0, 684).toString("utf8"))
    const key = decryptRSA(edata.slice(0, 684).toString())
    const iv = edata.slice(684, 700).toString()
    const econtent = edata.slice(700).toString()
    const ebuf = Buffer.from(econtent, 'hex')
    const content = decryptAES(ebuf, key, iv)

    console.log(' ')
    console.log('DECRYPTION --------')
    console.log('key:', key, 'iv:', iv)
    console.log('contents:', content.length, 'encrypted:', econtent.length)
    console.log('downloaded:', edata.length)
    
    return content
    
  } catch (err) {
    console.log(err)
    throw err;
  }
}

async function getUploadedFiles(ipfspath='/encrypted/') {
  let files: any[] = []
  const arr = await toArray(ipfs.files.ls(ipfspath))
  for (let file of arr) {
    if (file.type === 'directory') {
      const inner = await getUploadedFiles(ipfspath + file.name + '/')
      files = files.concat(inner)
    } else {
      files.push({
        path: ipfspath + file.name,
        size: file.size,
        cid: file.cid.toString()
      })
    }
  }
  return files
}

function encryptAES(buffer: Buffer | crypto.BinaryLike, secretKey: crypto.CipherKey, iv: crypto.BinaryLike | null) {
  const cipher = crypto.createCipheriv('aes-256-ctr', secretKey, iv);
  const data = cipher.update(buffer);
  const encrypted = Buffer.concat([data, cipher.final()]);
  return encrypted.toString('hex')
}

function decryptAES(buffer: Buffer | NodeJS.ArrayBufferView, secretKey: crypto.CipherKey, iv: crypto.BinaryLike | null) {
  const decipher = crypto.createDecipheriv('aes-256-ctr', secretKey, iv);
  const data = decipher.update(buffer)
  const decrpyted = Buffer.concat([data, decipher.final()]);
  return decrpyted;
}

function generateKeys() {
  if (fs.existsSync('private.pem') && fs.existsSync('public.pem'))
    return;
  
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: '',
    },
  })

  fs.writeFileSync('private.pem', privateKey)
  fs.writeFileSync('public.pem', publicKey)
}

//type casting -- xian shi(explicit coercion) & yin shi(implicit coercion)
function encryptRSA(toEncrypt:any, pubkeyPath='public.pem') {
  const absolutePath = path.resolve(pubkeyPath)
  const publicKey = fs.readFileSync(absolutePath, 'utf8')
  const buffer = Buffer.from(toEncrypt, 'utf8')
  const encrypted = crypto.publicEncrypt(publicKey, buffer)
  return encrypted.toString('base64')
}

function decryptRSA(toDecrypt:any, privkeyPath='private.pem') {
  const absolutePath = path.resolve(privkeyPath)
  const privateKey = fs.readFileSync(absolutePath, 'utf8')
  const buffer = Buffer.from(toDecrypt, 'base64')
  const decrypted = crypto.privateDecrypt(
  {
    key: privateKey.toString(),
    passphrase: '',
  },
  buffer,
  )
  return decrypted.toString('utf8')
}

//api for get files
const backEndRestport = 3000; 
const app = express();
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get("/api/files", async (req, res, next) => {
  try {
    res.json(await getUploadedFiles())
  } catch (e) {
    // when /encrypted/ path not exists (~ no uploads): catch ipfs http error
    res.json({error: e})
  }
});

app.get(/^\/api\/file(\/.*)$/, async (req, res, next) => {
  try {
    const ipfspath = req.params[0];
    const content = await downloadFileEncrypted(ipfspath)
    res.send(content)
  } catch (err) {
    res.send('error: ' + err)
  }
});

app.listen(backEndRestport, () => {
 console.log("Server running on port " + backEndRestport);
});


async function _testing() {
  const file = 'package.json'  // file to upload
  const ipfspath = '/encrypted/data/' + file // ipfspath
  
  // upload to ipfs path
  await uploadFileEncrypted(file, ipfspath)
  
  // download from ipfs path
  const dl = await downloadFileEncrypted(ipfspath)
  
  // to buffer
  const buff = Buffer.from(dl)

  // save buffer to file
  const outfile = ipfspath.replace(/\//g, '_');
  console.log('writing:', outfile)
  fs.writeFile(outfile, buff, function(err) {
    if (err) throw err;
  })
} 
 