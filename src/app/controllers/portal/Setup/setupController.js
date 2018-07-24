define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('setupController', ['$scope', 'Alert', 'Billing', '$window', '$stateParams', 'Analytics',
        function ($scope, Alert, Billing, $window, $stateParams, Analytics) {
            let step = $stateParams.step;

            if (step == 1) {
                $scope.packages = [];
                Billing.getPlans(true, function (plans) {
                    $scope.packages = plans;
                }, function (status, message) {
                    Alert.error(message)
                });

                $scope.loading = false;

                $scope.subscribePackage = function (packageName) {
                    if ($scope.loading == false) {
                        $scope.loading = true;
                        Billing.subscribePlan(packageName, "paypal", function (message) {
                            $window.location.href = message;
                        }, function (status, message) {
                            $scope.loading = false;
                            Alert.error(message)
                        });
                        Analytics.trackEvent('billing', 'setup_start_plan', packageName);
                    }
                };
            } else if (step == 2){

            }
        }]);
});

