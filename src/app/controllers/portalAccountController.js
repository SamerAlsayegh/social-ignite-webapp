/**
 * Created by Samer on 2015-09-14.
 */
define(['./module', '../enums/platforms', '../enums/errorCodes'], function (controllers, platforms, errorCodes) {
    'use strict';
    return controllers.controller('portalAccountController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'SocialAccounts', '$mdDialog', '$q', 'moment', '$timeout', '$window', 'Alert',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, SocialAccounts, $mdDialog, $q, moment, $timeout, $window, Alert) {
            $scope.socialPlatforms = platforms;
            $scope.connectedAccounts = [];
            $scope.toggle_add = false;
            $scope.socialPlatformDetails = [];
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
                $window.open(API+'/api/v1/oauth/' + platforms[platformId].id + '/', '_self');
            };

            $scope.removeSocialAccount = function (_id) {
                SocialAccounts.removeSocialAccount({
                    _id: _id
                }, function (message) {
                    Alert.success("Successfully deleted social page.");
                    var lookup = {};
                    for (var index in $scope.connectedAccounts)
                        lookup[$scope.connectedAccounts[index]._id] = $scope.connectedAccounts[index];
                    delete $scope.connectedAccounts.splice($scope.connectedAccounts.indexOf(lookup[_id]),1);
                }, function (status, message) {
                    Alert.error("Failed to delete social page - " + errorCodes[message.message].detail);
                })
            };

            $scope.getSocialAccounts = function () {
                var deferred = $q.defer();
                SocialAccounts.getSocialAccounts(function (data) {
                    $scope.connectedAccounts = data;
                    deferred.resolve();
                }, function (status, error) {
                    deferred.resolve();
                });
            };
            $scope.getSocialAccounts();


            $scope.platformList = platforms;
            $scope.platformLookup = function (platformId) {
                return $scope.platformList[platformId].id;
            };


            if ($stateParams.cache_id != null) {

                // They are asked to choose a main page from a list.
                $scope.newPage = {
                    mainPage: null
                };


                $scope.submitExtras = function () {
                    var pagesChosen  = [];
                    for (var pageId in $scope.newPage.chosen){
                        var chosen = $scope.newPage.chosen[pageId];
                        if (chosen){
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
                        Alert.error("Failed to change main account... " + errorCodes[message.message].detail);
                    });
                };


                SocialAccounts.getPagesOnHold({cacheId: $stateParams.cache_id}, function (response) {
                    if (response.hasOwnProperty("pages"))
                        $scope.newPage.pages = response.pages;
                    if (response.hasOwnProperty("requestAccount"))
                        $scope.newPage.accountLogin = {};

                }, function (status, error) {
                    Alert.error("It seems that this request is invalid.");
                });
            }

        }]);


});

