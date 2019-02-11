define(['./module'], services => {
    services.factory('Team', ['Request',
        Request => {
            return {
                getMembers(cbSuccess, cbFail) {
                    return Request.get('team',
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
                addMember(accountDetails, cbSuccess, cbFail) {
                    return Request.post('team/register', accountDetails,
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
                completeInvite(accountDetails, cbSuccess, cbFail) {
                    return Request.post('team/invite_complete', accountDetails,
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
                applyPermissions(memberId, permissions, cbSuccess, cbFail) {
                    return Request.post('team/' + memberId + "/permissions", {permissions},
                        message => cbSuccess(message), (status, message) => cbFail(status, message));
                },
            };
        }]);
});
