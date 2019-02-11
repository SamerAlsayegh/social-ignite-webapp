define(['../../module'], controllers => {
    return controllers.controller('adminUsersSubController', ['$scope', '$stateParams', 'Alert', '$state', 'AdminAccount',
        function ($scope, $stateParams, Alert, $state, AdminAccount) {
            $scope.accountId = $stateParams.accountId;
            $scope.today = new Date();
            $scope.transactions = [];
            $scope.transactionModel = {
                selected: [],
                order: null,
                limit: 10,
                page: 1
            };


            if ($scope.accountId != null) {
                AdminAccount.getAccount($scope.accountId, data => {
                    $scope.account = data.data.user;
                    $scope.used = data.data.used;
                    $scope.limits = data.data.limits;
                }, (status, message) => {
                    Alert.error(message);
                });

                $scope.checkForm = profile => !profile.$dirty && profile.$valid;

                // $scope.checkForm = profile => ((!profile.email.$dirty) && (!profile.mailing_list.$dirty) && (!profile.tutorial.$dirty) && (
                //     !(profile.new_password.$dirty &&
                //         profile.confirm_password.$dirty)
                // )) || !profile.$valid;


                $scope.updateUser = profile => {

                    if (profile.$valid) {
                        let changed = {};
                        if (profile.email.$dirty) {
                            changed.email = $scope.account.email;
                        }
                        if (profile.mailing_list.$dirty) {
                            changed.mailing_list = $scope.account.mailing_list;
                        }


                        if (profile.new_password.$dirty && profile.confirm_password.$dirty) {
                            if ($scope.new_password === $scope.confirm_password
                                && $scope.new_password.length > 0
                            ) {
                                changed.new_password = profile.new_password.$modelValue;
                            }
                        }

                        AdminAccount.updateAccount($scope.accountId, changed, message => {
                            Alert.success("This users settings have been updated.");
                            profile.$setPristine();
                            profile.$setUntouched();
                            if (message.password) {
                                $scope.new_password = "";
                                $scope.confirm_password = "";
                            }
                        }, (status, message) => {
                            Alert.error("Failed to update user info. " + message);
                        });
                    }
                };

                $scope.updateRole = role_form => {
                    if (role_form.$valid) {
                        AdminAccount.updateRole($scope.accountId, $scope.account.role, $scope.account.expiry, message => {
                            Alert.success("This user's role has been updated.");
                            role_form.$setPristine();
                            role_form.$setUntouched();
                        }, (status, message) => {
                            Alert.error("Failed to update user role. " + message);
                        });
                    }
                };

                $scope.deleteAccount = () => {
                    AdminAccount.deleteAccount($scope.accountId, message => {
                        $state.go('admin.user_management.home')
                    }, (status, message) => {
                        Alert.error("Failed to delete user. " + message);
                    })
                };

                $scope.loadTransactions = (sortOrder, page, limit) => {
                    AdminAccount.getTransactions($scope.accountId, sortOrder, page, limit, message => {
                        $scope.transactions = message.data;
                        $scope.transactionModel.page = $scope.transactions.page;
                    }, (status, message) => {
                        Alert.error(message);
                    });
                };
                $scope.paginateTransactions = (page, limit) => {
                    $scope.loadTransactions($scope.transactionModel.sort, page, limit);
                };
                $scope.loadTransactions();
            }


        }]);
});

