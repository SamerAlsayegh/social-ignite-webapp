define(['./module'], function (services) {
    'use strict';
    services.factory('Alert', ['$http', '$cookies', '$state', '$rootScope', '$timeout', '$mdToast',
        function ($http, $cookies, $state, $rootScope, $timeout, $mdToast) {
            $rootScope.messages = [];
            $rootScope.active = false;

            var processQueue = function(){
                if ($rootScope.messages.length > 0 && $rootScope.active == false) {
                    $rootScope.active = true;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(($rootScope.messages[0].type == "info" ? 'Note: ' : ($rootScope.messages[0].type == 'warn' ? 'Oh snap! ' : '')) + $rootScope.messages[0].message)
                            .hideDelay($rootScope.messages[0].duration || 3000).toastClass($rootScope.messages[0].type)
                    ).then(function () {
                        $rootScope.messages.splice(0, 1);
                        $rootScope.active = false;
                        processQueue();
                    });
                }
            };

            return {
                success: function (message, duration) {
                    $rootScope.messages.push({
                        message: message,
                        duration: duration,
                        type: 'success'
                    });
                    processQueue();
                },
                info: function (message, duration) {
                    $rootScope.messages.push({
                        message: message,
                        duration: duration,
                        type: 'info'
                    });
                    processQueue();

                },
                error: function (message, duration) {
                    $rootScope.messages.push({
                        message: message,
                        duration: duration,
                        type: 'warn'
                    });
                    processQueue();
                }
            };
        }]);
});
