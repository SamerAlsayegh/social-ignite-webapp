define(['./../module'], controllers => {
    return controllers.controller('adminUsersController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'moment', '$timeout', 'Alert', 'AdminAccount', '$q',
        function (
            $rootScope,
            $scope,
            $http,
            $cookies,
            $location,
            $state,
            $stateParams,
            moment,
            $timeout,
            Alert,
            AdminAccount,
            $q
        ){

            $scope.page = 1;
            $scope.pages = 1;

            $scope.pagesList = [];

            $scope.searchUsers = queryText => {
                let deferred = $q.defer();
                AdminAccount.getAccounts(queryText, 1, data => {
                    deferred.resolve(data.data.accounts);
                }, (status, message) => {
                    Alert.error("Failed to get accounts");
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.selectedUser = user => {
                $state.go('admin.user_management.user', {accountId: user._id})
            };


            $scope.loadUsers = page => {
                if (page > 0) {
                    AdminAccount.getAccounts(null, page, data => {
                        $scope.usersOnPage = data.data.accounts;
                        $scope.page = data.data.page;
                        $scope.pages = data.data.pages;
                        $scope.pagesList = [];
                        if ($scope.page !== 1)
                            $scope.pagesList.push({name: "1" + ($scope.page !== 1 ? '...' : ''), page: 1});


                        if ($scope.page > 1)
                            $scope.pagesList.push({name: "<", page: $scope.page - 1});

                        $scope.pagesList.push({name: $scope.page});


                        if ($scope.page < $scope.pages)
                            $scope.pagesList.push({name: ">", page: $scope.page + 1});


                        if ($scope.pages !== $scope.page)
                            $scope.pagesList.push({
                                name: ($scope.page !== $scope.pages ? '...' : '') + $scope.pages,
                                page: $scope.pages
                            });

                    }, (status, message) => {
                        Alert.error("Failed to get accounts");
                    });
                }
            };

            $scope.loadUsers(1);

        }]);
});

