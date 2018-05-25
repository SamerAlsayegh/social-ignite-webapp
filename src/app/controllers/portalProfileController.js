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

            $scope.checkForm = function(profile){
                return ((!profile.email.$dirty) && (!profile.mailing_list.$dirty) && (
                    !(profile.current_password.$dirty &&
                        profile.new_password.$dirty &&
                        profile.confirm_password.$dirty)
                )) || !profile.$valid;
            };


            $scope.updateUser = function (profile) {
                console.log(profile);
                if (profile.$valid) {
                    var changed = {};
                    if (profile.email.$dirty) {
                        changed.email = profile.email.$modelValue;
                    }
                    if (profile.mailing_list.$dirty) {
                        changed.mailing_list = profile.mailing_list.$modelValue;
                    }
                    if (profile.current_password.$dirty && profile.new_password.$dirty && profile.confirm_password.$dirty) {
                        if (profile.new_password.$modelValue == profile.confirm_password.$modelValue
                            && profile.new_password.$modelValue.length > 0
                            && profile.current_password.$modelValue.length > 0
                        ) {
                            changed.new_password = profile.new_password.$modelValue;
                            changed.current_password = profile.current_password.$modelValue;
                        }
                    }

                    Auth.updateUser(changed, function (message) {
                        console.log(message);
                        if (message.email) {
                            Alert.success("Please open the link sent to " + changed.email)
                        } else {
                            Alert.success("Your settings have been updated.")
                        }
                        profile.$setPristine();
                    }, function (status, message) {
                        Alert.error("Failed to update user info. " + message);
                    });
                }
            };
        }]);


});

