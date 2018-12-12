define(['../../module'], controllers => {
    return controllers.controller('pageStatisticsController', ['$scope', '$stateParams', 'Alert', 'SocialAccounts',
        function ($scope, $stateParams, Alert, SocialAccounts) {
            $scope.socialPages = [];

            SocialAccounts.getSocialAccounts(null, null, data => {
                $scope.socialPages = data.pages;
            }, (status, message) => {
                Alert.error(message);
            });

        }]);
});

