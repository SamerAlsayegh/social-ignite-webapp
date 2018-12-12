define(['./module'], services => {
    services.factory('General', ['Request',
        Request => ({
            getNotifications(cbSuccess, cbFail) {
                return Request.get('notifications',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
