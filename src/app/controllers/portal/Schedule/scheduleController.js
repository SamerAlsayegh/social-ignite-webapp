define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('scheduleController', ['$rootScope', '$scope', '$state', 'SocialPosts', '$q', 'moment', 'Alert',
        function ($rootScope, $scope, $state, SocialPosts, $q, moment, Alert) {

            this.uiOnParamsChanged = function (changedParams, $transition$) {
                if (changedParams.updateId && changedParams.updateContent)
                    $scope.updateSocialPost(changedParams.updateId, changedParams.updateContent);
                else if ($state.params.updateContent) {
                    $scope.allSocialPosts.push(changedParams.updateContent);
                }
                // TODO: Handle draft changes to scheduled and scheduled changes to draft.
            };
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


            $scope.getActivePosts = function (params) {
                var deferred = $q.defer();
                $scope.allSocialPostsLoaded = deferred.allSocialPostsLoaded;
                SocialPosts.getSelectivePosts('active', params, function (data) {
                    $scope.allActivePosts = data.data;
                    deferred.resolve();
                }, function (status, error) {
                    $scope.allActivePosts = [];
                    Alert.error("Failed to get all social posts.");
                    deferred.resolve();
                });
            };

            $scope.getDraftedPosts = function (params) {
                SocialPosts.getSelectivePosts('draft', params, function (data) {
                    $scope.allDraftedPosts = data.data;
                }, function (status, error) {
                    $scope.allDraftedPosts = [];
                    Alert.error("Failed to get all social posts.");
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
            };

            $scope.viewStatistics = function ($event, postId) {
                $state.go('portal.schedule.statistics', {postId: postId});
            };


            $scope.platformLookup = function (platformId) {
                return $scope.platforms[platformId].id;
            };

            $scope.getActivePosts();
            $scope.getDraftedPosts();

            $scope.prevMonth = function (data) {
                var monthEnd = new Date(data.year, data.month, 1, 0, 0, 0, 0).getTime();
                var monthStart = new Date(data.year, data.month - 1, 1, 0, 0, 0, 0).getTime();
                $scope.getActivePosts({start: monthStart, end: monthEnd});
            };
            $scope.nextMonth = function (data) {
                var monthEnd = new Date(data.year, data.month, 1, 0, 0, 0, 0).getTime();
                var monthStart = new Date(data.year, data.month - 1, 1, 0, 0, 0, 0).getTime();
                $scope.getActivePosts({start: monthStart, end: monthEnd});
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

