define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('scheduleController', ['$rootScope', '$scope', '$state', 'SocialPosts', '$q', 'moment', 'Alert', '$mdDialog', "$stateParams",
        function ($rootScope, $scope, $state, SocialPosts, $q, moment, Alert, $mdDialog, $stateParams) {

            $scope.scheduledPosts = [];
            $scope.curDate = new Date();
            $scope.defaultTab = 0;

            if ($stateParams.tab != null){
                if ($stateParams.tab == 'schedule')
                    $scope.defaultTab = 0;
                else if ($stateParams.tab == 'drafts')
                    $scope.defaultTab = 1;
            }



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
                SocialPosts.getSelectivePosts('active', params, function (data) {
                    $scope.allActivePosts = data.data;
                }, function (status, error) {
                    $scope.allActivePosts = [];
                    Alert.error("Failed to get all social posts.");
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
                for (var postIndex in $scope.allActivePosts) {
                    if ($scope.allActivePosts[postIndex]._id == postId) {
                        postChangeIndex = postIndex;
                        break;
                    }
                }
                if (postChangeIndex != null && postDetails != null) {
                    $scope.allActivePosts[postChangeIndex] = postDetails;
                } else if (postChangeIndex != null){
                    $scope.allActivePosts.splice(postChangeIndex, 1);
                }
            };


            $scope.$on('alterSocialPost', function ($event, postId) {
                $scope.addPost(postId);
            });

            $scope.$on('statisticsSocialPost', function ($event, postId) {
                $scope.viewStatistics($event, postId);
            });


            $scope.viewStatistics = function ($event, postId) {
                $state.go('portal.statistics.post_list', {postId: postId});
            };


            $scope.platformLookup = function (platformId) {
                return $scope.platforms[platformId].id;
            };
            $scope.startOfDay = $scope.curDate.setHours(0, 0, 0, 0);
            $scope.dayClick = function(date) {
                if (date >= $scope.startOfDay) {
                    $scope.addPost(null, {date: date});
                }
                // $state.go('portal.schedule.edit', );
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

