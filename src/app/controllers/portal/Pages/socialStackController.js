define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('socialStackController', ['$rootScope', '$scope', 'SocialStacks', 'Alert', 'SocialAccounts', '$mdDialog',
        function ($rootScope, $scope, SocialStacks, Alert, SocialAccounts, $mdDialog) {
            $scope.socialPlatforms = platforms;
            $scope.step = 1;
            $scope.data = {
                socialPages: []
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

            $scope.addStack = function () {
                $scope.step = 3;
                $scope.add = true;
                $scope.edit = false;

            };
            $scope.editStack = function () {
                $scope.step = 2;
                $scope.edit = true;
                $scope.add = false;
            };

            $scope.deleteStack = function(_id){
              SocialStacks.deleteSocialStack(_id, function (message) {
                  $mdDialog.hide();
              }, function (status, message) {
                  Alert.error(message);
              })
            };
            $scope.socialStackEdit = function () {
                $scope.edit = !$scope.edit;
            };
            $scope.editSocialStack = function (_id) {
                if ($scope.edit && _id) {
                    SocialStacks.getSocialStack(_id, true, function (data) {
                        $scope.data = data.stack;
                        var socialPages = [];
                        for (var item = 0; item < data.results.length; item++)
                            socialPages.push(data.results[item]._id)
                        $scope.step = 3;
                        $scope.data.socialPages = socialPages;
                    }, function (status, message) {
                        Alert.error(message);
                    });
                }
            };
            SocialAccounts.getSocialAccounts(null, null, function (data) {
                $scope.allPages = [];
                for (let index in data.pages) {
                    if (data.pages[index].platform != 4)
                        $scope.allPages.push(data.pages[index]);
                }

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
                        $scope.data.description,
                        $scope.data.socialPages,
                        function (message) {
                            Alert.success("Successfully triggered update.");
                            $mdDialog.hide();
                        }, function (status, message) {
                            Alert.error(message);
                        })
                } else {
                    SocialStacks.updateSocialStack($scope.data._id,
                        $scope.data.name,
                        $scope.data.description,
                        $scope.data.socialPages,
                        function (message) {
                            Alert.success("Successfully triggered update.");
                            $mdDialog.hide();
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

