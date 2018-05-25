define(['./../module', '../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('adminUsersController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'moment', '$timeout', 'Alert', 'AdminAccount', '$q',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, moment, $timeout, Alert, AdminAccount, $q) {

            $scope.searchUsers = function (queryText) {
                let deferred = $q.defer();
                AdminAccount.getAccounts(queryText, 1, function (data) {
                    deferred.resolve(data.data.accounts);
                }, function (status, message) {
                    Alert.error("Failed to get accounts");
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.selectedUser = function(user){
                $state.go('admin.user_management.user', {userId: user._id})
            };

            AdminAccount.getAccounts(null, 1, function (data) {
                $scope.usersOnPage = data.data.accounts;
            }, function (status, message) {
                Alert.error("Failed to get accounts");
            });


        }]);
});

