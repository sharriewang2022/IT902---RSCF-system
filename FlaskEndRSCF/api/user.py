from flask import Flask, jsonify, request, Blueprint
from util.mySqlDB import mySqlDB
from util.redisUtil import redisUtil
from util.md5Util import md5Encrypt
from datetime import datetime
import uuid, re, time

UserBP = Blueprint("UserBP", __name__)
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

# roleMap = dict(one="Sachin Tendulkar", two="Dravid")

roleMap = {    
    "Administrator":"3001",
    "Supplier": "3002",
    "Manufacturer": "3003", 
    "Distributer": "3004",
    "Retailer": "3005",
    "Customer": "3006"
}


@UserBP.route("/user/allUsers", methods=["GET"])
def getAllUsers():
    """all users info"""
    sql = "SELECT * FROM user"
    data = mySqlDB.selectMysqldb(sql)
    print("all users' data == >> {}".format(data))
    return jsonify({"code": 200, "data": data, "msg": "success"})


@UserBP.route("/user/getSomeUser/<string:username>", methods=["GET"])
def getSomeUser(username):
    """one user"""
    sql = "SELECT * FROM user WHERE username = '{}'".format(username)
    data = mySqlDB.selectMysqldb(sql)
    print("gain {} user info == >> {}".format(username, data))
    if data:
        return jsonify({"code": 200, "data": data, "msg": "success"})
    return jsonify({"code": "1004", "msg": "no user"})


@UserBP.route("/user/register", methods=['POST'])
def userRegister():
    """user register"""
    userId = uuid.uuid1()
    userName = request.json.get("userName", "").strip()  
    userPassword = request.json.get("userPassword", "").strip()
    telephone = request.json.get("telephone", "1111")
    email = request.json.get("userEmail", "").strip()
    roleName = request.json.get("role", "").strip()
    roleID = roleMap[roleName]
    createDate = datetime.today().date()

    if userName and userPassword and email: # if "", the false
        queryUserNameSql = "SELECT username FROM user WHERE username = '{}'".format(userName)
        isUserExist = mySqlDB.selectMysqldb(queryUserNameSql)
        print("Querey user result ==>> {}".format(isUserExist))
        queryTelephoneSql = "SELECT telephone FROM user WHERE telephone = '{}'".format(telephone)
        isTelephoneExist = mySqlDB.selectMysqldb(queryTelephoneSql)
        print("The selected telephone ==>> {}".format(isTelephoneExist))
        if isUserExist:
            print("The user name already exists！")
            return jsonify({"code": 1001, "msg": "The user name already exists！"})
        #elif not (len(telephone) == 11 and re.match("^1[3,5,7,8]\d{9}$", telephone)):
        elif isTelephoneExist:
            print("The telephone already exists！")
            return jsonify({"code": 1002, "msg": "The telephone already exists！"})
        else:
            encryptPassword = md5Encrypt(userName, userPassword) # encode password
            addUserSql = "insert into User(userId, userName, userPassword, firstName, lastName, roleID, email, telephone, createDate) " \
                  "values('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(
                    userId, userName, encryptPassword, userName, userName,
                    roleID, email, telephone, createDate)
            mySqlDB.executeMysqldb(addUserSql)
            print("Add user SQL ==>> {}".format(addUserSql))
            print("The user is registered successfully！")
            return jsonify({"code": 200, "msg": "The user is registered successfully！"})
    else:
        print("Username, password,and telephone could not be null！")
        return jsonify({"code": 2001, "msg": "Username, password,and telephone could not be null"})


@UserBP.route("/user/login", methods=['POST'])
def userLogin():
    """user log in"""
    userName = request.json.get("userName", "").strip()  
    userPassword = request.json.get("userPassword", "").strip()
    if userName and userPassword:  
        queryUserNameSql = "SELECT username FROM user WHERE username = '{}'".format(userName)
        isUserExist = mySqlDB.selectMysqldb(queryUserNameSql)
        print("Querey user result ==>> {}".format(isUserExist))
        if not isUserExist:
            return jsonify({"code": 1003, "msg": "The user does not exist"})
        md5_password = md5Encrypt(userName, userPassword) # encode
        queryUserNamePasswordSql = "SELECT * FROM user WHERE username = '{}' and userPassword = '{}'".format(userName, md5_password)
        isUserNamePwdExist = mySqlDB.selectMysqldb(queryUserNamePasswordSql)
        print("The user {}  == >> {}".format(userName, isUserNamePwdExist))
        if isUserNamePwdExist:
            timeStamp = int(time.time())
            # token = "{}{}".format(username, timeStamp)
            token = md5Encrypt(userName, str(timeStamp)) # generate token
            # redisUtil.operateRedisToken(userName, token) # set token into redis
            loginInfo = { # object stores id,username,toke,login_time 
                "id": isUserNamePwdExist[0]["ID"],
                "userId": isUserNamePwdExist[0]["UserID"],
                "userName": userName,
                "token": token,
                "loginTime": time.strftime("%Y/%m/%d %H:%M:%S")
            }
            return jsonify({"code": 200, "token" : token,"loginInfo": loginInfo, "msg": " Log successfully"})
        
        return jsonify({"code": 1002, "msg": "The user name or password is wrong"})
    else:
        return jsonify({"code": 1001, "msg": "The user name or password does not exist"})


