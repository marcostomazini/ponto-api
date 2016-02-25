'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('app.core').factory('mySocket', function(socketFactory) {
    return socketFactory();
});