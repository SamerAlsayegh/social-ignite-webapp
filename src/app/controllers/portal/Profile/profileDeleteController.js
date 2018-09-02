define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('profileDeleteController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'Alert', 'Profile', 'Auth',
        function ($rootScope, $scope, $state, $stateParams, Alert, Profile, Auth) {
            $scope.code = $stateParams.code;

            $scope.confirmDelete = function () {
                Alert.success("Account has been deleted.");
                Profile.deleteUserComplete($scope.code, function (message) {
                    Auth.logout(function () {
                        $state.go('public.login', {}, {reload: true})
                    }, function (status, message) {
                        Alert.error(message);
                    });
                }, function (status, message) {
                    Alert.error(message);
                });

            };
            $scope.confirmDelete();
        }]);
});

