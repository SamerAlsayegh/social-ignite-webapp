define(['./module', '../enums/errorCodes'], function (services, errorCodes) {
    'use strict';
    services.factory('Request', ['$http', '$cookies', '$state', '$rootScope', 'Alert',
        function ($http, $cookies, $state, $rootScope, Alert) {
            return {
                post: function (endpoint, parameters, cbSuccess, cbFail) {
                    return $http({
                        method: 'POST',
                        url: API + '/api/v1/' + endpoint,
                        data: parameters
                    }).then(function (data, status, headers, config) {
                        var message = data.data;
                        cbSuccess(message.data, message);
                    }, function (data) {
                        var message = data.error;
                        var status = data.status;
                        if (status != null){
                            switch (status){
                                case 401:
                                    // User is not logged in...
                                    Alert.error("You are not logged in.");
                                    break;
                                default:
                                    cbFail(status, message);
                            }
                        } else
                            cbFail(status, status == -1 ? 'Failed to connect to API.' : message);
                    });
                },
                put: function (endpoint, parameters, cbSuccess, cbFail) {
                    return $http({
                        method: 'PUT',
                        url: API + '/api/v1/' + endpoint,
                        data: parameters
                    }).then(function (data, status, headers, config) {
                        var message = data.data;
                        cbSuccess(message.data, message);
                    }, function (data) {
                        var message = data.data;
                        var status = data.status;
                        if (message != null && message.hasOwnProperty("code")){
                            switch (message){
                                // case errorCodes.InvalidSession:
                                //     // User is not logged in...
                                //     Alert.error("You are not logged in.");
                                //     break;
                                default:
                                    cbFail(status, message);
                            }
                        } else
                            cbFail(status, status == -1 ? 'Failed to connect to API.' : message);
                    });
                },
                get: function (endpoint, cbSuccess, cbFail) {
                    return $http({
                        method: 'GET',
                        url: API + '/api/v1/' + endpoint,
                    }).then(function (data, status, headers, config) {
                        cbSuccess(data.data, data);
                    }, function (data) {
                        var message = data.data;
                        var status = data.status;
                        if (message != null && message.hasOwnProperty("code")){
                            switch (message){
                                case errorCodes.InvalidSession:
                                    // User is not logged in...
                                    Alert.error("You are not logged in.");
                                    break;
                                default:
                                    cbFail(status, message);
                            }
                        } else
                            cbFail(status, status == -1 ? 'Failed to connect to API.' : message);
                    });
                },
                delete: function (endpoint, parameters, cbSuccess, cbFail) {
                    return $http({
                        method: 'DELETE',
                        url: API + '/api/v1/' + endpoint,
                        data: parameters
                    }).then(function (data, status, headers, config) {
                        var message = data.data;
                        cbSuccess(message.data, message);
                    }, function (data) {
                        var message = data.data;
                        var status = data.status;
                        if (message != null && message.hasOwnProperty("code")){
                            switch (message){
                                case errorCodes.InvalidSession:
                                    // User is not logged in...
                                    Alert.error("You are not logged in.");
                                    break;
                                default:
                                    cbFail(status, message);
                            }
                        } else
                            cbFail(status, message);
                    });
                },
                formPost: function(endpoint, parameters, cbSuccess, cbFail, cbProgress){

                    var formData = new FormData();
                    for (var paramKey in parameters) {
                        if (parameters[paramKey] instanceof Array) parameters[paramKey] = JSON.stringify(parameters[paramKey]);
                        formData.append(paramKey, parameters[paramKey]);
                    }

                    return $http({
                        method: 'POST',
                        url: API + '/api/v1/' + endpoint,
                        data: formData,
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined},
                        uploadEventHandlers: {
                            progress: function (e) {
                                if (e.lengthComputable && cbProgress) {
                                    cbProgress(e.loaded, e.total);
                                }
                            }
                        },
                    })
                        .then(function (data) {
                            var message = data.data;
                            cbSuccess(message.data, message);
                        }, function (data) {
                            var message = data.data;
                            var status = data.status;
                            cbFail(status, status == -1 ? 'Failed to connect to API.' : message);
                        });
                },
                ArrayToURL: function (data) {
                    var ret = [];
                    if (data != null) {
                        for (var d in data)
                            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                        return "?" + ret.join('&');
                    } else return "";
                }
            };
        }]);
});
