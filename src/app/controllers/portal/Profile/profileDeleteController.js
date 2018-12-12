define(['../../module'], controllers => {
    return controllers.controller('profileDeleteController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'Alert', 'Profile', 'Auth',
        function ($rootScope, $scope, $state, $stateParams, Alert, Profile, Auth) {
            $scope.code = $stateParams.code;

            $scope.confirmDelete = () => {
                Alert.success("Account has been deleted.");
                Profile.deleteUserComplete($scope.code, message => {
                    Auth.logout(() => {
                        $state.go('public.login', {}, {reload: true})
                    }, (status, message) => {
                        Alert.error(message);
                    });
                }, (status, message) => {
                    Alert.error(message);
                });

            };
            $scope.confirmDelete();
        }]);
});

