define(['../../module'], controllers => {
    return controllers.controller('socialStackDialogController', ['$rootScope', '$scope', 'SocialStacks', 'Alert', 'SocialAccounts', '$mdDialog', 'stackId', 'platforms',
        function (
            $rootScope,
            $scope,
            SocialStacks,
            Alert,
            SocialAccounts,
            $mdDialog,
            stackId,
            platforms
        ){
            $scope.platforms = platforms;
            $scope.data = {
                socialPages: []
            };

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
                    $scope.data.socialPages = socialPages;
                }, (status, message) => {
                    Alert.error(message);
                });
            }


            SocialAccounts.getSocialAccounts(null, null, data => {
                $scope.allPages = data.pages;
            }, (status, message) => {
                Alert.error(message);
            });

            $scope.togglePage = socialPageId => {
                if ($scope.data.socialPages.indexOf(socialPageId) === -1)
                    $scope.data.socialPages.push(socialPageId);
                else
                    $scope.data.socialPages.splice($scope.data.socialPages.indexOf(socialPageId), 1);
            };

            $scope.submitPages = () => {
                if ($scope.data._id == null) {
                    SocialStacks.addSocialStack($scope.data.name,
                        $scope.data.socialPages,
                        message => {
                            Alert.success("Successfully triggered update.");
                            $mdDialog.hide({state: "ADD", data: message});
                        }, (status, message) => {
                            Alert.error(message);
                        })
                } else {
                    SocialStacks.updateSocialStack($scope.data._id,
                        $scope.data.name,
                        $scope.data.socialPages,
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

