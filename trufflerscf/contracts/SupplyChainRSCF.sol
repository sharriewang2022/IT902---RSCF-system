// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

import "./ProductRSCF.sol";
import "./OrderRSCF.sol";
import "./ClientRSCF.sol";
import "./IPFSHashRSCF.sol";

/**
 * @title SupplyChainRSCF
 * @dev Implements the details of the goods in retail supply chain finance
 */
contract SupplyChainRSCF is ProductRSCF,OrderRSCF,ClientRSCF,IPFSHashRSCF {
    /**
     * @dev Create a new SupplyChain with the provided 'manufacturer'
     * @param name_ Name of the manufacturer
     * @param email_ Email of the manufacturer
     */
    constructor(string memory name_, string memory email_) {
        TypeRSCF.ClientDetails memory mn_ = TypeRSCF.ClientDetails({
            role: TypeRSCF.ClientRole.Manufacturer,
            id_: msg.sender,
            name: name_,
            email: email_
        });
        add(mn_);
    }

    /**
     * @dev List all the goods.
     * @return goodRSCFsList All the goods
     */
    function getAllGoodRSCFs() public view returns (TypeRSCF.GoodRSCF[] memory) {
        return goodRSCFs;
    }

    /**
     * @dev Gain all the goods of client
     * @return goodRSCFsList All the goods of logged-in client
     */
    function getSomeGoodRSCFs() public view returns (TypeRSCF.GoodRSCF[] memory) {
        return getClientGoodRSCFs();
    }

    /**
     * @dev Get one good by good ID
     * @param goodRSCFId_ Unique good ID 
     * @return goodRSCF_ Details of the good & it's history
     * @return history_ good lifecycle
     */
    function getSingleGoodRSCF(string memory goodRSCFId_)
        public
        view
        returns (TypeRSCF.GoodRSCF memory, TypeRSCF.GoodRSCFHistory memory)
    {
        return getSpecificGoodRSCF(goodRSCFId_);
    }

    /**
     * @dev Adds new good
     * @param goodRSCF_ unique good ID
     * @param currentTime_ Current Date, Time in epoch (when add)
     */
    function addGoodRSCF(TypeRSCF.GoodRSCF memory goodRSCF_, uint256 currentTime_)
        public
        onlyManufacturer
    {
        addAGoodRSCF(goodRSCF_, currentTime_);
    }

        /**
     * @dev Get one order by order ID
     * @param orderRSCFId_ Unique order ID 
     * @return orderRSCF_ Details of the order
     */
    function getSingleOrderRSCF(string memory orderRSCFId_)
        public
        view
        returns (TypeRSCF.OrderRSCF memory)
    {
        return getSpecificOrderRSCF(orderRSCFId_);
    }

    /**
     * @dev Adds new order
     */
    function addOrderRSCF(TypeRSCF.OrderRSCF memory orderRSCF_, uint256 currentTime_)
        public
    {
        addOrder(orderRSCF_, currentTime_);
    }

    function getAllOrderRSCF() 
        public 
        view 
        returns (TypeRSCF.OrderRSCF[] memory)         
    {
        return getAllOrder();
    }

    /**
     * @dev Adds new order
     */
    function addFileIPFSHash(IPFSHashRSCF.HashRSCF memory HashRSCF_)
        public
    {
        addFileHashCode(HashRSCF_);
    }

    function getAllFileIPFSHash() 
        public 
        view 
        returns (IPFSHashRSCF.HashRSCF[] memory)         
    {
        return getAllFileIPFSHashRSCF();
    }

    // /**
    //  * @dev Transfer the ownership
    //  * @param partyId_ buyer account address
    //  * @param goodRSCFId_ unique good ID 
    //  * @param currentTime_ Current Date Time in epoch to track 
    //  */
    // function sellGoodRSCF(
    //     address partyId_,
    //     string memory goodRSCFId_,
    //     uint256 currentTime_
    // ) public {
    //     require(isPartyExists(partyId_), "Client not found");
    //     TypeRSCF.ClientDetails memory party_ = clients[partyId_];
    //     sell(partyId_, goodRSCFId_, party_, currentTime_);
    // }
}
