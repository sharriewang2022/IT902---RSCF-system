from flask import Flask, jsonify, request, Blueprint
from util.mySqlDB import mySqlDB
from util.redisUtil import redisUtil

from datetime import datetime
import uuid

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
OrderBP = Blueprint("OrderBP", __name__)


@OrderBP.route("/order/allOrders", methods=["GET"])
def getAllOrders():
    """all order info"""
    sql = "SELECT * FROM orderHead"
    data = mySqlDB.selectMysqldb(sql)
    print("all orders' data == >> {}".format(data))
    return jsonify({"code": 200, "data": data, "msg": "success"})


@OrderBP.route("/order/getSomeOrder/<string:orderId>", methods=["GET"])
def getSomeOrder(orderId):
    """some order"""
    sql = "SELECT * FROM orderProduct WHERE orderId = '{}'".format(orderId)
    data = mySqlDB.selectMysqldb(sql)
    print("gain {} order info == >> {}".format(orderId, data))
    if data:
        return jsonify({"code": 200, "data": data, "msg": "success"})
    return jsonify({"code": "7007", "msg": "no order"})



@OrderBP.route("/order/addOrder", methods=['POST'])
def addOrder():
    """add order head"""
    orderId = uuid.uuid1()   
    orderName = request.json.get("orderName", "").strip()  
    orderAmount = request.json.get("orderAmount", "0")
    OrderType = request.json.get("orderType", "").strip()
    OrderStatus = request.json.get("orderStatus", "").strip()
    UserName = request.json.get("UserName", "").strip()
    UnitPrice = request.json.get("unitPrice", "0")
    description = request.json.get("orderDescription", "").strip()
    blockchainHash = request.json.get("blockchainHash", "").strip()
    createDate = datetime.today().date()

    if orderName : # if "", the false
        queryOrderNameSql = "SELECT orderName FROM orderHead WHERE ordername = '{}'".format(orderName)
        isOrderExist = mySqlDB.selectMysqldb(queryOrderNameSql)
        print("Querey order result ==>> {}".format(isOrderExist))
  
        if isOrderExist:
            return jsonify({"code": 7002, "msg": "The order name already exists！"})
        else: 
            addOrderSql = "INSERT INTO orderHead(OrderID, OrderName, OrderAmount, OrderType,"\
                "OrderStatus, UserName, UnitPrice, BlockchainHash, Description, CreateDate) "\
                "VALUES('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                    orderId, orderName, orderAmount, OrderType, OrderStatus,
                    UserName, UnitPrice, blockchainHash, description, createDate)
            mySqlDB.executeMysqldb(addOrderSql)            
            print("Add order SQL ==>> {}".format(addOrderSql))
            return jsonify({"code": 200, "orderId": orderId, "msg": "The order is added successfully！"})
    else:
        return jsonify({"code": 7001, "msg": "order name could not be null"})
    
    

@OrderBP.route("/order/addOrderProductItem", methods=['POST'])
def addOrderProductItem():
    """add order product item"""
    orderId = request.json.get("orderId", "").strip() 
    productID = request.json.get("ProductID", "").strip() 
    productName = request.json.get("ProductName", "").strip() 
    userName = request.json.get("UserName", "").strip()
    productNumber = request.json.get("ProductNumber", "").strip()
    productItem = request.json.get("ProductItems", "").strip()
    productPrice = request.json.get("ProductPrice", "").strip()
    description = request.json.get("orderDescription", "").strip()
    blockchainHash = request.json.get("blockchainHash", "").strip()
    createDate = datetime.today().date()

    if productID : # if "", the false  
        addOrderProductItemSql = "INSERT INTO orderProduct(orderId, ProductID, ProductName, ProductItem,"\
            "UserName, ProductNumber, ProductPrice, BlockchainHash, Description, CreateDate) "\
            "VALUES('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                orderId, productID, productName, productItem,
                userName, productNumber, productPrice, blockchainHash, description, createDate)
        mySqlDB.executeMysqldb(addOrderProductItemSql)
        print("Add order SQL ==>> {}".format(addOrderProductItemSql))
        return jsonify({"code": 200, "productName": productName, "msg": "The order product details are added successfully！"})
    else:
        return jsonify({"code": 7001, "msg": "productID could not be null"})
    


