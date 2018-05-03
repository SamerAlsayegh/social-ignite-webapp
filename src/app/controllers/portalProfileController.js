/**
 * Created by Samer on 2015-09-14.
 */
define(['./module', '../enums/platforms', '../enums/errorCodes'], function (controllers, platforms, errorCodes) {
    'use strict';
    return controllers.controller('portalProfileController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'SocialAccounts', '$mdDialog', '$q', 'moment', '$timeout', '$window', 'Alert', 'Auth',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, SocialAccounts, $mdDialog, $q, moment, $timeout, $window, Alert, Auth) {
            $scope.detailsChanged = {};

            Auth.getUser(function (message) {
                $scope.user = message.data;
                console.log($scope.user)
            }, function (status, message) {
                Alert.error("Failed to load user info.");
            });

            $scope.updateUser = function () {
                var changed = {};
                if ($scope.detailsChanged.email) {
                    changed.email = $scope.user.email;
                }
                if ($scope.detailsChanged.mailing_list) {
                    changed.mailing_list = $scope.user.mailing_list;
                }

                Auth.updateUser(changed, function (message) {
                    console.log(message);
                    if (message.email){
                       Alert.success("Please open the link sent to " + changed.email)
                    } else {
                        Alert.success("Your settings have been updated.")
                    }
                    $scope.detailsChanged = {};
                }, function (status, message) {
                    Alert.error("Failed to update user info. " + message);
                });

            };
        }]);


});

