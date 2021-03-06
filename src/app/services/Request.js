define(['./module'], services => {
    services.factory('Request', ['$http', '$rootScope', '$state', '$cookies',
        ($http, $rootScope, $state, $cookies) => {

            // Backup error codes incase the error codes are not fetched from metadata and backend.
            $rootScope.errorCodes = $rootScope.errorCodes == null ? {
                NotLoggedOn: {id: 14, detail: 'You are no-longer logged on.'},
                RateLimitExceeded: {id: 30, detail: 'You have been rate-limited, please wait %s.'},
            } : $rootScope.errorCodes;

            return {
                post(endpoint, parameters, cbSuccess, cbFail, customTimeout) {
                    return $http({
                        method: 'POST',
                        url: __API__ + '/api/v1/' + endpoint,
                        data: parameters,
                        timeout: customTimeout != null ? customTimeout : 10000
                    }).then(data => {
                        let message = data.data;
                        let status = data.status;
                        if (message.data != null)
                            cbSuccess(message.data, message);
                        else if (status == 200) {
                            cbSuccess(message.message, message);
                        }
                        else
                            cbFail(status, message.message, message);
                    }, data => {
                        let status = data.status;
                        if (status != -1) {
                            switch (status) {
                                case 401:
                                    $rootScope.user = null;
                                    $rootScope.loggedIn = false;
                                    $cookies.put("redirect_on_login", $state.current.name);
                                    $state.go('public.login', {});
                                    cbFail(status, $rootScope.errorCodes.NotLoggedOn.detail, $rootScope.errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, $rootScope.errorCodes.RateLimitExceeded.detail.replace("%s", ((data.headers('x-ratelimit-pathreset') - new Date().getTime()) / 1000).toFixed(0) + ' seconds'), $rootScope.errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    let message = data.data.message;
                                    cbFail(status, isNaN(message) ? message : $rootScope.errorCodes[message].detail, message);
                            }
                        } else
                            cbFail(status, 'Failed to connect to API.');
                    });
                },
                get(endpoint, data, cbSuccess, cbFail) {
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
                    }).then(data => {
                        let message = data.data;

                        cbSuccess(message, data);
                    }, data => {
                        let status = data.status;
                        if (status != -1) {
                            switch (status) {
                                case 401:
                                    $rootScope.user = null;
                                    $rootScope.loggedIn = false;
                                    $cookies.put("redirect_on_login", $state.current.name);
                                    $state.go('public.login', {});
                                    cbFail(status, $rootScope.errorCodes.NotLoggedOn.detail, $rootScope.errorCodes.NotLoggedOn.id);
                                    break;
                                case 429:
                                    cbFail(status, $rootScope.errorCodes.RateLimitExceeded.detail, $rootScope.errorCodes.RateLimitExceeded.id);
                                    break;
                                default:
                                    let message = data.data.message;
                                    cbFail(status, isNaN(message) ? message : $rootScope.errorCodes[message].detail, message);
                            }
                        } else
                            cbFail(status, 'Failed to connect to API.');
                    });
                },
                formPost(endpoint, parameters, cbSuccess, cbFail, cbProgress) {

                    let formData = new FormData();
                    for (let paramKey in parameters) {
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
                            progress: function(e) {
                                if (e.lengthComputable && cbProgress) {
                                    cbProgress(e.loaded, e.total);
                                }
                            }
                        },
                    })
                        .then(data => {
                            let message = data.data;
                            cbSuccess(message.data, message);
                        }, data => {
                            let status = data.status;
                            if (status != -1) {
                                switch (status) {
                                    case 401:
                                        $rootScope.user = null;
                                        $rootScope.loggedIn = false;
                                        $cookies.put("redirect_on_login", $state.current.name);
                                        $state.go('public.login', {});
                                        cbFail(status, $rootScope.errorCodes.NotLoggedOn.detail, $rootScope.errorCodes.NotLoggedOn.id);
                                        break;
                                    case 429:
                                        cbFail(status, $rootScope.errorCodes.RateLimitExceeded.detail, $rootScope.errorCodes.RateLimitExceeded.id);
                                        break;
                                    default:
                                        let message = data.data.message;
                                        cbFail(status, isNaN(message) ? message : $rootScope.errorCodes[message].detail, message);
                                }
                            } else
                                cbFail(status, 'Failed to connect to API.');
                        });
                },
                ArrayToURL(data) {
                    let ret = [];
                    if (data != null) {
                        for (let d in data)
                            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
                        return "?" + ret.join('&');
                    } else return "";
                }
            };
        }]);
});
