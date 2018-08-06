define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('pageStatisticsController', ['$scope', '$stateParams', 'Alert', 'SocialAccounts',
        function ($scope, $stateParams, Alert, SocialAccounts) {
            $scope.socialPages = [];

            SocialAccounts.getSocialAccounts(null, null, function (data) {
                $scope.socialPages = data.pages;
            }, function (status, message) {
                Alert.error(message);
            });

        }]);
});

