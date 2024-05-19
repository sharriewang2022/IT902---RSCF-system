import hashlib
from config.setting import MD5_SALTVALUE


def  md5Encrypt(username, str):
    """MD5 encryption"""
    objectStr = username + str + MD5_SALTVALUE   
    md5 = hashlib.md5()  # get md5 class
    md5.update(objectStr.encode("utf-8"))  # need bytes in Python3
    return md5.hexdigest()  # return context encoded via MD5