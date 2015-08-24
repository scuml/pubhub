// get_one()
// Checks pubhub for one time data.
// Subscribes till data is received, then disconnects.
// This was written to fetch a queued processes result and times out
// after 20 seconds

(function( $ ) {
$.fn.get_one = function(channel, callback) {
    var _self = this;
    var socket = io('/pubhub');
    
    var timeout = setTimeout(function(){
        _self.html(
            'There appears to be a problem communicating with the server. '+
            'Please try again and contact support if the problem persists.'
        )
        socket.disconnect();
    }, 20000);

    socket.on('connect', function(data){
        socket.emit('get_one', channel);
    })
    socket.on('result', function(data){
        clearTimeout(timeout);
        socket.disconnect();
        if(data.status == 'error'){
            _self.html(data.message)
            return
        }
        if(data.status == 'success'){
            if(callback)
                callback.call(_self, data.data);
            else
                _self.html(data.data);
            return;
        }

    });
};

$.fn.get_stream = function(channel, callback) {
   var _self = this;
    var socket = io('/pubhub');
    
    var timeout = setTimeout(function(){
        _self.html(
            'There appears to be a problem communicating with the server. '+
            'Please try again and contact support if the problem persists.'
        )
        socket.disconnect();
    }, 20000);

    socket.on('connect', function(data){
        socket.emit('get_stream', channel);
        clearTimeout(timeout);
    })
    socket.on('result', function(data){
        if(data.status == 'error'){
            _self.append($("<div>").html(data.message));
            return
        }
        if(data.status == 'success'){
            if(callback)
                callback.call(_self, data.data);
            else
                _self.append($("<div>").html(data.data));
            return;
        }

    });
}

}( jQuery ));