define(['../../module'], controllers => {
    return controllers.controller('socialStackController', ['$rootScope', '$scope', 'SocialStacks', 'Alert', 'SocialAccounts', '$mdDialog',
        function($rootScope, $scope, SocialStacks, Alert, SocialAccounts, $mdDialog) {
            $scope.socialStacks = [];
            $scope.stacksModel = {
                order: null,
                selected: [],
            };

            $scope.data = {
                socialPages: []
            };
            $scope.$on('addStack', () => {
                $scope.addStack();
            });
            $scope.editSocialStack = stackId => {
                $mdDialog.show({
                    locals: {stackId, platforms: $scope.platforms},
                    controller: 'socialStackDialogController',
                    template: require("compile-ejs-loader!views/_portal/accounts/_socialStacksDialog.ejs")(),
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                    .then(message => {
                        switch (message.state) {
                            case 'ADD':
                                $scope.loadSocialStacks();
                                break;
                            case 'EDIT':
                                $scope.loadSocialStacks();
                                break;
                            case 'DELETE':
                                for (let i = 0; i < $scope.socialStacks.length; i++) {
                                    if ($scope.socialStacks[i]._id === stackId) {
                                        $scope.socialStacks.splice(i, 1);
                                    }
                                }
                                break;
                        }


                    }, () => {

                    });
            };


            $scope.loadSocialStacks = () => {
                SocialStacks.getSocialStacks(true, true, 1, data => {
                    $scope.socialStacks = data;
                }, (status, message) => {
                    Alert.error(message);
                })
            };
            $scope.loadSocialStacks();


        }]);
});

