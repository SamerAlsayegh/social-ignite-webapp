define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('publicStatisticsController', ['$scope', 'Alert', '$window', 'PublicStatistics',
        function ($scope, Alert, $window, PublicStatistics) {

            $scope.searchPublicAccounts = function (queryText) {
                let deferred = $q.defer();
                PublicStatistics.getAccounts(queryText, 1, function (data) {
                    deferred.resolve(data.data.accounts);
                }, function (status, message) {
                    Alert.error("Failed to get accounts");
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.selectPublicAccounts = function (publicAccount) {
                // $state.go('admin.user_management.user', {accountId: user._id})
            };


        }]);
});

