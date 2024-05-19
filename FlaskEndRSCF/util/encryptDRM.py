"""Encryption and Decryption functions """

import os
import logging
import requests
from Cryptodome.Cipher import AES
from Cryptodome.Hash import SHA256
from Cryptodome import Random
import ipfshttpclient
from ipfshttpclient.exceptions import CommunicationError
from web3 import HTTPProvider, Web3, WebsocketProvider
from web3.exceptions import BadFunctionCallOutput
from web3.middleware import geth_poa_middleware
from config.setting import IPFS_HOST, IPFS_PORT, IPFS_SCHEME, INFURA_USE, INFURA_PROJECT_ID, ALCHE_KEY
from config.setting import IPFS_CONNECT_URL
# ipfsapi = ipfshttpclient.Client(f"/dns/{IPFSAPI_HOST}/tcp/{IPFSAPI_PORT}/http")
# ipfsapi = ipfshttpclient.Client('http://localhost', 9999)
#The host is form 'ipfs.infura.io' and not include 'https://'.
# ipfsapi = ipfshttpclient.Client('/ip4/127.0.0.1/tcp/48084', 9999)

logger = logging.getLogger(__name__)

class IPFSCantConnectException(Exception):
    pass

class UnsupportedNetworkException(Exception):
    pass


"""function to encrypt a file using a key"""
def encrypt(key, filename, filePath):
    #size of chunks to be encrypted
    chunksize = 64*1024
    originalFile="/".join([filePath, filename])
    encrypedFilename= f"encryped{filename}"
    outputfile="/".join([filePath, encrypedFilename])
    #make sure all sized are 16 bits
    filesize = str(os.path.getsize(originalFile)).zfill(16)
    #The Initialization vector
    IV = Random.new().read(16)
    #AES (acronym of Advanced Encryption Standard) is a symmetric encryption algorithm
    encryptor = AES.new(key, AES.MODE_CBC, IV)
    
    with open(originalFile, "rb") as infile:
        with open(outputfile, "wb") as outfile:
            outfile.write(filesize.encode('utf-8'))
            outfile.write(IV)
            
            while True:
                chunk = infile.read(chunksize)
                if len(chunk)==0:
                    break
                elif len(chunk)%16 != 0:
                    #adds padding to chunk
                    chunk += b" "*(16-(len(chunk)%16))
                    #encrypts each chunk of file
                outfile.write(encryptor.encrypt(chunk))
    return outputfile
        
def decrypt(key, filename):
    chunksize = 64*1024
    outputfile = f"2.{filename[8:]}"
    with open(filename, "rb") as infile:
        filesize = int(infile.read(16))
        IV = infile.read(16)
        
        decryptor = AES.new(key, AES.MODE_CBC, IV)
        with open(outputfile, "wb") as outfile:
                while True:
                    chunk = infile.read(chunksize)
                    if len(chunk)==0:
                        break
                    outfile.write(decryptor.decrypt(chunk)) 
                outfile.truncate(filesize)
    return outputfile
                
def getKey(password):
    hasher = SHA256.new(password.encode("utf-8"))
    return hasher.digest()

def getIpfs(host=None, port= IPFS_PORT):
    """ connect to IPFS.

    Args:
        host (str): The IPFS host to connect to.
             The host is form 'ipfs.infura.io' and not include 'https://'.
        port (int): The IPFS port to connect to.         

    Raises:
        CommunicationError: The exception is raised when error with IPFS.

    Returns:
        ipfshttpclient.client.Client: The IPFS connection client.

    """
    if host is None:
        clientConnectString = f'/dns/{IPFS_HOST}/tcp/{IPFS_PORT}/{IPFS_SCHEME}'
    else:
        # clientConnectString = f'/dns/{host}/tcp/{IPFS_PORT}/https'
        clientConnectString = IPFS_CONNECT_URL
    try:
        return ipfshttpclient.connect(clientConnectString)
    except CommunicationError as e:
        logger.exception(e)
        raise IPFSCantConnectException('Failed while attempt to connect to IPFS')
    return None


def ipfsCat(key):
    try:
        # connect to IPFS via Infura
        response, status_code = ipfsCatRequests(key)
        if status_code == 200:
            return response

        #  connect to IPFS via hosted node
        response = ipfsCatApi(key)
        if response:
            return response

        raise IPFSCantConnectException('Failed to connect cat key IPFS - Check IPFS/Infura')
    except IPFSCantConnectException as e:
        logger.exception(e)


