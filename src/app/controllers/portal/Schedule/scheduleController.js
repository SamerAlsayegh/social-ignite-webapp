define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('scheduleController', ['$rootScope', '$scope', '$state', 'SocialPosts', '$q', 'moment', 'Alert', '$mdDialog', "$stateParams",
        function ($rootScope, $scope, $state, SocialPosts, $q, moment, Alert, $mdDialog, $stateParams) {

            $scope.platforms = platforms;
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
                $scope.addPost($event, postId);
            });

            $scope.$on('statisticsSocialPost', function ($event, postId) {
                $scope.viewStatistics($event, postId);
            });
            $scope.addPost = function ($event, previousId) {
                $mdDialog.show({
                    locals:{ 'postId': previousId, 'postInformation': null, 'theme': $scope.theme, 'socket': $scope.socket},
                    controller: 'editControllerDialog',
                    templateUrl: './_portal/schedule/_scheduleDialog.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                    .then(function (message) {
                        console.log(message);
                        if (message.updateId && message.updateContent && message.updateState == "ADD") {
                            // Modifying a post
                            $scope.updateSocialPost(message.updateId, message.updateContent);
                        } else if (message.updateContent  && message.updateState == "ADD") {
                            // Adding a post
                            for (let index = 0; index < $scope.allDraftedPosts.length; index++){
                                if ($scope.allDraftedPosts[index]._id == message.updateContent._id){
                                    $scope.allDraftedPosts.splice(index, 1);
                                    break;
                                }
                            }
                            $scope.allActivePosts.push(message.updateContent);
                            $scope.nextStep();
                        } else if (message.updateId && message.updateState == "DELETE"){
                            // Deleting a draft
                            for (let index = 0; index < $scope.allDraftedPosts.length; index++){
                                if ($scope.allDraftedPosts[index]._id == message.updateId){
                                    $scope.allDraftedPosts.splice(index, 1);
                                    break;
                                }
                            }

                        } else if (message.updateId && message.updateContent && message.updateState == "DRAFT"){
                            // Drafting a post.
                            $scope.updateSocialPost(message.updateId, null);
                            $scope.allDraftedPosts.unshift(message.updateContent);
                        }
                    }, function () {


                    });
                // $state.go('portal.schedule.edit', {postId: previousId});
            };

            $scope.viewStatistics = function ($event, postId) {
                $state.go('portal.schedule.statistics', {postId: postId});
            };


            $scope.platformLookup = function (platformId) {
                return $scope.platforms[platformId].id;
            };
            $scope.dayClick = function(date) {
                if (date > $scope.curDate) {
                    $mdDialog.show({
                        locals: {'postId': null, 'postInformation': {date: date}, 'theme': $scope.theme, 'socket': $scope.socket},
                        controller: 'editControllerDialog',
                        templateUrl: './_portal/schedule/_scheduleDialog.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    })
                        .then(function (message) {
                            if (message.updateId && message.updateContent && message.updateState == "ADD") {
                                // Modifying a post
                                $scope.updateSocialPost(message.updateId, message.updateContent);
                            } else if (message.updateContent  && message.updateState == "ADD") {
                                // Adding a post
                                for (let index = 0; index < $scope.allDraftedPosts.length; index++){
                                    if ($scope.allDraftedPosts[index]._id == message.updateContent._id){
                                        $scope.allDraftedPosts.splice(index, 1);
                                        break;
                                    }
                                }
                                $scope.allActivePosts.push(message.updateContent);
                                $scope.nextStep();

                            } else if (message.updateId && message.updateState == "DELETE"){
                                // Deleting a draft
                                for (let index = 0; index < $scope.allDraftedPosts.length; index++){
                                    if ($scope.allDraftedPosts[index]._id == message.updateId){
                                        $scope.allDraftedPosts.splice(index, 1);
                                        break;
                                    }
                                }

                            } else if (message.updateId && message.updateContent && message.updateState == "DRAFT"){
                                // Drafting a post.
                                $scope.updateSocialPost(message.updateId, null);
                                $scope.allDraftedPosts.unshift(message.updateContent);
                            }
                        }, function () {

                        });
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

