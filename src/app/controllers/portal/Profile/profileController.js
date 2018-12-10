define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('profileController', ['$rootScope', '$scope', 'Alert', 'Profile', '$stateParams', 'Billing',
        function ($rootScope, $scope, Alert, Profile, $stateParams, Billing) {
            $scope.updatingProfile = true;

            Profile.getUser(function (message) {
                $scope.updatingProfile = false;
                $scope.user = message.data;
            }, function (status, message) {
                $scope.updatingProfile = false;
                Alert.error("Failed to fetch latest profile information.");
            });
            $scope.themeBool = $scope.theme == "dark" ? true : false;
            $scope.tutorialBool = $scope.user.information.tutorial_step == 999 ? true : false;

            $scope.defaultTab = 0;

            if ($stateParams.tab != null) {
                if ($stateParams.tab == 'general')
                    $scope.defaultTab = 0;
                else if ($stateParams.tab == 'usages')
                    $scope.defaultTab = 1;
                else if ($stateParams.tab == 'advanced')
                    $scope.defaultTab = 2;
            }


            $scope.checkForm = function (profile) {
                return ((!profile.email.$dirty) && (!profile.mailing_list.$dirty) && (!profile.theme.$dirty) && (!profile.tutorial.$dirty) && (
                    !(profile.current_password.$dirty &&
                        profile.new_password.$dirty &&
                        profile.confirm_password.$dirty)
                )) || !profile.$valid;
            };

            $scope.updateUser = function (profile) {
                if (profile.$valid) {
                    var changed = {};
                    if (profile.email.$dirty && $scope.user.other_auth == null) {
                        changed.email = $scope.user.email;
                    }
                    if (profile.theme.$dirty) {
                        changed.theme = $scope.themeBool ? 'dark' : 'default';
                        $scope.user.options.theme = changed.theme;
                        $scope.setTheme(changed.theme);
                    }

                    if (profile.tutorial.$dirty) {
                        changed.tutorial_step = $scope.tutorialBool ? 999 : 0;
                        $scope.user.information.tutorial_step = changed.tutorial_step;
                    }


                    if (profile.mailing_list.$dirty) {
                        changed.mailing_list = $scope.user.mailing_list;
                    }
                    if (profile.current_password.$dirty && profile.new_password.$dirty && profile.confirm_password.$dirty && $scope.user.other_auth == null) {
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


            Billing.getPlan($scope.user.scope, function (planDetails) {
                $scope.planFeatures = planDetails.data;
            }, function (status, message) {
                Alert.error(message);
            })

        }]);


});

