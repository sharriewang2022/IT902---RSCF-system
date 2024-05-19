from flask import Flask, jsonify, request, Blueprint
from util.mySqlDB import mySqlDB
from util.redisUtil import redisUtil

from datetime import datetime
import uuid

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
CategoryBP = Blueprint("CategoryBP", __name__)


@CategoryBP.route("/category/allCategory", methods=["GET"])
def getAllCategory():
    """all category info"""
    sql = "SELECT * FROM category"
    data = mySqlDB.selectMysqldb(sql)
    print("all category' data == >> {}".format(data))
    return jsonify({"code": 200, "categoryInfo": data, "msg": "success"})


@CategoryBP.route("/category/getSomeCategory/<string:categoryId>", methods=["GET"])
def getSomeCategory(categoryId):
    """some category"""
    sql = "SELECT * FROM category WHERE categoryId = '{}'".format(categoryId)
    data = mySqlDB.selectMysqldb(sql)
    print("gain {} category info == >> {}".format(categoryId, data))
    if data:
        return jsonify({"code": 200, "categoryInfo": data, "msg": "success"})
    return jsonify({"code": "1004", "msg": "no category"})


@CategoryBP.route("/category/addCategory", methods=['POST'])
def addCategory():
    """add category"""
    categoryId = uuid.uuid1()   
    categoryName = request.json.get("CategoryName", "").strip()  
    parentID = request.json.get("parentID", "").strip() 
    parentName = request.json.get("parentName", "").strip() 
    supplierID = request.json.get("supplier", "").strip()
    manufacturerID = request.json.get("manufacturer", "").strip()
    description = request.json.get("specs", "").strip()
    # blockchainHash = request.json.get("blockchainHash", "").strip()
    createDate = datetime.today().date()

    if categoryName : # if "", the false
        queryCategoryNameSql = "SELECT categoryName FROM category WHERE categoryname = '{}'".format(categoryName)
        isCategoryExist = mySqlDB.selectMysqldb(queryCategoryNameSql)
        print("Querey category result ==>> {}".format(isCategoryExist))
  
        if isCategoryExist:
            return jsonify({"code": 6008, "msg": "The category name already exists！"})
        else:             
            addCategorySql = "INSERT INTO category(categoryId, categoryName, parentID, "\
                " parentName, supplierID, manufacturerID, description, createDate) "\
                "VALUES('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                    categoryId, categoryName, parentID, parentName,
                    supplierID, manufacturerID, description, createDate)
            mySqlDB.executeMysqldb(addCategorySql)
            print("Add category SQL ==>> {}".format(addCategorySql))
            return jsonify({"code": 200, "msg": "The category is added successfully！"})
    else:
        return jsonify({"code": 6002, "msg": "Category name could not be null"})



@CategoryBP.route("/category/updateCategory/<int:id>", methods=['PUT'])
def UpdateCategory(id):  
    """update category, only manufacturer could do this"""
    categoryManufacturer = request.json.get("categoryManufacturer", "").strip()  
    token = request.json.get("token", "").strip()  
    newCategoryName = request.json.get("categoryName", "").strip()  
    newParentID = request.json.get("ParentID", "").strip()
    newSupplierID = request.json.get("supplierID", "").strip()
    newManufacturerID = request.json.get("manufacturerID", "").strip()
    newDescription = request.json.get("description", "").strip()


    if categoryManufacturer and token and newCategoryName \
        and newSupplierID and newManufacturerID:
        # get token from redis
        redisToken = redisUtil.operateRedisToken(categoryManufacturer) 
        if redisToken:
            if redisToken == token: # redis token ==  request body token
                queryRoleIdSql = "SELECT roleId FROM user WHERE userID = '{}'".format(categoryManufacturer)
                roleResult = mySqlDB.selectMysqldb(queryRoleIdSql)
                print(" The user {} role is == >> {}".format(categoryManufacturer, roleResult))
                userRole = roleResult[0]["roleId"]
                # TODO
                if userRole == 8888888: # if usr role is category Manufacturer
                    queryCategoryByIdSql = "SELECT * FROM category WHERE id = '{}'".format(id)
                    resQueryID = mySqlDB.selectMysqldb(queryCategoryByIdSql)
                    print("Category {} query info   ==>> {}".format(id, resQueryID))

                    if not resQueryID: # no this category id
                        return jsonify({"code": 6007, "msg": "The category ID does not exist"})                   
            
                    updateCategorySql = "UPDATE category SET categoryName = '{}', newParentID = '{}', "\
                                " supplierID = '{}', manufacturerID = '{}', description = '{}' "\
                                "WHERE id = {}".format(newCategoryName, newParentID, newSupplierID, newManufacturerID, newDescription)
                    mySqlDB.executeMysqldb(updateCategorySql)
                    print("update category SQL ==>> {}".format(updateCategorySql))
                    return jsonify({"code": 200, "msg": "The information of category was changed successfully！"})
                else:
                    return jsonify({"code": 6004, "msg": "Only Manufacturer could update category information"})
            else:
                return jsonify({"code": 6003, "msg": "Token is not right"})
        else:
            return jsonify({"code": 6005, "msg": "Please log in firstly"})
    else:
        return jsonify({"code": 6006, "msg": "The details of category could not be empty"})
    

@CategoryBP.route("/category/deleteCategory/<string:id>", methods=['POST'])
def deleteCategory(id):
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
                if userRole == 8888888: # if usr role is category Manufacturer
                    queryCategoryByIdSql = "SELECT * FROM category WHERE id = '{}'".format(id)
                    resQueryID = mySqlDB.selectMysqldb(queryCategoryByIdSql)
                    print("Category {} query info   ==>> {}".format(id, resQueryID))

                    if not resQueryID: # no this category id
                        return jsonify({"code": 6007, "msg": "The category ID does not exist"})    
                    else:
                        delCategorySql = "DELETE FROM category WHERE id = '{}'".format(id)
                        mySqlDB.executeMysqldb(delCategorySql)
                        print("Delete category information SQL ==>> {}".format(delCategorySql))
                        return jsonify({"code": 200, "msg": "The category is deleted successfully！"})
                else:
                    return jsonify({"code": 6004, "msg": "Only administrator could delete category information"})
            else:
                return jsonify({"code": 6003, "msg": "Token is not right"})
        else:
            return jsonify({"code": 6005, "msg": "Please log in firstly"})
    else:
        return jsonify({"code": 6006, "msg": "Token could not be empty"})