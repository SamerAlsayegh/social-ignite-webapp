define(['../../module'], controllers => {
    return controllers.controller('conversationDialogController',
        ['$rootScope', '$scope', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdDialog', 'socialComment', 'socialPage', 'permissions', 'theme',
            (
                $rootScope,
                $scope,
                Alert,
                Action,
                Dashboard,
                PostComment,
                $mdDialog,
                socialComment,
                socialPage,
                permissions,
                theme
            ) => {
                $scope.socialComments = [socialComment];
                $scope.socialPage = socialPage;
                $scope.permissions = permissions;
                $scope.theme = theme;

                $scope.postComment = reply => {
                    if (!reply.comment || !reply._id) return;
                    Action.postComment({reply_id: reply._id, reply: reply.comment},
                        data => {
                            reply.commenting = false;
                            reply.comment = null;
                            if (!reply.replies) reply.replies = [];
                            reply.replies.push(data.reply)
                        }, (status, message) => {
                            Alert.error(message, 600);
                        });
                };


                $scope.loadReplies = (reply, parent_post, parent_reply, cursor) => {
                    if (reply.remaining === 0) return;
                    reply.hide = false;
                    let data = {};
                    if (parent_reply) data.parent_reply = parent_reply;
                    if (cursor) data.cursor = cursor;
                    PostComment.getReplies(data, data => {
                        if (!reply.replies) reply.replies = [];

                        for (let index = 0; index < data.data.replies.length; index++) {
                            reply.replies.unshift(data.data.replies[index]);
                        }
                        reply.remaining = data.data.remaining;
                    }, (err, data) => {
                        Alert.error("Failed to fetch comments.");
                    });
                };

                $scope.toggleLike = reply => {
                    if (!$scope.permissions.post_manage_like) return Alert.error("Please upgrade to a plan that offers ability to like.");
                    reply.likes = reply.liked ? reply.likes - 1 : reply.likes + 1;

                    reply.liked = !reply.liked;
                    Action.toggleLikeComment({reply_id: reply._id}, data => {
                        reply.liked = data.liked;
                    }, (err, message) => {
                        reply.liked = !reply.liked;
                        reply.likes = reply.liked ? reply.likes + 1 : reply.likes - 1;
                        Alert.error(message, 600);
                    });
                };

                $scope.deleteComment = reply => {
                    reply.deleted = true;
                    Alert.success("Deleting selected comment", 600);
                    Action.deleteComment({reply_id: reply._id}, data => {
                    }, (err, message) => {
                        reply.deleted = false;
                        Alert.error(message, 600);
                    });
                };

                $scope.cancel = () => {
                    $mdDialog.cancel();
                };

            }]);
});

