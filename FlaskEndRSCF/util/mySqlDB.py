import pymysql 
from config.setting import MYSQLDB_HOST, MYSQLDB_PORT, MYSQLDB_USER, MYSQLDB_PASSWORD, MYSQLDB_NAME

class MySqlDB():

    def __init__(self, host, port, user, passwd, name):
        # build connection
        self.dbConnection = pymysql.connect(
            host = host,
            port = port,
            user = user,
            passwd = passwd,
            db = name,
            autocommit=True
        )
        # Create cursor，the style of result is dictCursor
        self.cursor = self.dbConnection.cursor(cursor=pymysql.cursors.DictCursor)

    # when self will be deleted
    def __del__(self): 
        # close cursor
        self.cursor.close()
        # close database connection
        self.dbConnection.close()

    def selectMysqldb(self, sql):
        """select database"""
        # if connection is down, then reconnect
        self.dbConnection.ping(reconnect=True)
        # execute sql
        self.cursor.execute(sql)
        # gain result
        data = self.cursor.fetchall()
        return data

    def executeMysqldb(self, sql):
        """add/update/delete"""
        try:
            self.dbConnection.ping(reconnect=True)
            self.cursor.execute(sql)        
            self.dbConnection.commit()
        except Exception as e:
            print("Error:{}".format(e))
            self.dbConnection.rollback()

mySqlDB = MySqlDB(MYSQLDB_HOST, MYSQLDB_PORT, MYSQLDB_USER, MYSQLDB_PASSWORD, MYSQLDB_NAME)