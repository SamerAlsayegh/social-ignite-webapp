define(['./module'], services => {
    services.factory('Profile', ['Request',
        Request => ({
            getUser(cbSuccess, cbFail) {
                return Request.get('user',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            updateUser(parameters, cbSuccess, cbFail) {
                if (!parameters)
                    return;

                return Request.post('user', parameters,
                    message => cbSuccess(message), (status, message, messageCode) => cbFail(status, message, messageCode));
            },

            getPermissions(cbSuccess, cbFail) {
                return Request.get('user/permissions',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            deleteUser(cbSuccess, cbFail) {
                return Request.post('user/delete', {},
                    message => cbSuccess(message), (status, message, messageCode) => cbFail(status, message, messageCode));
            },

            deleteUserComplete(code, cbSuccess, cbFail) {
                return Request.post('user/delete/complete', {code},
                    message => cbSuccess(message), (status, message, messageCode) => cbFail(status, message, messageCode));
            }
        })]);
});
