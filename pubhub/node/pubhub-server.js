var io = require('socket.io').listen(8050);
var redis = require('redis');
var url = require('url');

// Load redis
var r = redis.createClient()
r.select(15);

// Method check()
// Simple scan for value in room.
// If cached, displays it.
// If not, wait till ready, then displays and disconnects.

var check = io
    .of('/pubhub')
    .on('connection', function(socket){

        socket.on('get_one', function(channel){
            socket.join(channel)
            socket.emit('message', channel);  

            CACHE_KEY = 'check_cache/' + channel;
            r.hgetall(CACHE_KEY, function(err, res){
                console.info(CACHE_KEY, err, res);

                // Results are stored in redis as
                // status - (error, success)
                // data - (content)

                // return results if cached
                if( res != null){
                    // console.info("Got result from cache:", res, channel);
                    socket.emit("result", res);
                    return true;
                }

                // else subscribe till results are returned
                SUBSCRIBE_KEY = CACHE_KEY + "/sub";
                
                var sub = redis.createClient()
                sub.select(15);

                sub.subscribe(SUBSCRIBE_KEY);
                sub.on("message", function(SUBSCRIBE_KEY, message) {
                    r.hgetall(CACHE_KEY, function(err, res){
                        // return results if cached
                            
                        if( res != null){
                            socket.emit("result", res);
                            sub.unsubscribe(SUBSCRIBE_KEY);
                            //console.info("Unsubscribing to:",  SUBSCRIBE_KEY);
                            return true;
                        }
                    });
                });
            });
        });

        socket.on('get_stream', function(channel){
            socket.join(channel)
            socket.emit('message', channel);  

            CACHE_KEY = 'check_cache/' + channel;
            r.hgetall(CACHE_KEY, function(err, res){
                console.info(CACHE_KEY, err, res);

                // Results are stored in redis as
                // status - (error, success)
                // data - (content)

                // return results if cached
                if( res != null){
                    // console.info("Got result from cache:", res, channel);
                    socket.emit("result", res);
                }

                // else subscribe till results are returned
                SUBSCRIBE_KEY = CACHE_KEY + "/sub";
                
                var sub = redis.createClient()
                sub.select(15);

                sub.subscribe(SUBSCRIBE_KEY);
                sub.on("message", function(SUBSCRIBE_KEY, message) {
                    r.hgetall(CACHE_KEY, function(err, res){
                        // return results if cached
                            
                        if( res != null){
                            socket.emit("result", res);
                            return true;
                        }
                    });
                });
            });
        });
    })

console.info("Listening on port 8050...");


