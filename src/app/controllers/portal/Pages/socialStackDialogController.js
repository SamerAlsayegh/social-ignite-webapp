define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('socialStackDialogController', ['$rootScope', '$scope', 'SocialStacks', 'Alert', 'SocialAccounts', '$mdDialog', 'stackId', 'platforms',
        function ($rootScope, $scope, SocialStacks, Alert, SocialAccounts, $mdDialog, stackId, platforms) {
            $scope.platforms = platforms;
            $scope.data = {
                socialPages: []
            };

            $scope.deleteStack = function () {
                SocialStacks.deleteSocialStack(stackId, function (message) {
                    $mdDialog.hide({state: "DELETE", data: message});
                }, function (status, message) {
                    Alert.error(message);
                })
            };

            if (stackId) {
                SocialStacks.getSocialStack(stackId, true, function (data) {
                    $scope.data = data;
                    var socialPages = [];
                    for (var item = 0; item < data.pages.pages.length; item++)
                        socialPages.push(data.pages.pages[item]._id)
                    $scope.data.socialPages = socialPages;
                }, function (status, message) {
                    Alert.error(message);
                });
            }


            SocialAccounts.getSocialAccounts(null, null, function (data) {
                $scope.allPages = data.pages;
            }, function (status, message) {
                Alert.error(message);
            });

            $scope.togglePage = function (socialPageId) {
                if ($scope.data.socialPages.indexOf(socialPageId) == -1)
                    $scope.data.socialPages.push(socialPageId);
                else
                    $scope.data.socialPages.splice($scope.data.socialPages.indexOf(socialPageId), 1);
            };

            $scope.submitPages = function () {
                if ($scope.data._id == null) {
                    SocialStacks.addSocialStack($scope.data.name,
                        $scope.data.socialPages,
                        function (message) {
                            Alert.success("Successfully triggered update.");
                            $mdDialog.hide({state: "ADD", data: message});
                        }, function (status, message) {
                            Alert.error(message);
                        })
                } else {
                    SocialStacks.updateSocialStack($scope.data._id,
                        $scope.data.name,
                        $scope.data.socialPages,
                        function (message) {
                            Alert.success("Successfully triggered update.");
                            $mdDialog.hide({state: "EDIT", data: message});
                        }, function (status, message) {
                            Alert.error(message);
                        })
                }
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            }

        }]);
});

