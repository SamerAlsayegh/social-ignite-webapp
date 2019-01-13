define(['../../module'], controllers => {
    return controllers.controller('socialStackDialogController', ['$rootScope', '$scope', 'SocialStacks', 'Alert', 'SocialAccounts', '$mdDialog', 'stackId', 'platforms', 'theme',
        function (
            $rootScope,
            $scope,
            SocialStacks,
            Alert,
            SocialAccounts,
            $mdDialog,
            stackId,
            platforms,
            theme
        ){
            $scope.platforms = platforms;
            $scope.selectedPages = [];
            $scope.theme = theme;
            $scope.allPages = $rootScope.allPages;

            $scope.deleteStack = () => {
                SocialStacks.deleteSocialStack(stackId, message => {
                    $mdDialog.hide({state: "DELETE", data: message});
                }, (status, message) => {
                    Alert.error(message);
                })
            };

            if (stackId) {
                SocialStacks.getSocialStack(stackId, true, data => {
                    $scope.data = data;
                    let socialPages = [];
                    for (let item = 0; item < data.pages.pages.length; item++)
                        socialPages.push(data.pages.pages[item]._id)
                    $scope.selectedPages = socialPages;
                }, (status, message) => {
                    Alert.error(message);
                });
            }



            $scope.submitPages = () => {
                if ($scope.data._id == null) {
                    SocialStacks.addSocialStack($scope.data.name,
                        $scope.selectedPages,
                        message => {
                            Alert.success("Successfully triggered update.");
                            $mdDialog.hide({state: "ADD", data: message});
                        }, (status, message) => {
                            Alert.error(message);
                        })
                } else {
                    SocialStacks.updateSocialStack($scope.data._id,
                        $scope.data.name,
                        $scope.selectedPages,
                        message => {
                            Alert.success("Successfully triggered update.");
                            $mdDialog.hide({state: "EDIT", data: message});
                        }, (status, message) => {
                            Alert.error(message);
                        })
                }
            };

            $scope.cancel = () => {
                $mdDialog.cancel();
            }

        }]);
});

