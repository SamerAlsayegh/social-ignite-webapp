define(['./module'], services => {
    services.factory('Alert', ['$rootScope', '$timeout', '$mdToast',
        ($rootScope, $timeout, $mdToast) => {
            $rootScope.messages = [];
            $rootScope.active = false;

            let processQueue = () => {

                $mdToast.hide();

                if ($rootScope.messages.length > 0 && $rootScope.active === false) {
                    $rootScope.active = true;

                    $mdToast.show(
                        $mdToast.simple()
                            .textContent($rootScope.messages[0].message)
                            .hideDelay($rootScope.messages[0].duration || 2000).toastClass($rootScope.messages[0].type)
                    ).then(() => {
                        $rootScope.messages.splice(0, 1);
                        $rootScope.active = false;
                        processQueue();
                    });
                }
            };

            return {
                success(message, duration) {
                    $rootScope.messages.push({
                        message,
                        duration,
                        type: 'success'
                    });
                    processQueue();
                },
                info(message, duration) {
                    $rootScope.messages.push({
                        message,
                        duration,
                        type: 'info'
                    });
                    processQueue();

                },
                error(message, duration) {
                    $rootScope.messages.push({
                        message,
                        duration,
                        type: 'warn'
                    });
                    processQueue();
                }
            };
        }]);
});
