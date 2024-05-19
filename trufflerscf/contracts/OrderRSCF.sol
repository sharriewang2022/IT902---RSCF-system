// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./TypeRSCF.sol";

contract OrderRSCF {

    TypeRSCF.OrderRSCF[] internal orderRSCFs;
    mapping (string => TypeRSCF.OrderRSCF) public orders;

    event OrderPurchased(string orderId, address customerName, string productId, string productName, uint256 quantity, uint256 price);
    event OrderGenerated(string orderId);
    event OrderTransferred(string orderId);
    event OrderCompleted(string orderId);


    /**
     * @dev Adds new order
     * @param orderRSCF_ unique order ID  
     * @param currentTime_ Current Date, Time in epoch (when added)
     */
    function addOrder(TypeRSCF.OrderRSCF memory orderRSCF_, uint256 currentTime_) public {
        orderRSCF_.customerName = msg.sender;
        orderRSCF_.orderStatus = TypeRSCF.OrderStatus.Purchased;
        orders[orderRSCF_.orderId] = orderRSCF_;
        orderRSCFs.push(orderRSCF_);
        emit OrderPurchased(
            orderRSCF_.orderId,
            orderRSCF_.customerName, 
            orderRSCF_.productId,            
            orderRSCF_.productName, 
            orderRSCF_.quantity, 
            orderRSCF_.price
        );
    }

    function generateOrder(string memory orderId) public {
        TypeRSCF.OrderRSCF memory order = orders[orderId];
        require(order.customerName == msg.sender, "Only customer can generate order");
        require(order.orderStatus == TypeRSCF.OrderStatus.Purchased, "Order must be in Purchased status");
        order.orderStatus = TypeRSCF.OrderStatus.Generated;
        emit OrderGenerated(orderId);
    }

    function transferOrder(string memory orderId) public {
        TypeRSCF.OrderRSCF storage order = orders[orderId];
        require(order.customerName == msg.sender, "Only customerName can distribute order");
        require(order.orderStatus == TypeRSCF.OrderStatus.Generated, "Order must be in Generated status");
        order.orderStatus = TypeRSCF.OrderStatus.Transferred;
        emit OrderTransferred(orderId);
    }

    function completeOrder(string memory orderId) public {
        TypeRSCF.OrderRSCF storage order = orders[orderId];
        require(order.customerName == msg.sender, "Only customerName can sell order");
        require(order.orderStatus == TypeRSCF.OrderStatus.Transferred, "Order must be in Transferred status");
        order.orderStatus = TypeRSCF.OrderStatus.Completed;
        emit OrderCompleted(orderId);
    }

       /**
     * @dev Get one order
     * @param orderRSCFId_ Unique order ID 
     * @return orderRSCF_ Details of the order
     */
    function getSpecificOrderRSCF(string memory orderRSCFId_)
        internal
        view
        returns (TypeRSCF.OrderRSCF memory)
    {
        return (orders[orderRSCFId_]);
    }

    function getAllOrder() 
        internal 
        view 
        returns (TypeRSCF.OrderRSCF[] memory) 
    {
        return orderRSCFs;
    }
}