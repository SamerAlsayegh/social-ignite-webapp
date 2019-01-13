define(['../../module'], controllers => {
    return controllers.controller('dashboardController',
        ['$rootScope', '$scope', 'Auth', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdSidenav', '$mdDialog',
            function (
                $rootScope,
                $scope,
                Auth,
                Alert,
                Action,
                Dashboard,
                PostComment,
                $mdSidenav,
                $mdDialog
            ) {
                $scope.widgetsEditing = 1;
                $scope.comments = {};
                $scope.toggleMenu = () => {
                    $mdSidenav('left').toggle()
                };

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
                    if (parent_post) data.parent_post = parent_post;
                    if (parent_reply) data.parent_reply = parent_reply;
                    if (cursor) data.cursor = cursor;
                    PostComment.getReplies(data, data => {
                        if (!reply.replies) reply.replies = [];

                        for (let index = 0; index < data.data.replies.length; index++) {
                            reply.replies.push(data.data.replies[index]);
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
                    Action.deleteComment({reply_id: reply._id}, data => {
                        Alert.success("Deleted selected comment", 600);
                    }, (err, message) => {
                        reply.deleted = false;
                        Alert.error(message, 600);
                    });
                };

                $scope.replyConversation = socialComment => {
                    $mdDialog.show({
                        locals: {
                            'socialComment': socialComment,
                            'socialPage': socialComment.page_id,
                            'permissions': $scope.permissions,
                            'theme': $scope.theme,
                            'allowedActions': $scope.allowedActions
                        },
                        controller: 'conversationDialogController',
                        template: require("compile-ejs-loader!views/_portal/widgets/_conversation.ejs")(),
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    })
                        .then(message => {

                        }, () => {

                        });
                };

                Dashboard.getDashboardPosts(null, data => {
                    $scope.socialPostMainList = data;
                }, (status, message) => {
                    Alert.error(message, 600);
                });
                Dashboard.getPagesWithStandAlones(null, data => {
                    $scope.mentions = data.replies;
                }, (status, message) => {
                    Alert.error(message, 600);
                });

                $scope.commentsModel = {replies: []};

                $scope.loadReplies($scope.commentsModel, null, null, null);

                $scope.widgetStage = function (stage) {
                    console.log("ok")
                    $scope.widgetsEditing = stage;
                }

            }]);
});

