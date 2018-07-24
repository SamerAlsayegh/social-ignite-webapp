define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('socialStackController', ['$rootScope', '$scope', 'SocialStacks', 'Alert', 'SocialAccounts', '$mdDialog',
        function ($rootScope, $scope, SocialStacks, Alert, SocialAccounts, $mdDialog) {
            $scope.socialStacks = [];
            $scope.data = {
                socialPages: []
            };
            $scope.$on('addStack', function () {
                $scope.addStack();
            });
            $scope.editSocialStack = function (ev, stackId) {
                $mdDialog.show({
                    locals:{stackId: stackId},
                    controller: 'socialStackDialogController',
                    templateUrl: './_portal/accounts/_socialStacksDialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                    .then(function (message) {
                        switch (message.state){
                            case 'ADD':
                                $scope.loadSocialStacks();
                                break;
                            case 'EDIT':
                                $scope.loadSocialStacks();
                                break;
                            case 'DELETE':
                                for (var i = 0; i < $scope.socialStacks.length; i++){
                                    if ($scope.socialStacks[i]._id == stackId){
                                        $scope.socialStacks.splice(i, 1);
                                    }
                                }
                                break;
                        }



                    }, function () {

                    });
            };


            $scope.loadSocialStacks = function () {
                SocialStacks.getSocialStacks(true, true, 1, function (data) {
                    $scope.socialStacks = data;
                    console.log($scope.socialStacks);
                }, function (status, message) {
                    Alert.error(message);
                })
            };
            $scope.loadSocialStacks();


        }]);
});

