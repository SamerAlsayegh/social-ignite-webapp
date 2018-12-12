define(['./module'], services => {
    services.factory('PostComment', ['Request',
        Request => ({
            getReplies(parameters, cbSuccess, cbFail) {
                return Request.get('portal/replies' + Request.ArrayToURL(parameters),
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
