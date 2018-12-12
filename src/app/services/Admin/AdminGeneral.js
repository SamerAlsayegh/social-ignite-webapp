define(['../module'], services => {
    services.factory('AdminGeneral', ['Request',
        Request => ({
            getNotifications(cbSuccess, cbFail) {
                return Request.get('admin/notifications',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