@UserBP.route("/user/update/<int:id>", methods=['PUT'])
def userUpdate(id):  
    """update user, only administrator could do this"""
    adminUser = request.json.get("adminUser", "").strip()  
    token = request.json.get("token", "").strip()  
    newUserPassword = request.json.get("userPassword", "").strip()
    newTelephone = request.json.get("telephone", "").strip() 
    newEmail = request.json.get("email", "").strip()


    if adminUser and token and newUserPassword and newTelephone:
        # get token from redis
        redisToken = redisUtil.operateRedisToken(adminUser) 
        if redisToken:
            if redisToken == token: # redis token ==  request body token
                queryRoleIdSql = "SELECT roleId FROM user WHERE username = '{}'".format(adminUser)
                roleResult = mySqlDB.selectMysqldb(queryRoleIdSql)
                print(" The user   {}  role is  == >> {}".format(adminUser, roleResult))
                user_role = roleResult[0]["roleId"]
                if user_role == 0: # if usr role is administrator
                    queryUserByIdSql = "SELECT * FROM user WHERE id = '{}'".format(id)
                    resQueryID = mySqlDB.selectMysqldb(queryUserByIdSql)
                    print("User {} query info   ==>> {}".format(id, resQueryID))
                    queryUserTelephoneSql = "SELECT telephone FROM user WHERE telephone = '{}'".format(newTelephone)
                    resTelep = mySqlDB.selectMysqldb(queryUserTelephoneSql)
                    print("result: {}".format(resTelep))
                    print("telephone ==>> {}".format(resTelep))
                    if not resQueryID: # no this userid
                        return jsonify({"code": 4005, "msg": "The user ID does not exist"})
                    elif resTelep: # if new telephone already exists
                        return jsonify({"code": 4006, "msg": "The new telephone already exists！"})
                    else:
                        # if newEmail is null，not change it
                        if not newEmail:
                            newEmail = resQueryID[0]["email"]
                     
                        newUserPassword = md5Encrypt(resQueryID[0]["username"], newUserPassword)
                        updateUserSql = "UPDATE user SET userpassword = '{}', telephone = '{}', email = '{}' " \
                                "WHERE id = {}".format(newUserPassword, newTelephone, newEmail, id)
                        mySqlDB.executeMysqldb(updateUserSql)
                        print("update user SQL ==>> {}".format(updateUserSql))
                        return jsonify({"code": 200, "msg": "The information of user was changed successfully！"})
                else:
                    return jsonify({"code": 1004, "msg": "Only administrator could update user information"})
            else:
                return jsonify({"code": 1003, "msg": "Token is not right"})
        else:
            return jsonify({"code": 1002, "msg": "Please log in firstly"})
    else:
        return jsonify({"code": 1001, "msg": "Password and telephone could not be empty"})
    

@UserBP.route("/user/delete/<string:userId>", methods=['POST'])
def userDelete(UserId):
    adminUser = request.json.get("adminUser", "").strip()  
    token = request.json.get("token", "").strip()  
    if adminUser and token:
        redisToken = redisUtil.operateRedisToken(adminUser) 
        if redisToken:
            if redisToken == token:  #  redis_token  == body token
                queryRoleIdSql = "SELECT roleId FROM user WHERE username = '{}'".format(adminUser)
                roleResult = mySqlDB.selectMysqldb(queryRoleIdSql)
                print("User 【 {} 】 role  == >> {}".format(adminUser, roleResult))
                userRole = roleResult[0]["roleId"]
                if userRole == 0: 
                    queryUserByIdSql = "SELECT * FROM user WHERE id = '{}'".format(id)
                    resQueryID = mySqlDB.selectMysqldb(queryUserByIdSql)
                    print(queryUserByIdSql)
                    print("User {}  information  ==>> {}".format(adminUser, resQueryID))
                    if not resQueryID:  
                        return jsonify({"code": 3005, "msg": "The user does not exist"})
                    elif resQueryID[0]["roleId"] == 0: 
                        return jsonify({"code": 3006, "msg": "The user：{} is administrator and could bot be deleted！".format(adminUser)})
                    else:
                        delUserSql = "DELETE FROM user WHERE id = '{}'".format(UserId)
                        mySqlDB.executeMysqldb(delUserSql)
                        print("Delete user information SQL ==>> {}".format(delUserSql))
                        return jsonify({"code": 200, "msg": "The user is deleted successfully！"})
                else:
                    return jsonify({"code": 5004, "msg": "Only administrator could delete user information"})
            else:
                return jsonify({"code": 5003, "msg": "Token is not right"})
        else:
            return jsonify({"code": 5002, "msg": "Please log in firstly"})
    else:
        return jsonify({"code": 5001, "msg": "Token could not be empty"})