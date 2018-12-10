define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('dashboardController',
        ['$rootScope', '$scope', 'Auth', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdSidenav', '$mdDialog',
            function ($rootScope, $scope, Auth, Alert, Action, Dashboard, PostComment, $mdSidenav, $mdDialog) {
                $scope.comments = {};
                $scope.toggleMenu = function () {
                    $mdSidenav('left').toggle()
                };

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
                    if (parent_post) data.parent_post = parent_post;
                    if (parent_reply) data.parent_reply = parent_reply;
                    if (cursor) data.cursor = cursor;
                    PostComment.getReplies(data, function (data) {
                        if (!reply.replies) reply.replies = [];

                        for (var index = 0; index < data.data.replies.length; index++) {
                            reply.replies.push(data.data.replies[index]);
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

                $scope.replyConversation = function (socialComment) {
                    $mdDialog.show({
                        locals:{ 'socialComment': socialComment, 'socialPage': socialComment.page_id, 'permissions': $scope.permissions, 'theme': $scope.theme},
                        controller: 'conversationDialogController',
                        template: require("compile-ejs-loader!views/_portal/dashboard/_conversation.ejs")(),
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    })
                        .then(function (message) {

                        }, function () {

                        });
                };

                Dashboard.getDashboardPosts(null, function (data) {
                    $scope.socialPostMainList = data;
                }, function (status, message) {
                    Alert.error(message, 600);
                });
                Dashboard.getPagesWithStandAlones(null, function (data) {
                    $scope.mentions = data.replies;
                }, function (status, message) {
                    Alert.error(message, 600);
                });

                $scope.commentsModel = {replies: []};

                $scope.loadReplies($scope.commentsModel, null, null, null);



            }]);
});

