define(['./module'], services => {
    services.factory('Metadata', ['Request', '$rootScope',
        (Request, $rootScope) => ({
            updateMetadata(cbSuccess, cbFail) {
                return Request.get('metadata',
                    message => {
                        $rootScope.errorCodes = message.data.errorCodes;
                        $rootScope.platforms = message.data.platforms;
                        $rootScope.platformErrors = message.data.platformErrors;
                        if (cbSuccess) return cbSuccess(true);
                    }, (status, message) => {
                        if (cbFail) return cbFail(status, message);
                    });
            }
        })]);
});
