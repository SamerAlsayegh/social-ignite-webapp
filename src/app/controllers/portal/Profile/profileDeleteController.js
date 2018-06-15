define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('profileDeleteController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'Alert', 'Auth',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, Alert, Auth) {
            $scope.code = $stateParams.code;

            $scope.confirmDelete = function () {
                console.log($scope.code);
                Alert.success("Account has been deleted.");
                Auth.deleteUserComplete($scope.code, function (message) {
                    Auth.logout(function () {
                        $state.go('public.feedback.view', {}, {reload: true})
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

