define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('profileController', ['$rootScope', '$scope', 'Alert', 'Profile',
        function ($rootScope, $scope, Alert, Profile) {

            $scope.themeBool = $scope.theme == "dark" ? true : false;


            $scope.checkForm = function (profile) {
                return ((!profile.email.$dirty) && (!profile.mailing_list.$dirty) && (!profile.theme.$dirty) && (
                    !(profile.current_password.$dirty &&
                        profile.new_password.$dirty &&
                        profile.confirm_password.$dirty)
                )) || !profile.$valid;
            };

            $scope.updateUser = function (profile) {
                if (profile.$valid) {
                    var changed = {};
                    if (profile.email.$dirty) {
                        changed.email = $scope.user.email;
                    }
                    if (profile.theme.$dirty) {
                        changed.theme = $scope.themeBool ? 'dark' : 'default';
                        $scope.user.options.theme = changed.theme;
                        $scope.setTheme(changed.theme);
                    }
                    if (profile.mailing_list.$dirty) {
                        changed.mailing_list = $scope.user.mailing_list;
                    }
                    if (profile.current_password.$dirty && profile.new_password.$dirty && profile.confirm_password.$dirty) {
                        if ($scope.new_password == $scope.confirm_password
                            && $scope.new_password.length > 0
                            && $scope.current_password.length > 0
                        ) {
                            changed.new_password = $scope.new_password;
                            changed.current_password = $scope.current_password;
                        }
                    }

                    Profile.updateUser(changed, function (message) {
                        if (message.email) {
                            Alert.success("Please open the link sent to " + changed.email)
                        } else {
                            Alert.success("Your settings have been updated.")
                        }
                        profile.$setPristine();
                        profile.$setUntouched();
                        if (message.password) {
                            $scope.current_password = "";
                            $scope.new_password = "";
                            $scope.confirm_password = "";
                        }
                    }, function (status, message) {
                        Alert.error("Failed to update user info. " + message);
                    });
                }
            };

            $scope.deleteAccount = function () {
                Profile.deleteUser(function (data) {
                    Alert.success("Check your email for instructions.");
                }, function (status, message) {
                    Alert.error(message);
                })
            };


        }]);


});

