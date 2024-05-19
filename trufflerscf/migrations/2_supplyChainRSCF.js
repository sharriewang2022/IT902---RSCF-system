const Users = artifacts.require("./ClientRSCF.sol"); 
const Products = artifacts.require("./ProductRSCF.sol");
const Orders = artifacts.require("./OrderRSCF.sol");
const SupplyChainRSCF = artifacts.require("./SupplyChainRSCF.sol");
const IPFSHashs = artifacts.require("./IPFSHashRSCF.sol");

module.exports = async function (deployer) {

    await deployer.deploy(IPFSHashs);
   
    await deployer.deploy(Users);
    const userContract = await Users.deployed();

    await deployer.deploy(Orders);
    const orderContract = await Orders.deployed();

    await deployer.deploy(Products);
    const productsContract = await Products.deployed();
     //deploy SupplyChainRSCF, its constructor parameters is two contracts, and should deployed the two first
    await deployer.deploy(SupplyChainRSCF, userContract.address, productsContract.address);  
};