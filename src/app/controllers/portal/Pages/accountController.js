define(['../../module', '../../../enums/platforms', '../../../enums/errorCodes'], function (controllers, platforms, errorCodes) {
    'use strict';
    return controllers.controller('accountController', ['$rootScope', '$scope',
        '$state', '$stateParams', 'SocialAccounts', '$mdDialog', 'moment', '$window', 'Alert',
        function ($rootScope, $scope,
                  $state, $stateParams, SocialAccounts, $mdDialog, moment, $window, Alert) {
            $scope.toggle_add = false;
            $scope.socialPlatformDetails = [];

            $scope.addStack = function () {
                $scope.$emit('addStack', {});
            };

            $scope.addSocialAccount = function ($event, platformId) {
                if (!platforms.hasOwnProperty(parseInt(platformId)))
                    return Alert.error("Must choose a valid platform.");
                platformId = parseInt(platformId);
                $window.open(__API__ + '/api/v1/oauth/' + platforms[platformId].id + '/', '_self');
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
                        $state.go('portal.accounts.home', {appendPages: pages});//If the session is invalid, take to login page.
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
            } else {
                for (var platformKey in platforms) {
                    if (parseInt(platformKey) == platformKey) {
                        $scope.socialPlatformDetails.push({
                            id: platformKey,
                            shortname: platforms[platformKey].id,
                            fullname: platforms[platformKey].detail
                        });
                    }
                }
            }
        }]);
});

