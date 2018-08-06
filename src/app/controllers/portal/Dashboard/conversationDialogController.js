define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('conversationDialogController',
        ['$rootScope', '$scope', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdDialog', 'socialComment', 'socialPage', 'permissions', 'theme',
            function ($rootScope, $scope, Alert, Action, Dashboard, PostComment, $mdDialog, socialComment, socialPage, permissions, theme) {
                $scope.socialComments = [socialComment];
                $scope.socialPage = socialPage;
                $scope.permissions = permissions;
                $scope.theme = theme;

                console.log(socialPage, $scope.permissions);
                $scope.platforms = platforms;
                $scope.postComment = function (reply) {
                    if (!reply.comment || !reply._id) return;
                    Action.postComment({reply_id: reply._id, reply: reply.comment},
                        function (data) {
                            reply.commenting = false;
                            reply.comment = null;
                            if (!reply.replies) reply.replies = [];
                            reply.replies.push(data.reply)
                        }, function (status, message) {
                            Alert.error(message, 600);
                        });
                };


                $scope.loadReplies = function (reply, parent_post, parent_reply, cursor) {
                    if (reply.remaining == 0) return;
                    reply.hide = false;
                    var data = {};
                    if (parent_reply) data.parent_reply = parent_reply;
                    if (cursor) data.cursor = cursor;
                    PostComment.getReplies(data, function (data) {
                        if (!reply.replies) reply.replies = [];

                        for (var index = 0; index < data.data.replies.length; index++) {
                            reply.replies.unshift(data.data.replies[index]);
                        }
                        reply.remaining = data.data.remaining;
                    }, function (err, data) {
                        Alert.error("Failed to fetch comments.");
                    });
                };

                $scope.toggleLike = function (reply) {
                    if (!$scope.permissions.post_manage_like) return Alert.error("Please upgrade to a plan that offers ability to like.");
                    reply.likes = reply.liked ? reply.likes - 1 : reply.likes + 1;

                    reply.liked = !reply.liked;
                    Action.toggleLikeComment({reply_id: reply._id}, function (data) {
                        reply.liked = data.liked;
                    }, function (err, message) {
                        reply.liked = !reply.liked;
                        reply.likes = reply.liked ? reply.likes + 1 : reply.likes - 1;
                        Alert.error(message, 600);
                    });
                };

                $scope.deleteComment = function (reply) {
                    reply.deleted = true;
                    Alert.success("Deleting selected comment", 600);
                    Action.deleteComment({reply_id: reply._id}, function (data) {
                    }, function (err, message) {
                        reply.deleted = false;
                        Alert.error(message, 600);
                    });
                };
            }]);
});

