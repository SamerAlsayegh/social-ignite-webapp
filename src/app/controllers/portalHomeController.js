/**
 * Created by Samer on 2015-09-14.
 */
define(['./module', '../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('portalHomeController',
        ['$rootScope', '$scope', '$location', 'Auth', 'Statistics', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdSidenav', '$cookies',
        function ($rootScope, $scope, $location, Auth, Statistics, Alert, Action, Dashboard, PostComment, $mdSidenav, $cookies) {
            $scope.dynamicTheme = "default";
            $scope.location = $location;
            $scope.comments = {};
            $scope.dynamicTheme = $cookies.get("theme");


            $scope.feeds = {};
            /**
             * Initialize code...
             */

            Dashboard.getDashboardPosts(null, function (data) {
                $scope.socialPostMainList = data;
            }, function (status, message) {
                Alert.error(message, 600);
            });


            $scope.platformLookup = function (platformId) {
                return platforms[platformId];
            };
            $scope.toggleMenu = function(){
                $mdSidenav('left').toggle()
            };

            $scope.postComment = function(reply){
                if (!reply.comment || !reply._id) return;
                Action.postComment({reply_id: reply._id, reply: reply.comment},
                    function(data){
                        Alert.success("Successfully commented.", 600);
                        reply.commenting = false;
                        reply.replies.push(data.reply)
                    }, function (status, message) {
                        Alert.error("Failed to comment.", 600);
                });
            };
            $scope.loadReplies = function (reply, parent_post, parent_reply, cursor) {
                if (reply.remaining == 0) return;
                reply.hide = false;
                var data = {parent_post: parent_post};
                if (parent_reply) data.parent_reply = parent_reply;
                if (cursor) data.cursor = cursor;
                PostComment.getReplies(data, function (data) {
                    if (!reply.replies) reply.replies = [];

                    for (var index = 0; index < data.data.replies.length; index++) {
                        reply.replies.unshift(data.data.replies[index]);
                    }
                    reply.remaining = data.data.remaining;
                }, function(err, data){
                    console.log(err, data)
                    Alert.error("Failed to fetch comments.");
                });
            };

            $scope.toggleLike = function(reply){
                reply.liked = !reply.liked;
                Action.toggleLikeComment({reply_id: reply._id}, function (data) {
                    Alert.success("You " + (data.liked ? 'liked' : 'unliked') +" this comment", 600);
                    reply.liked = data.liked;
                }, function(err, data){
                    reply.liked = !reply.liked;
                    Alert.error("Failed to liked comment.");
                });
            };


            /**
             * Logout user
             */
            $scope.logout = function () {
                Auth.logout(function (data) {
                    Alert.info('Logged out successfully!');
                }, function (err, data) {
                    Alert.error('Failed to log out.');
                });
            };

            $scope.switchTheme = function () {
                if ($scope.dynamicTheme == "dark") $scope.dynamicTheme = "default";
                else $scope.dynamicTheme = "dark";
                $cookies.put("theme", $scope.dynamicTheme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
            };
        }]);
});

