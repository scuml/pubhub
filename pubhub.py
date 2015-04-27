import redis
REDIS_HOST = 'localhost'
REDIS_PORT = '6379'
REDIS_DB = 15


class PubHub(object):

    """A very simple way to push data out to a websocket client."""
    def __init__(self, channel=''):
        super(PubHub, self).__init__()

        self.r = redis.StrictRedis(
            REDIS_HOST,
            REDIS_PORT,
            REDIS_DB,
        )
        self.channel = channel

    @property
    def cache_key(self):
        return "check_cache/{}".format(self.channel)

    def ttl(self):
        """
        Returns ttl of cache for posted items.
        """
        ttl = self.r.ttl(self.cache_key)
        if ttl is None:
            return 0
        return ttl

    def post(self, message, ttl=3600):
        """
        Posts a message to given pubhub channel.
        """

        pipe = self.r.pipeline()

        # Update the channel data
        pipe.hmset(self.cache_key, {
            'status': 'success',
            'data': message,
        })
        pipe.expire(self.cache_key, ttl)

        # Broadcast the update ping
        pipe.publish("{}/sub".format(self.cache_key), "1")
        pipe.execute()
