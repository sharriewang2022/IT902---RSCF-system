import redis
from config.setting import REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, EXPIRE_TIME


class RedisUtil():

    def __init__(self, host, port, password):
        #  build redit connection
        self.redisDB = redis.Redis(
            host=host,
            port=port,
            password=password,
            decode_responses=True # get() string 
        )

    def operateRedisToken(self, key, value=None):
         # get token from redis
        if value: # when value is not null，then store key value，EXPIRE_TIME in the redis
            self.redisDB.set(key, value, ex=EXPIRE_TIME)
        else: # when value is null， get value from redis via key
            redis_token = self.redisDB.get(key)
            return redis_token


redisUtil = RedisUtil(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)