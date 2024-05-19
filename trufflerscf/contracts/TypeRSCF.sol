// SPDX-License-Identifier: GPL-3.0
pragma experimental ABIEncoderV2;
pragma solidity >=0.4.25 <0.9.0;

/**
 * @title Types
 * @author Wang
 * @dev All the types used in Supply Chain Blockchain
 */
library TypeRSCF {
    enum ClientRole {
        Administrator,
        Manufacturer,
        Supplier,
        Retailer,
        Customer
	}

    enum GoodRSCFType {
        Furniture, // --0
        Toy, // --1
        Jewelry, // --2
        Food, // --3
        Clothes // --4
    }

    struct GoodRSCFHistory {
        ClientHistory manufacturer;
        ClientHistory supplier;
        ClientHistory retailer;
        ClientHistory[] customers;
    }

    struct GoodRSCF {
        string goodRSCFName;
        string goodRSCFId;
        string manufacturerName;
        address manufacturer;
        uint256 manDateEpoch;
        uint256 expDateEpoch;
        uint256 batchCount; // amount in each batch
        GoodRSCFType goodRSCFType;
        string categoryName;
        string[] composition;
        string[] sideEffects;
    }

    enum OrderStatus { Purchased, Generated, Transferred, Completed }

    struct OrderRSCF {
        string orderId;
        address customerName;
        string productId;
        string productName;
        uint256 quantity;
        uint256 price;
        OrderStatus orderStatus;
    }

    struct ClientDetails {
        ClientRole role;
        address id_;
        string name;
        string email;
    }

    struct ClientHistory {
        address clientId; // client Id 
        uint256 date; // Added or bought date in epoch
    }
}
