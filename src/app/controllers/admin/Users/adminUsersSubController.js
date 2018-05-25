define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('adminUsersSubController', ['$scope', '$stateParams', 'Alert', '$state', 'AdminAccount',
        function ($scope, $stateParams, Alert, $state, AdminAccount) {
            $scope.accountId = $stateParams.accountId;
            $scope.today = new Date();

            if ($scope.accountId != null) {
                AdminAccount.getAccount($scope.accountId, function (data) {
                    $scope.account = data.data;
                }, function (status, message) {
                    Alert.error(message);
                })
            }




        }]);
});

