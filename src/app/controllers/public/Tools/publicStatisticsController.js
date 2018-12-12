define(['../../module'], controllers => {
    return controllers.controller('publicStatisticsController', ['$scope', 'Alert', '$window', 'PublicStatistics',
        function ($scope, Alert, $window, PublicStatistics) {

            $scope.searchPublicAccounts = queryText => {
                let deferred = $q.defer();
                PublicStatistics.getAccounts(queryText, 1, data => {
                    deferred.resolve(data.data.accounts);
                }, (status, message) => {
                    Alert.error("Failed to get accounts");
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.selectPublicAccounts = publicAccount => {
                // $state.go('admin.user_management.user', {accountId: user._id})
            };


        }]);
});

