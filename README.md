PubHub
======

A python/node project intended to make implementation of websockets in a python app a lot easier.

Methods
-------

**get_one()**

Waits for the server to store an object in a provided location.  When there, the object is displayed to the user and the socket connection closed.  This is useful to display a page that is requesting data in the background, such as a search query.

**get_stream()**

This constant connection listens to a channel, and echos any data into a new div on the page. 

