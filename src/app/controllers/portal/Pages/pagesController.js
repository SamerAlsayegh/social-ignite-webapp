define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('pagesController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'SocialAccounts', '$mdDialog', 'moment', '$window', 'Alert',
        function ($rootScope, $scope,
                  $state, $stateParams, SocialAccounts, $mdDialog, moment, $window, Alert) {

            if ($stateParams.fail != null) {
                Alert.error("Failed to register. " + $scope.errorCodes[$stateParams.fail].detail, 4000);
                $state.go($state.current.name, {fail: null}, {reload: true});
            }


            $rootScope.allPages = [];
            $scope.platformFilter = null;
            $scope.socialPlatformDetails = [];
            $scope.pagesModel = {
                order: null,
                selected: [],
            };

            $scope.past5Minutes = new Date(new Date().getTime() - (1000 * 60 * 5));


            $scope.updatedRecently = function (itemUpdated) {
                return new Date(itemUpdated).getTime() < $scope.past5Minutes.getTime();
            };
            for (var platformKey in $scope.platforms) {
                if (parseInt(platformKey) == platformKey) {
                    $scope.socialPlatformDetails.push({
                        id: platformKey,
                        shortname: $scope.platforms[platformKey].id,
                        fullname: $scope.platforms[platformKey].detail
                    });
                }
            }
            $scope.socket.on('updatedPageStatistics', function (pageInfo) {
                SocialAccounts.getSocialAccount(pageInfo._id, function (message) {
                    for (var i = 0; i < $rootScope.allPages.length; i++) {
                        if ($rootScope.allPages[i]._id == pageInfo._id) {
                            $rootScope.allPages[i] = message;
                            break;
                        }
                    }
                }, function (status, message) {
                    Alert.error(message);
                })
            });


            $scope.socialAccounts = {};

            $scope.filteredPlatforms = [];


            $scope.isPlatformFiltered = function (platform) {
                return $scope.filteredPlatforms.indexOf(platform) != -1;
            };

            $scope.refreshSocialAccount = function (_id, $event) {
                if ($event) $event.stopPropagation();
                SocialAccounts.refreshSocialAccount(_id, 'page_statistics', function (message) {
                    Alert.success("Successfully queued page for update.");
                }, function (status, message) {
                    Alert.error(message);
                })
            };

            $scope.removeSocialAccount = function (_id, $event) {
                if ($event) $event.stopPropagation();

                SocialAccounts.removeSocialAccount(_id, function (message) {
                    Alert.success("Successfully deleted social page.");
                    var lookup = {};
                    for (var index in $rootScope.allPages)
                        lookup[$rootScope.allPages[index]._id] = $rootScope.allPages[index];
                    delete $rootScope.allPages.splice($rootScope.allPages.indexOf(lookup[_id]), 1);
                }, function (status, message) {
                    Alert.error(message);
                })
            };

            $scope.loadMoreSocialPages = function () {
                SocialAccounts.getSocialAccounts(($rootScope.allPages.length > 0 ? ($rootScope.allPages[$rootScope.allPages.length - 1]._id) : null), $scope.filteredPlatforms, function (message) {
                    $rootScope.allPages = $rootScope.allPages.concat(message.pages);
                    $scope.remaining = message.remaining;
                }, function (status, message) {
                    Alert.error(message);
                });
            };

            $scope.reorderPages = function (sortOrder) {

            };

            $scope.loadMoreSocialPages();


            $scope.togglePlatformFilter = function (platform) {
                $scope.filteredPlatforms.indexOf(platform) == -1 ? $scope.filteredPlatforms.push(platform) : $scope.filteredPlatforms.splice($scope.filteredPlatforms.indexOf(platform), 1);
                $rootScope.allPages = [];
                $scope.loadMoreSocialPages();
            };

            // $scope.platformFiltered = function () {
            //     $rootScope.allPages = [];
            //     $scope.loadMoreSocialPages($scope.mod);
            // };


        }]);
});

