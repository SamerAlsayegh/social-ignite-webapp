define(['../../module'], controllers => {
    return controllers.controller('billingController', ['$scope', 'Alert', '$mdDialog', 'Billing', '$window', '$stateParams', 'Analytics',
        function ($scope, Alert, $mdDialog, Billing, $window, $stateParams, Analytics) {
            $scope.setPage('Billing');

            $scope.packages = [];
            $scope.transactions = [];
            $scope.chosenPackage = $stateParams.package;
            $scope.isPending = $stateParams.pending;

            $scope.transactionModel = {
                selected: [],
                order: null,
                limit: 10,
                page: 1
            };
            $scope.defaultTab = 0;

            if ($stateParams.tab != null) {
                if ($stateParams.tab === 'active')
                    $scope.defaultTab = 0;
                else if ($stateParams.tab === 'packages')
                    $scope.defaultTab = 1;
                else if ($stateParams.tab === 'transactions')
                    $scope.defaultTab = 2;
            }

            Billing.getPlans(false, plans => {
                $scope.packages = plans;
            }, (status, message) => {
                Alert.error(message)
            });


            $scope.loadTransactions = (sortOrder, page, limit) => {
                Billing.getTransactions(sortOrder, page, limit, message => {
                    $scope.transactions = message.data;
                    $scope.transactionModel.page = $scope.transactions.page;
                }, (status, message) => {
                    Alert.error(message);
                });
            };
            $scope.paginateTransactions = (page, limit) => {
                $scope.loadTransactions($scope.transactionModel.sort, page, limit);
            };


            Billing.getSubscription(subscriptionData => {
                $scope.subscription = subscriptionData.data;
            }, (status, message) => {
                Alert.error(message)
            });

            $scope.loadTransactions();

            $scope.loading = false;

            $scope.subscribePackage = packageName => {
                if ($scope.loading === false) {
                    $scope.loading = true;
                    Analytics.trackEvent('billing', 'start_plan', packageName);
                    $window.open(__API__ + '/api/v1/payment/subscription/' + packageName + '/paypal', '_self');
                }
            };

            $scope.cancelSubscription = () => {
                $scope.cancellingSubscription = true;
                Billing.cancelSubscription(message => {
                    $scope.cancellingSubscription = false;
                    Alert.success("Subscription has been cancelled on the next billing cycle.");
                    Billing.getSubscription(subscriptionData => {
                        $scope.subscription = subscriptionData.data;
                    }, (status, message) => {
                        Alert.error(message)
                    });
                    Analytics.trackEvent('billing', 'cancel_plan', $scope.subscription.package);
                }, (status, message) => {
                    $scope.cancellingSubscription = false;
                    Alert.error(message)
                })
            };


            $scope.redeemCode = (codeForm) => {
                Billing.redeemCode()
            };


            if ($scope.chosenPackage != null) {
                $scope.subscribePackage($scope.chosenPackage);
            }
        }]);
});

