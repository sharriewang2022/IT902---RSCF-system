import json
from web3 import Web3, HTTPProvider
from config.setting import SMART_CONTRACT_ADDRESS


def getSmartContract():
    # truffle development blockchain address
    blockchain_address = 'http://127.0.0.1:7545'
    # Client instance to interact with the blockchain
    web3 = Web3(HTTPProvider(blockchain_address))
    # Set the default account (so we don't need to set the "from" for every transaction call)
    web3.eth.defaultAccount = web3.eth.accounts[0]
    print("blockchain account:" + web3.eth.defaultAccount )
    compiled_contract_path = 'contracts/IPFSHashRSCF.json'
    deployed_contract_address = SMART_CONTRACT_ADDRESS
    print("smart contract address:" + deployed_contract_address)
    with open(compiled_contract_path) as file:
        contract_json = json.load(file)  # load contract info as JSON
        contract_abi = contract_json['abi']

    contract = web3.eth.contract(address=deployed_contract_address, abi=contract_abi)

    # Get transaction hash from deployed contract
    tx_hash = contract.deploy(transaction={'from': web3.eth.defaultAccount, 'gas': 410000})

    # Get tx receipt to get contract address
    tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
    contract_address = tx_receipt['contractAddress']

    return contract 

#  add file ipfs hashcode to blockchain
def addIPFSHashcodeToBlockchain(hashcodeIPFS, filename, filePath):
    contract = getSmartContract()
    result = contract.functions.addHashCode(hashcodeIPFS, filename, filePath).call()  
    print(result)

#  get file ipfs hashcode from blockchain
def getIPFSHashcodeToBlockchain(hashcodeIPFS):
    contract = getSmartContract()
    resultMessage = contract.functions.fetchProductInfo(hashcodeIPFS).call() 
    print(resultMessage)