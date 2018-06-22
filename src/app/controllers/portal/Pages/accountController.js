define(['../../module', '../../../enums/platforms', '../../../enums/errorCodes'], function (controllers, platforms, errorCodes) {
    'use strict';
    return controllers.controller('accountController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'SocialAccounts', '$mdDialog', '$q', 'moment', '$timeout', '$window', 'Alert', 'SocialStacks',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, SocialAccounts, $mdDialog, $q, moment, $timeout, $window, Alert, SocialStacks) {
            $scope.socialPlatforms = platforms;
            $scope.connectedAccounts = [];
            $scope.toggle_add = false;
            $scope.platformFilter = null;
            $scope.socialPlatformDetails = [];
            $scope.socialStackEditing = {
                data: {
                    socialPages: []
                },
            };

            for (var platformKey in platforms) {
                if (parseInt(platformKey) == platformKey) {
                    $scope.socialPlatformDetails.push({
                        id: platformKey,
                        shortname: platforms[platformKey].id,
                        fullname: platforms[platformKey].detail
                    });
                }
            }
            if ($stateParams.error != null)
                Alert.error("Failed to register. " + errorCodes[$stateParams.error].detail);
            /**
             * Any module declarations here
             */
            $scope.socialAccounts = {};

            /**
             * letiable declarations
             */


            /**
             * Initialize code...
             */
            $scope.addSocialAccount = function ($event, platformId) {
                if (!platforms.hasOwnProperty(parseInt(platformId)))
                    return Alert.error("Must choose a valid platform.");
                platformId = parseInt(platformId);
                $window.open(API + '/api/v1/oauth/' + platforms[platformId].id + '/', '_self');
            };

            $scope.refreshSocialAccount = function (_id) {
                SocialAccounts.refreshSocialAccount(_id, 'page_statistics', function (message) {
                    Alert.success("Successfully triggered update.");
                }, function (status, message) {
                    Alert.error(message);
                })
            };

            $scope.removeSocialAccount = function (_id) {
                SocialAccounts.removeSocialAccount(_id, function (message) {
                    Alert.success("Successfully deleted social page.");
                    var lookup = {};
                    for (var index in $scope.connectedAccounts)
                        lookup[$scope.connectedAccounts[index]._id] = $scope.connectedAccounts[index];
                    delete $scope.connectedAccounts.splice($scope.connectedAccounts.indexOf(lookup[_id]), 1);
                }, function (status, message) {
                    Alert.error(message);
                })
            };

            $scope.loadMoreSocialPages = function () {
                SocialAccounts.getSocialAccounts(($scope.connectedAccounts.length > 0 ? ($scope.connectedAccounts[$scope.connectedAccounts.length - 1]._id) : null), $scope.platformFilter, function (data) {
                    $scope.connectedAccounts = $scope.connectedAccounts.concat(data.pages);
                    $scope.remaining = data.remaining;
                }, function (status, message) {
                    Alert.error(message);
                });
            };
            $scope.loadMoreSocialPages();


            $scope.socialStackDialog = function (ev){
                $mdDialog.show({
                    controller: 'socialStackController',
                    templateUrl: './_portal/accounts/_socialStacks.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                    .then(function(answer) {
                        $scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                        $scope.status = 'You cancelled the dialog.';
                    });
            };


            $scope.platformList = platforms;
            $scope.platformLookup = function (platformId) {
                return $scope.platformList[platformId].id;
            };

            $scope.platformFiltered =  function () {
                console.log("Filtered...?")
                $scope.connectedAccounts = [];
                $scope.loadMoreSocialPages();
            };
            if ($stateParams.cache_id != null) {

                // They are asked to choose a main page from a list.
                $scope.newPage = {
                    mainPage: null
                };


                $scope.submitExtras = function () {
                    var pagesChosen = [];
                    for (var pageId in $scope.newPage.chosen) {
                        var chosen = $scope.newPage.chosen[pageId];
                        if (chosen) {
                            pagesChosen.push(pageId)
                        }
                    }
                    SocialAccounts.updateSocialAccount({
                        pages: pagesChosen,
                        cache_id: $stateParams.cache_id
                    }, function (pages) {
                        $scope.connectedAccounts = $scope.connectedAccounts.concat(pages);
                        Alert.success("Successfully added account");
                        $state.go('portal.accounts.home', {}, {reload: 'portal.accounts.home'})//If the session is invalid, take to login page.
                    }, function (status, message) {
                        Alert.error(message);
                    });
                };


                SocialAccounts.getPagesOnHold({cacheId: $stateParams.cache_id}, function (response) {
                    if (response.hasOwnProperty("pages"))
                        $scope.newPage.pages = response.pages;
                    if (response.hasOwnProperty("requestAccount"))
                        $scope.newPage.accountLogin = {};

                }, function (status, message) {
                    Alert.error(message);
                });
            }
        }]);
});

