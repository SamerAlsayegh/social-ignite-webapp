/**
 * Created by Samer on 2015-09-14.
 */
define(['./module', '../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('portalScheduleController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'SocialPosts', '$mdDialog', '$q', 'moment', 'SocialAccounts', '$timeout', 'Alert',
        '$filter', 'Auth',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, SocialPosts, $mdDialog, $q,
                  moment, SocialAccounts, $timeout, Alert, $filter, Auth) {

            this.uiOnParamsChanged = function(changedParams, $transition$) {
                // do something with the changed params
                if (changedParams.updateId && changedParams.updateContent)
                    $scope.updateSocialPost(changedParams.updateId, changedParams.updateContent);
                else if ($state.params.updateContent) {
                    $scope.allSocialPosts.push(changedParams.updateContent);
                }

                // you can inspect $transition$ to see the what triggered the dynamic params change.
            };
            $scope.allPages = [];
            $scope.platforms = platforms;
            $scope.scheduledPosts = [];
            $scope.allSocialPosts = [];
            /**
             * Any module declarations here
             */

            $scope.limit = {
                minDate: new Date(),
                maxDate: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))
            };
            $scope.sortPostedPosts = {
                order: '-post_time',
                page: 1,
                limit: 10
            };
            $scope.sortScheduledPosts = {
                order: '-post_time',
                page: 1,
                limit: 10
            };

            /**
             * Variable declarations
             */


            /**
             * Functions for the page
             */

            /**
             * Initialize code...
             */
            $scope.getScheduledPosts = function () {
                var deferred = $q.defer();
                $scope.scheduledPostsLoaded = deferred.scheduledPostsLoaded;
                SocialPosts.getSchedulePosts(function (data) {
                    $scope.scheduledPosts = data.data;
                    deferred.resolve();
                }, function (status, error) {
                    $scope.scheduledPosts = [];
                    Alert.error(error.code + ": Failed to get scheduled posts.");
                    deferred.resolve();
                });
            };


            $scope.getPostedPosts = function () {
                var deferred = $q.defer();
                $scope.postedPostsLoaded = deferred.postedPostsLoaded;
                SocialPosts.getPostedPosts(function (data) {
                    $scope.postedPosts = data.data;

                    deferred.resolve();
                }, function (status, error) {
                    $scope.postedPosts = [];
                    Alert.error(error.code + ": Failed to get posted posts.");
                    deferred.resolve();
                });
            };

            $scope.getAllPosts = function (params) {
                var deferred = $q.defer();
                $scope.allSocialPostsLoaded = deferred.allSocialPostsLoaded;
                SocialPosts.getAllPosts(params, function (data) {
                    $scope.allSocialPosts = data.data;
                    deferred.resolve();
                }, function (status, error) {
                    $scope.allSocialPosts = [];
                    Alert.error("Failed to get all social posts.");
                    deferred.resolve();
                });
            };

            $scope.updateSocialPost = function (postId, postDetails) {
                var postChangeIndex = null;
                for (var postIndex in $scope.allSocialPosts) {
                    if ($scope.allSocialPosts[postIndex]._id == postId) {
                        postChangeIndex = postIndex;
                        break;
                    }
                }
                if (postChangeIndex != null) {
                    $scope.allSocialPosts[postChangeIndex] = postDetails;
                }
            };


            $scope.$on('alterSocialPost', function ($event, postId) {
                $scope.addPost($event, postId);
            });
            $scope.$on('statisticsSocialPost', function ($event, postId) {
                $scope.viewStatistics($event, postId);
            });
            $scope.addPost = function ($event, previousId) {
                $state.go('portal.schedule.edit', {postId: previousId});
                // $mdDialog.show({
                //     parent: angular.element(document.body),
                //     targetEvent: $event,
                //     clickOutsideToClose: true,
                //     templateUrl: '/pub/portal/schedule/_edit.html',
                //     locals: {
                //         postId: previousId
                //     },
                //     controller: 'editPostController'
                // }).then(function (postDetails) {
                //     if (previousId && postDetails)
                //         $scope.updateSocialPost(previousId, postDetails);
                //     else if (postDetails) {
                //         $scope.allSocialPosts.push(postDetails);
                //     }
                // }, function () {
                //
                // });
            };

            $scope.viewStatistics = function ($event, postId) {
                $state.go('portal.schedule.statistics', {postId: postId});
            };


            $scope.platformLookup = function (platformId) {
                return $scope.platforms[platformId].id;
            };

            $scope.showPrerenderedDialog = function ($event) {

                $mdDialog.show({
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: true,
                    templateUrl: '/pub/portal/schedule/_edit.html',
                    controller: 'editPostController'
                });
            };


            $scope.archivePostToggle = function (postId) {
                SocialPosts.archivePostToggle({
                    id: postId
                }, function (data) {
                    Alert.success("Successfully archived post.");
                    $scope.updateSocialPost(postId, data);
                }, function (status, error) {
                    Alert.error(error.message + ": Failed to archive post.")
                });
            };


            $scope.getSocialAccounts = function () {
                SocialAccounts.getSocialAccounts(function (data) {
                    $scope.allPages = data.data;
                }, function (status, error) {
                    $scope.platforms = [];
                    Alert.error(error.message + ": Failed to get social accounts. ")
                });
            };

            $scope.getSocialAccounts();
            $scope.getScheduledPosts();
            $scope.getPostedPosts();
            $scope.getAllPosts();


            $scope.prevMonth = function (data) {
                var monthEnd = new Date(data.year, data.month, 1, 0, 0, 0, 0).getTime();
                var monthStart = new Date(data.year, data.month - 1, 1, 0, 0, 0, 0).getTime();
                $scope.getAllPosts({start: monthStart, end: monthEnd});
            };
            $scope.nextMonth = function (data) {
                var monthEnd = new Date(data.year, data.month, 1, 0, 0, 0, 0).getTime();
                var monthStart = new Date(data.year, data.month - 1, 1, 0, 0, 0, 0).getTime();
                $scope.getAllPosts({start: monthStart, end: monthEnd});
            };

            $scope.dayFormat = "d";

            $scope.firstDayOfWeek = 1; // First day of the week, 0 for Sunday, 1 for Monday, etc.
            $scope.setDirection = function (direction) {
                $scope.direction = direction;
                $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
            };

            $scope.tooltips = true;
        }]);
});

