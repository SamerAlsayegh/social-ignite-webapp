define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('billingController', ['$scope', 'Alert', '$mdDialog', 'Billing', '$window',
        function ($scope, Alert, $mdDialog, Billing, $window) {
            $scope.packages = [];
            Billing.getPlans(function (plans) {
                $scope.packages = plans.data;
                console.log(plans)
            }, function (status, message) {
                Alert.error(message)
            });


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
