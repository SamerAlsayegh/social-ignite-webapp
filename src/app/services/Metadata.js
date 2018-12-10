define(['./module'], function (services) {
    'use strict';
    services.factory('Metadata', ['Request', '$rootScope',
        function (Request, $rootScope) {
            return {
                updateMetadata: function (cbSuccess, cbFail) {
                    return Request.get('metadata',
                        function (message) {
                            $rootScope.errorCodes = message.data.errorCodes;
                            $rootScope.platforms = message.data.platforms;
                            $rootScope.platformErrors = message.data.platformErrors;
                            if (cbSuccess) return cbSuccess(true);
                        }, function (status, message) {
                            if (cbFail) return cbFail(status, message);
                        });
                },
            };
        }]);
});
