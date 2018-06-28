define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('billingController', ['$scope', 'Alert', '$mdDialog', 'Billing', '$window',
        function ($scope, Alert, $mdDialog, Billing, $window) {
            $scope.packages = [];
            $scope.transactions = [];
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
                        $scope.loading = false;
                        $window.location.href = message;
                    }, function (status, message) {
                        $scope.loading = false;
                        Alert.error(message)
                    })
                }
            };

            $scope.cancelSubscription = function () {
                Billing.cancelSubscription(function (message) {
                    Alert.success("Subscription has been cancelled on the next billing cycle.");
                    Billing.getSubscription(function (subscriptionData) {
                        $scope.subscription = subscriptionData.data;
                    }, function (status, message) {
                        Alert.error(message)
                    });
                }, function (status, message) {
                    Alert.error(message)
                })
            }

        }]);
});

