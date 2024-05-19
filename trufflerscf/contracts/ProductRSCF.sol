// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

import "./TypeRSCF.sol";

/**
 * @title GoodRSCF
 * @author Wang
 * @dev track goods
 */
contract ProductRSCF {
    TypeRSCF.GoodRSCF[] internal goodRSCFs;
    mapping(string => TypeRSCF.GoodRSCF) internal goodRSCF;
    mapping(address => string[]) internal clientLinkedGoodRSCFs;
    mapping(string => TypeRSCF.GoodRSCFHistory) internal goodRSCFHistory;

    // Events
    event NewGoodRSCF(
        string goodRSCFName,
        string manufacturerName,
        address manufacturer,
        string categoryName,
        string goodRSCFId,
        uint256 manDateEpoch,
        uint256 expDateEpoch
    );

    event GoodRSCFOwnershipTransfer(
        string goodRSCFName,
        string manufacturerName,
        string categoryName,
        string goodRSCFId,
        string buyerName,
        string buyerEmail
    );

    // Smart Contract Methods
    /**
     * @dev  Get all the goods of some client
     * @return  All the goods of logged-in client
     */
    function getClientGoodRSCFs() internal view returns (TypeRSCF.GoodRSCF[] memory) {
        string[] memory ids_ = clientLinkedGoodRSCFs[msg.sender];
        TypeRSCF.GoodRSCF[] memory goodRSCFs_ = new TypeRSCF.GoodRSCF[](ids_.length);
        for (uint256 i = 0; i < ids_.length; i++) {
            goodRSCFs_[i] = goodRSCF[ids_[i]];
        }
        return goodRSCFs_;
    }

    /**
     * @dev Get one good
     * @param goodRSCFId_ Unique good ID 
     * @return goodRSCF_ Details of the good
     * @return history_ good history
     */
    function getSpecificGoodRSCF(string memory goodRSCFId_)
        internal
        view
        returns (TypeRSCF.GoodRSCF memory, TypeRSCF.GoodRSCFHistory memory)
    {
        return (goodRSCF[goodRSCFId_], goodRSCFHistory[goodRSCFId_]);
    }

    /**
     * @dev Adds new good
     * @param goodRSCF_ unique good ID  
     * @param currentTime_ Current Date, Time in epoch (when added)
     */
    function addAGoodRSCF(TypeRSCF.GoodRSCF memory goodRSCF_, uint256 currentTime_)
        internal
        goodRSCFNotExists(goodRSCF_.goodRSCFId)
    {
        require(
            goodRSCF_.manufacturer == msg.sender,
            "Only manufacturer can add"
        );
        goodRSCFs.push(goodRSCF_);
        goodRSCF[goodRSCF_.goodRSCFId] = goodRSCF_;
        goodRSCFHistory[goodRSCF_.goodRSCFId].manufacturer = TypeRSCF.ClientHistory({
            clientId: msg.sender,
            date: currentTime_
        });
        clientLinkedGoodRSCFs[msg.sender].push(goodRSCF_.goodRSCFId);
        emit NewGoodRSCF(
            goodRSCF_.goodRSCFName,
            goodRSCF_.manufacturerName,
            goodRSCF_.manufacturer,
            goodRSCF_.categoryName,
            goodRSCF_.goodRSCFId,
            goodRSCF_.manDateEpoch,
            goodRSCF_.expDateEpoch
        );
    }

    /**
     * @dev Transfer the ownership
     * @param partyId_ Buyer account address
     * @param goodRSCFId_ unique good ID 
     * @param currentTime_ Current Date Time in epoch to  track 
     */
    function sell(
        address partyId_,
        string memory goodRSCFId_,
        TypeRSCF.ClientDetails memory party_,
        uint256 currentTime_
    ) internal goodRSCFExists(goodRSCFId_) {
        TypeRSCF.GoodRSCF memory goodRSCF_ = goodRSCF[goodRSCFId_];

        // Update good history
        TypeRSCF.ClientHistory memory clientHistory_ = TypeRSCF.ClientHistory({
            clientId: party_.id_,
            date: currentTime_
        });
        if (TypeRSCF.ClientRole(party_.role) == TypeRSCF.ClientRole.Supplier) {
            goodRSCFHistory[goodRSCFId_].supplier = clientHistory_;
        } else if (TypeRSCF.ClientRole(party_.role) == TypeRSCF.ClientRole.Retailer) {
            goodRSCFHistory[goodRSCFId_].retailer = clientHistory_;
        } else if (TypeRSCF.ClientRole(party_.role) == TypeRSCF.ClientRole.Customer) {
            goodRSCFHistory[goodRSCFId_].customers.push(clientHistory_);
        } else {
            revert("Not valid operation");
        }
        // Transfer ownership from seller to buyer
        transferOwnership(msg.sender, partyId_, goodRSCFId_); 
        // trig event
        emit GoodRSCFOwnershipTransfer(
            goodRSCF_.goodRSCFName,
            goodRSCF_.manufacturerName,
            goodRSCF_.categoryName,
            goodRSCF_.goodRSCFId,
            party_.name,
            party_.email
        );
    }


    /**
     * @notice To check if good exists
     * @param id_ good ID
     */
    modifier goodRSCFExists(string memory id_) {
        require(!compareStrings(goodRSCF[id_].goodRSCFId, ""));
        _;
    }

    /**
     * @notice To check if good  does not exists
     * @param id_ good ID
     */
    modifier goodRSCFNotExists(string memory id_) {
        require(compareStrings(goodRSCF[id_].goodRSCFId, ""));
        _;
    }

    // Internal functions
    /**
     * @dev To remove the good from list once sold
     * @param sellerId_ Seller's metamask address
     * @param buyerId_ Buyer's metamask address
     * @param goodRSCFId_ unique good ID
     */
    function transferOwnership(
        address sellerId_,
        address buyerId_,
        string memory goodRSCFId_
    ) internal {
        clientLinkedGoodRSCFs[buyerId_].push(goodRSCFId_);
        string[] memory sellerGoodRSCFs_ = clientLinkedGoodRSCFs[sellerId_];
        uint256 matchIndex_ = (sellerGoodRSCFs_.length + 1);
        for (uint256 i = 0; i < sellerGoodRSCFs_.length; i++) {
            if (compareStrings(sellerGoodRSCFs_[i], goodRSCFId_)) {
                matchIndex_ = i;
                break;
            }
        }
        assert(matchIndex_ < sellerGoodRSCFs_.length);
        if (sellerGoodRSCFs_.length == 1) {
            delete clientLinkedGoodRSCFs[sellerId_];
        } else {
            clientLinkedGoodRSCFs[sellerId_][matchIndex_] = clientLinkedGoodRSCFs[
                sellerId_
            ][sellerGoodRSCFs_.length - 1];
            delete clientLinkedGoodRSCFs[sellerId_][sellerGoodRSCFs_.length - 1];
            clientLinkedGoodRSCFs[sellerId_].pop();
        }
    }

    /**
     * @notice Internal function comparing the strings, not alter stage or read any data. Little gas fee
     * @param a1 string1 compared
     * @param a2 string2 compared
     */
    function compareStrings(string memory a1, string memory a2)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a1))) ==
            keccak256(abi.encodePacked((a2))));
    }
}