@OrderBP.route("/order/updateOrder", methods=['POST'])
def updateOrder():  
    """update order"""
    orderId = request.json.get("orderId", "").strip()  
    newOrderName = request.json.get("orderName", "").strip()  
    newOrderAmount = request.json.get("orderAmount")
    newOrderType = request.json.get("orderType", "").strip()
    newOrderStatus = request.json.get("orderStatus", "").strip()
    newUserName = request.json.get("userName", "").strip()
    newUnitPrice = request.json.get("orderUnitPrice")
    newDescription = request.json.get("orderDescription", "").strip()
    newProducts = request.json.get("products", "").strip()

    if orderId \
        and newProducts : 
            queryOrderByIdSql = "SELECT * FROM orderHead WHERE orderId = '{}'".format(orderId)
            resQueryID = mySqlDB.selectMysqldb(queryOrderByIdSql)
            print("Order {} query info   ==>> {}".format(id, resQueryID))

            if not resQueryID: # no this order id
                return jsonify({"code": 7005, "msg": "The order ID does not exist"})             
    
            updateOrderSql = "UPDATE orderHead SET orderName = '{}', OrderAmount = '{}', OrderType = '{}', "\
                "OrderStatus = '{}', UserName = '{}', UnitPrice = '{}', "\
                "description = '{}', products = '{}' "\
                "WHERE orderId = '{}'".format(newOrderName, newOrderAmount, newOrderType,
                newOrderStatus, newUserName, newUnitPrice, newDescription, newProducts, orderId)
            mySqlDB.executeMysqldb(updateOrderSql)
            print("update order SQL ==>> {}".format(updateOrderSql))
            return jsonify({"code": 200, "msg": "The information of order was changed successfully！"})
    else:
        return jsonify({"code": 7001, "msg": "The details of order could not be empty"})
    

@OrderBP.route("/order/deleteOrder/<string:id>", methods=['POST'])
def deleteOrder(id):
    adminUser = request.json.get("adminUser", "").strip()  
    token = request.json.get("token", "").strip()  
    if adminUser and token:
        redisToken = redisUtil.operateRedisToken(adminUser) 
        if redisToken:
            if redisToken == token:  #  redis_token  == body token
                queryRoleIdSql = "SELECT roleId FROM user WHERE username = '{}'".format(adminUser)
                roleResult = mySqlDB.selectMysqldb(queryRoleIdSql)
                print("User: {} role  == >> {}".format(adminUser, roleResult))
                userRole = roleResult[0]["roleId"]
                if userRole == 8888888: # if usr role is order Manufacturer
                    queryOrderByIdSql = "SELECT * FROM orderProduct WHERE id = '{}'".format(id)
                    resQueryID = mySqlDB.selectMysqldb(queryOrderByIdSql)
                    print("Order {} query info   ==>> {}".format(id, resQueryID))

                    if not resQueryID: # no this order id
                        return jsonify({"code": 7005, "msg": "The order ID does not exist"})    
                    else:
                        delOrderSql = "DELETE FROM orderProduct WHERE id = '{}'".format(id)
                        mySqlDB.executeMysqldb(delOrderSql)
                        print("Delete order information SQL ==>> {}".format(delOrderSql))
                        return jsonify({"code": 200, "msg": "The order is deleted successfully！"})
                else:
                    return jsonify({"code": 7004, "msg": "Only administrator could delete order information"})
            else:
                return jsonify({"code": 7003, "msg": "Token is not right"})
        else:
            return jsonify({"code": 7002, "msg": "Please log in firstly"})
    else:
        return jsonify({"code": 7001, "msg": "Token could not be empty"})