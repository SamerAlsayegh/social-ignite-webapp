define(['./module', '../enums/errorCodes'], function (services, errorCodes) {
    'use strict';
    services.factory('Request', ['$http', '$cookies', '$state', '$rootScope', 'Alert',
        function ($http, $cookies, $state, $rootScope, Alert) {
            return {
                post: function (endpoint, parameters, cbSuccess, cbFail) {
                    return $http({
                        method: 'POST',
                        url: API + '/api/v1/' + endpoint,
                        data: parameters,
                        timeout: 3000
                    }).then(function (data, status, headers, config) {
                        var message = data.data;
                        cbSuccess(message.data, message);
                    }, function (data) {
                        var status = data.status;
                        if (status != -1){
                            switch (status){
                                case 401:
                                    cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail, errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    var message = data.data.message;
                                    cbFail(status, errorCodes[message].detail, message);
                            }
                        } else
                            cbFail(status, 'Failed to connect to API.');
                    });
                },
                put: function (endpoint, parameters, cbSuccess, cbFail) {
                    return $http({
                        method: 'PUT',
                        url: API + '/api/v1/' + endpoint,
                        data: parameters,
                        timeout: 3000
                    }).then(function (data, status, headers, config) {
                        var message = data.data;
                        cbSuccess(message.data, message);
                    }, function (data) {
                        var status = data.status;
                        if (status != -1){
                            switch (status){
                                case 401:
                                    cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail, errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    var message = data.data.message;
                                    cbFail(status, errorCodes[message].detail, message);
                            }
                        } else
                            cbFail(status, 'Failed to connect to API.');
                    });
                },
                get: function (endpoint, cbSuccess, cbFail) {
                    return $http({
                        method: 'GET',
                        url: API + '/api/v1/' + endpoint,
                        timeout: 3000
                    }).then(function (data, status, headers, config) {
                        cbSuccess(data.data, data);
                    }, function (data) {
                        var status = data.status;
                        if (status != -1){
                            switch (status){
                                case 401:
                                    cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail, errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    var message = data.data.message;
                                    cbFail(status, errorCodes[message].detail, message);
                            }
                        } else
                            cbFail(status, 'Failed to connect to API.');
                    });
                },
                delete: function (endpoint, parameters, cbSuccess, cbFail) {
                    return $http({
                        method: 'DELETE',
                        url: API + '/api/v1/' + endpoint,
                        data: parameters,
                        timeout: 3000
                    }).then(function (data, status, headers, config) {
                        var message = data.data;
                        cbSuccess(message.data, message);
                    }, function (data) {
                        var status = data.status;
                        if (status != -1){
                            switch (status){
                                case 401:
                                    cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail, errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    var message = data.data.message;
                                    cbFail(status, errorCodes[message].detail, message);
                            }
                        } else
                            cbFail(status, 'Failed to connect to API.');
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
                            var status = data.status;
                            if (status != -1){
                                switch (status){
                                    case 401:
                                        cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                        break;
                                    case 429:
                                        cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail, errorCodes.RateLimitExceeded.id);
                                        break;
                                    default:
                                        var message = data.data.message;
                                        cbFail(status, errorCodes[message].detail, message);
                                }
                            } else
                                cbFail(status, 'Failed to connect to API.');
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