def ipfsCatApi(key):
    ipfs = getIpfs()
    if ipfs:
        try:
            return ipfs.cat(key)
        except Exception:
            return None


def ipfsCatRequests(key):
    try:
        url = f'https://ipfs.infura.io:5001/api/v0/cat?arg={key}'
        response = requests.get(url, timeout=1)
        return response.text, response.status_code
    except:
        return None, 500


def getWeb3(network, sockets=False, chain='std'):
    """ Web3 session for the blockchain network.

    Parameters
        network (str): The network with a session.

    Raises:
        UnsupportedNetworkException:  is raised if invalid network.

    Return:
        web3.main.Web3: A web3 instance for the network.

    """
    if network in ['mainnet', 'rinkeby', 'ropsten', 'testnet']:
        if network == 'mainnet' and chain == 'polygon':
            network = 'polygon-mainnet'
        elif network == 'testnet':
            network = 'polygon-mumbai'

        if sockets and chain != 'polygon': # polygon doesn't yet have socket support in infura
            if INFURA_USE:
                provider = WebsocketProvider(f'wss://{network}.infura.io/ws/v3/{INFURA_PROJECT_ID}')
            else:
                provider = WebsocketProvider(f'wss://{network}.infura.io/ws')
        else:
            if INFURA_USE:
                provider = HTTPProvider(f'https://{network}.infura.io/v3/{INFURA_PROJECT_ID}')
            else:
                provider = HTTPProvider(f'https://{network}.infura.io')
        
        # Infura is throwing 403 errors on polygon due to current plan. Using Polygon RPC instead
        if network == 'polygon-mainnet':
            provider = HTTPProvider(f'https://polygon-mainnet.g.alchemy.com/v2/{ALCHE_KEY}')

        w3 = Web3(provider)
        if network == 'rinkeby':
            w3.middleware_stack.inject(geth_poa_middleware, layer=0)
        return w3
    elif network == 'xdai':
        if sockets:
            provider = WebsocketProvider(f'wss://rpc.xdaichain.com/wss')
        else:
            provider = HTTPProvider(f'https://dai.poa.network/')
        return Web3(provider)
    elif network == 'localhost' or 'custom network':
        return Web3(Web3.HTTPProvider("http://testrpc:8545", request_kwargs={'timeout': 60}))

    raise UnsupportedNetworkException(network)


def addEncryptedFiletoIPFS(filename, filePath):
    password = getKey("password")
    encrypted = encrypt(password, filename, filePath)
    try:
        api = getIpfs('127.0.0.1', 5001)
        #add encrypted file to IPFS
        encryp = api.add(encrypted)         
        print(api)
        print("file Ipfs hash:" + encryp['Hash']) 
        return encryp['Hash']       
    except IPFSCantConnectException as ce:
        print(str(ce))

def getDecryptedFilefromIPFS(hashCode):
    password = getKey("password")
    decrypted = decrypt(getKey("abc123"),hashCode)
    try:
        api = getIpfs('127.0.0.1', 5001)
        return api.cat(hashCode)      
    except IPFSCantConnectException as ce:
        print(str(ce))

def decode(txt_file):
    ordered = sorted((int(a), b) for a, b in map(str.split, txt_file))
    widthSameLine = 1   
    lastItemIndex = 0  
    words = []
    while last < len(ordered):
        words.append(ordered[last][1])
        width += 1
        last += width
    return  " ".join(words)

#Test encryption of image
def main():
    password = getKey("password")
    encrypted = encrypt(password, "009.jpg")
    decrypted = decrypt(getKey("abc123"),"Qma2bA7dREcfhtNcSXaFFxhgGtdrnqRaa3qKsCLhTdaY62")
    try:
        api = getIpfs('127.0.0.1', 5001)
        #add encrypted file to IPFS
        encryp = api.add(encrypted)
        original = api.add("009.jpg")
        decryp = api.add(decrypted)
        print(api)
        print(encryp['Hash'])
        print(original['Hash'])
        print(decryp['Hash'])
        txt_file ="D:\coding_qual_input.txt"
        print(decode(txt_file))
    except IPFSCantConnectException as ce:
        print(str(ce))
    #Remove files
    #os.remove(decrypted) 
    #os.remove(encrypted)

if __name__ == '__main__':
    main()