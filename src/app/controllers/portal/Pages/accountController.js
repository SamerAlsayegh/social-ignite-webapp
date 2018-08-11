define(['../../module'], function (controllers) {
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
            $scope.addSocialAccount = function (platformId) {
                console.log($scope.platforms, platformId);
                if (!$scope.platforms.hasOwnProperty(parseInt(platformId)))
                    return Alert.error("Must choose a valid platform.");
                platformId = parseInt(platformId);
                $window.open(__API__ + '/api/v1/oauth/' + $scope.platforms[platformId].id + '/', '_self');
            };


            if ($stateParams.cache_id != null) {

                // They are asked to choose a main page from a list.
                $scope.newPage = {
                    mainPage: null
                };
                $scope.pendingPages = [];

                $scope.linkAccount = function (socialPage) {
                    if (!socialPage.linked) {
                        socialPage.linking = true;
                        SocialAccounts.updateSocialAccount({
                            pages: [socialPage.id],
                            cache_id: $stateParams.cache_id
                        }, function (pages) {
                            socialPage.linking = false;
                            socialPage.linked = true;
                            $scope.pendingPages = $scope.pendingPages.concat(pages);
                            $scope.nextStep();
                            // $state.go('portal.accounts.home', {appendPages: pages});//If the session is invalid, take to login page.
                        }, function (status, message) {
                            socialPage.linking = false;
                            Alert.error(message);
                        });
                    }
                };
                $scope.return = function(){
                    $state.go('portal.accounts.home', {});//If the session is invalid, take to login page.
                };

                SocialAccounts.getPagesOnHold({cacheId: $stateParams.cache_id}, function (response) {
                    if (response.hasOwnProperty("pages"))
                        $scope.newPage.pages = response.pages;

                }, function (status, message) {
                    Alert.error(message);
                });
            } else {
                for (var platformKey in $scope.platforms) {
                    if (parseInt(platformKey) == platformKey) {
                        $scope.socialPlatformDetails.push({
                            id: platformKey,
                            shortname: $scope.platforms[platformKey].id,
                            fullname: $scope.platforms[platformKey].detail
                        });
                    }
                }
            }
        }]);
});

