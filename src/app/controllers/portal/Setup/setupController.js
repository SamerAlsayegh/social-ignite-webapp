define(['../../module'], controllers => {
    return controllers.controller('setupController', ['$scope', 'Alert', 'Billing', '$window', '$stateParams', 'Analytics',
        ($scope, Alert, Billing, $window, $stateParams, Analytics) => {
            let step = $stateParams.step;

            if (step === 1) {
                $scope.packages = [];
                Billing.getPlans(true, plans => {
                    $scope.packages = plans;
                }, (status, message) => {
                    Alert.error(message)
                });

                $scope.loading = false;

                $scope.subscribePackage = packageName => {
                    if ($scope.loading === false) {
                        $scope.loading = true;
                        Billing.subscribePlan(packageName, "paypal", message => {
                            $window.location.href = message;
                        }, (status, message) => {
                            $scope.loading = false;
                            Alert.error(message)
                        });
                        Analytics.trackEvent('billing', 'setup_start_plan', packageName);
                    }
                };
            } else if (step === 2) {

            }
        }]);
});

