define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('billingController', ['$scope', 'Alert', '$mdDialog', 'Billing', '$window', '$stateParams', 'Analytics',
        function ($scope, Alert, $mdDialog, Billing, $window, $stateParams, Analytics) {
            $scope.packages = [];
            $scope.transactions = [];
            $scope.chosenPackage = $stateParams.package;
            $scope.transactionModel = {
                selected: [],
                order: null,
                limit: 10,
                page: 1
            };
            $scope.defaultTab = 0;

            if ($stateParams.tab != null){
                if ($stateParams.tab == 'active')
                    $scope.defaultTab = 0;
                else if ($stateParams.tab == 'packages')
                    $scope.defaultTab = 1;
                else if ($stateParams.tab == 'transactions')
                    $scope.defaultTab = 2;
            }
            console.log($stateParams.tab, $scope.defaultTab);





            Billing.getPlans(false, function (plans) {
                $scope.packages = plans;
            }, function (status, message) {
                Alert.error(message)
            });


            $scope.loadTransactions = function (sortOrder, page, limit) {
                Billing.getTransactions(sortOrder, page, limit, function (message) {
                    $scope.transactions = message.data;
                    $scope.transactionModel.page = $scope.transactions.page;
                }, function (status, message) {
                    Alert.error(message);
                });
            };
            $scope.paginateTransactions = function(page, limit) {
                $scope.loadTransactions($scope.transactionModel.sort, page, limit);
            };
            $scope.loadTransactions();




            Billing.getSubscription(function (subscriptionData) {
                $scope.subscription = subscriptionData.data;
            }, function (status, message) {
                Alert.error(message)
            });


            $scope.loading = false;

            $scope.subscribePackage = function (packageName) {
                if ($scope.loading == false) {
                    $scope.loading = true;
                    Analytics.trackEvent('billing', 'start_plan', packageName);
                    $window.open(__API__ + '/api/v1/payment/subscription/' + packageName + '/paypal', '_self');
                }
            };

            $scope.cancelSubscription = function () {
                $scope.cancellingSubscription = true;
                Billing.cancelSubscription(function (message) {
                    $scope.cancellingSubscription = false;
                    Alert.success("Subscription has been cancelled on the next billing cycle.");
                    Billing.getSubscription(function (subscriptionData) {
                        $scope.subscription = subscriptionData.data;
                    }, function (status, message) {
                        Alert.error(message)
                    });
                    Analytics.trackEvent('billing', 'cancel_plan', $scope.subscription.package);
                }, function (status, message) {
                    $scope.cancellingSubscription = false;
                    Alert.error(message)
                })
            }


            if ($scope.chosenPackage != null){
                $scope.subscribePackage($scope.chosenPackage);
            }
        }]);
});

