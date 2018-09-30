define(['./module', '../enums/errorCodes'], function (services, errorCodes) {
    'use strict';
    services.factory('Request', ['$http', '$rootScope', '$state', '$cookies',
        function ($http, $rootScope, $state, $cookies) {
            return {
                post: function (endpoint, parameters, cbSuccess, cbFail, customTimeout) {
                    return $http({
                        method: 'POST',
                        url: __API__ + '/api/v1/' + endpoint,
                        data: parameters,
                        timeout: customTimeout != null ? customTimeout : 10000
                    }).then(function (data) {
                        var message = data.data;
                        var status = data.status;
                        if (message.data != null)
                            cbSuccess(message.data, message);
                        else if (status == 200){
                            cbSuccess(message.message, message);
                        }
                        else
                            cbFail(status, message.message, message);
                    }, function (data) {
                        var status = data.status;
                        if (status != -1){
                            switch (status){
                                case 401:
                                    $rootScope.user = null;
                                    $rootScope.loggedIn = false;
                                    $cookies.put("redirect_on_login", $state.current.name);
                                    $state.go('public.login', {});
                                    cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail.replace("%s", ((data.headers('x-ratelimit-pathreset') - new Date().getTime())/1000).toFixed(0) + ' seconds'), errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    var message = data.data.message;
                                    cbFail(status, isNaN(message) ? message : errorCodes[message].detail, message);
                            }
                        } else
                            cbFail(status, 'Failed to connect to API.');
                    });
                },
                get: function (endpoint, data, cbSuccess, cbFail) {
                    if (cbFail == null) {
                        // 3 Params
                        cbFail = cbSuccess;
                        cbSuccess = data;
                        data = {};
                    }




                    return $http({
                        method: 'GET',
                        url: __API__ + '/api/v1/' + endpoint,
                        params: data,
                        timeout: 10000
                    }).then(function (data) {
                        var message = data.data;

                        cbSuccess(message, data);
                    }, function (data) {
                        var status = data.status;
                        if (status != -1){
                            switch (status){
                                case 401:
                                    $rootScope.user = null;
                                    $rootScope.loggedIn = false;
                                    $cookies.put("redirect_on_login", $state.current.name);
                                    $state.go('public.login', {});
                                    cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail, errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    var message = data.data.message;
                                    cbFail(status, isNaN(message) ? message : errorCodes[message].detail, message);
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
                        url: __API__ + '/api/v1/' + endpoint,
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
                                        $rootScope.user = null;
                                        $rootScope.loggedIn = false;
                                        $cookies.put("redirect_on_login", $state.current.name);
                                        $state.go('public.login', {});
                                        cbFail(status, errorCodes[errorCodes.NotLoggedOn.id].detail, errorCodes.NotLoggedOn.id);
                                        break;
                                    case 429:
                                        cbFail(status, errorCodes[errorCodes.RateLimitExceeded.id].detail, errorCodes.RateLimitExceeded.id);
                                        break;
                                    default:
                                        var message = data.data.message;
                                        cbFail(status, isNaN(message) ? message : errorCodes[message].detail, message);
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
