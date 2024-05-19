from flask import Flask, jsonify, request, flash, redirect, url_for, session, Blueprint
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import logging
from datetime import datetime
import uuid
from util.mySqlDB import mySqlDB
from util.redisUtil import redisUtil
from util.encryptDRM import addEncryptedFiletoIPFS
from util.smartContractIPFS import addIPFSHashcodeToBlockchain

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
DocumentBP = Blueprint("DocumentBP", __name__)

UPLOAD_FOLDER = './uploadedFiles'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('Supply chain document')

# if __name__ == "__main__":
    # app.secret_key = os.urandom(24)
#     app.run(debug=True,host="0.0.0.0",use_reloader=False)


@DocumentBP.route('/file/upload/<string:fileName>', methods=['POST'])
def fileUpload(fileName):
    target=os.path.join(UPLOAD_FOLDER,'test')
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload`")
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    destination="/".join([target, filename])
    file.save(destination)
    session['uploadFilePath']=destination
    fileIPFSHash = addEncryptedFiletoIPFS(filename, target)
    # change to front-end
    #addIPFSHashcodeToBlockchain(fileIPFSHash,filename,target)
    descrip = " uploade file to ipfs"
    response = saveFiletoDataBase(filename, target, fileIPFSHash, fileName, descrip)
    return response

def saveFiletoDataBase(fileName, filePath, fileIPFSHash, userName, descrip):
    documentId = uuid.uuid1()
    documentName = fileName.strip() 
    extensionName = os.path.splitext(fileName)[1]
    realPath = filePath.strip()
    authorID = userName.strip()
    description = descrip.strip()
    fileIpfsHash = fileIPFSHash.strip()
    createDate = datetime.today().date()

    if documentName : # if "", the false
        queryDocumentNameSql = "SELECT documentName FROM document WHERE documentname = '{}'".format(documentName)
        isDocumentExist = mySqlDB.selectMysqldb(queryDocumentNameSql)
        print("Querey document result ==>> {}".format(isDocumentExist))
  
        if isDocumentExist:
            return jsonify({"code": 8001, "msg": "The document name already exists！"})
        else:             
            addDocumentSql = "INSERT INTO document (documentId, documentName, extensionName, realPath, "\
                "authorID, fileIpfsHash, description, createDate) "\
                "VALUES('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(documentId, documentName, extensionName,
                    realPath, authorID, fileIpfsHash, description, createDate)
            mySqlDB.executeMysqldb(addDocumentSql)
            print("Add document SQL ==>> {}".format(addDocumentSql))
            return jsonify({"code": 200, "fileIPFSHash": fileIPFSHash, "documentId": documentId, "realPath": realPath, "msg": "The document is added successfully！"})
    else:
        return jsonify({"code": 8008, "msg": "The name of document could not be null"})


@DocumentBP.route("/file/allDocuments/<string:userName>", methods=["GET"])
def getAllDocuments(userName):
    """all document info"""
    sql = "SELECT * FROM document where authorId = '{}'".format(userName)
    data = mySqlDB.selectMysqldb(sql)
    print("all documents' data == >> {}".format(data))
    return jsonify({"code": 200, "data": data, "msg": "get the user "+ userName+"'s all documents successfully!"})


@DocumentBP.route("/file/getSomeDocument/<string:documentId>", methods=["GET"])
def getSomeDocumentByFileId(documentId):
    """some document"""
    sql = "SELECT * FROM document WHERE documentId = '{}'".format(documentId)
    data = mySqlDB.selectMysqldb(sql)
    print("gain {} document info == >> {}".format(documentId, data))
    if data:
        return jsonify({"code": 0, "data": data, "msg": "success"})
    return jsonify({"code": "1004", "msg": "no document"})

@DocumentBP.route("/file/userDocument/<string:userId>", methods=["GET"])
def getSomeDocumentByUser(userId):
    """some document"""
    sql = "SELECT * FROM document WHERE authorId = '{}'".format(userId)
    data = mySqlDB.selectMysqldb(sql)
    print("Gain {} document info == >> {}".format(userId, data))
    if data:
        return jsonify({"code": 0, "data": data, "msg": "success"})
    return jsonify({"code": "1004", "msg": "no document"})


@DocumentBP.route("/file/addDocument", methods=['POST'])
def addDocument():
    """add document"""
    documentId = uuid.uuid1()
    documentName = request.json.get("documentName", "").strip() 
    extensionName = request.json.get("extensionName", "").strip()
    realPath = request.json.get("realPath", "").strip()
    authorID = request.json.get("authorID", "").strip()
    description = request.json.get("description", "").strip()
    fileIpfsHash = request.json.get("fileIpfsHash", "").strip()
    createDate = datetime.now().date

    if documentName : # if "", the false
        queryDocumentNameSql = "SELECT documentName FROM document WHERE documentname = '{}'".format(documentName)
        isDocumentExist = mySqlDB.selectMysqldb(queryDocumentNameSql)
        print("Querey document result ==>> {}".format(isDocumentExist))
  
        if isDocumentExist:
            return jsonify({"code": 8001, "msg": "The document name already exists！"})
        else:             
            addDocumentSql = "INSERT INTO document (documentId, documentName, extensionName, realPath, "\
                "authorID, FileIpfsHash, description, createDate) "\
                "VALUES('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}')".format(documentId, documentName, extensionName,
                    realPath, authorID, fileIpfsHash, description, createDate)
            mySqlDB.executeMysqldb(addDocumentSql)
            print("Add document SQL ==>> {}".format(addDocumentSql))
            return jsonify({"code": 200, "msg": "The document is added successfully！"})
    else:
        return jsonify({"code": 8008, "msg": "The name of document could not be null"})



@DocumentBP.route("/file/updateDocument/<int:id>", methods=['PUT'])
def UpdateDocument(id):  
    """update document"""
    documentManufacturer = request.json.get("documentManufacturer", "").strip()  
    token = request.json.get("token", "").strip()  
    documentAuthorID = request.json.get("userID", "").strip()  
    newDocumentName = request.json.get("documentName", "").strip() 
    newExtensionName = request.json.get("extensionName", "").strip()
    newRealPath = request.json.get("realPath", "").strip()
    newAuthorID = request.json.get("authorID", "").strip()
    newFileIpfsHash = request.json.get("fileIpfsHash", "").strip()
    newDescription = request.json.get("description", "").strip()


    if documentManufacturer and token and newDocumentName and newExtensionName \
        and newRealPath and newAuthorID :
        # get token from redis
        redisToken = redisUtil.operateRedisToken(documentManufacturer) 
        if redisToken:
            if redisToken == token: # redis token ==  request body token
                queryDocumentByIdSql = "SELECT * FROM document WHERE id = '{}'".format(id)
                resQueryID = mySqlDB.selectMysqldb(queryDocumentByIdSql)
                print("Document {} query info   ==>> {}".format(id, resQueryID))

                if not resQueryID: # no this document id
                    return jsonify({"code": 8005, "msg": "The document ID does not exist"})                   
        
                updateDocumentSql = "UPDATE document SET documentName = '{}', extensionName = '{}', realPath = '{}', "\
                        "authorID = '{}', fileIpfsHash = '{}', description = '{}' "\
                        "WHERE id = {}".format(newDocumentName, newExtensionName, newRealPath, 
                            newAuthorID, newFileIpfsHash, newDescription)
                mySqlDB.executeMysqldb(updateDocumentSql)
                print("update document SQL ==>> {}".format(updateDocumentSql))
                return jsonify({"code": 0, "msg": "The information of document was changed successfully！"})
               
            else:
                return jsonify({"code": 8003, "msg": "Token is not right"})
        else:
            return jsonify({"code": 8002, "msg": "Please log in firstly"})
    else:
        return jsonify({"code": 8001, "msg": "The details of document could not be empty"})
    

@DocumentBP.route("/file/deleteDocument/<string:id>", methods=['POST'])
def deleteDocument(id):
    adminUser = request.json.get("adminUser", "").strip()  
    token = request.json.get("token", "").strip()  
    if adminUser and token:
        redisToken = redisUtil.operateRedisToken(adminUser) 
        if redisToken:
            if redisToken == token:  #  redis_token  == body token

                queryDocumentByIdSql = "SELECT * FROM document WHERE id = '{}'".format(id)
                resQueryID = mySqlDB.selectMysqldb(queryDocumentByIdSql)
                print("Document {} query info   ==>> {}".format(id, resQueryID))

                if not resQueryID: # no this document id
                    return jsonify({"code": 8005, "msg": "The document ID does not exist"})    
                else:
                    delDocumentSql = "DELETE FROM document WHERE id = '{}'".format(id)
                    mySqlDB.executeMysqldb(delDocumentSql)
                    print("Delete document information SQL ==>> {}".format(delDocumentSql))
                    return jsonify({"code": 0, "msg": "The document is deleted successfully！"})
                
            else:
                return jsonify({"code": 8003, "msg": "Token is not right"})
        else:
            return jsonify({"code": 8002, "msg": "Please log in firstly"})
    else:
        return jsonify({"code": 8001, "msg": "Token could not be empty"})