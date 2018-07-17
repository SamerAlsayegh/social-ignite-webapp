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




            Billing.getPlans(function (plans) {
                $scope.packages = plans.data;
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
                    Billing.subscribePlan(packageName, "paypal", function (message) {
                        $window.location.href = message;
                    }, function (status, message) {
                        $scope.loading = false;
                        Alert.error(message)
                    });
                    Analytics.trackEvent('billing', 'start_plan', packageName);
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

