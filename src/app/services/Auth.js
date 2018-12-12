define(['./module'], services => {
    services.factory('Auth', ['Request', '$cookies', '$rootScope',
        (Request, $cookies, $rootScope) => ({
            login(parameters, cbSuccess, cbFail) {
                if (!parameters)
                    return cbFail(400, "Invalid parameters.");

                return Request.post('auth/login', parameters,
                    (message, res) => Request.get('user',
                        message => {
                            $rootScope.user = message.data;
                            $rootScope.loggedIn = true;
                            return cbSuccess(message);
                        }, (status, message) => cbFail(status, message)), (status, message) => cbFail(status, message));
            },

            logout(cbSuccess, cbFail) {
                return Request.post('auth/logout', {},
                    message => {
                        $rootScope.user = null;
                        $rootScope.loggedIn = false;
                        return cbSuccess(message);
                    }, (status, message) => cbFail(status, message));
            },

            register(parameters, cbSuccess, cbFail) {
                if (!parameters)
                    return;

                return Request.post('auth/register', parameters,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            checkEmail(email, cbSuccess, cbFail) {
                if (!email)
                    return;

                return Request.get('auth/valid', {email},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            verify(parameters, cbSuccess, cbFail) {
                if (!parameters)
                    return;
                return Request.post('auth/verify_email', parameters,
                    message => cbSuccess(message), (status, message, messageCode) => cbFail(status, message, messageCode));
            },

            requestPasswordReset(email, cbSuccess, cbFail) {
                return Request.post('auth/forgotten_password', {
                    email
                }, message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            submitPasswordReset(code, password, cbSuccess, cbFail) {
                return Request.post('auth/forgotten_password', {
                    code,
                    password
                }, message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            requestEmailResend(email, cbSuccess, cbFail) {
                return Request.post('auth/request_email', {
                    email
                }, message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            sessionValidate(callback) {
                if ($rootScope.loggedIn != null) return callback($rootScope.loggedIn);
                else {
                    return Request.get('user',
                        message => {
                            // $rootScope.user = message.data;
                            $rootScope.user = message.data;
                            if ($rootScope.drift) {
                                drift.identify($rootScope.user.email, {
                                    _id: $rootScope.user._id,
                                    scope: $rootScope.user.scope,
                                    mailing_list: $rootScope.user.mailing_list,
                                    verified: $rootScope.user.verified
                                });
                            }
                            $rootScope.loggedIn = true;
                            return callback(true);
                        }, (status, message) => callback(false));
                }
            }
        })]);
});
