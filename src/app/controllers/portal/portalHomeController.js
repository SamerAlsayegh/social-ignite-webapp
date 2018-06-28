require("expose-loader?io!socket.io-client");
define(['../module', '../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('portalHomeController',
        ['$rootScope', '$scope', 'Auth', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdSidenav', '$cookies', 'Profile',
            function ($rootScope, $scope, Auth, Alert, Action, Dashboard, PostComment, $mdSidenav, $cookies, Profile) {
                $scope.comments = {};
                $scope.permissions = {};

                $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";

                $scope.socket = io(__SOCKETS__);
                $scope.socket.on('connect', function () {
                    console.log("Connected");
                    $scope.socket.emit('getOnline');
                    if ($scope.disconnected){
                        delete $scope.disconnected;
                        Alert.success("Reconnected.")
                    }
                });

                $scope.socket.on('ticket_new', function (ticket_reply) {
                    Alert.info("A new ticket was created.")
                });
                $scope.socket.on('ticket_reply', function (ticket_reply) {
                    Alert.info("A ticket has been replied to")
                });

                $scope.socket.on('changedScope', function () {
                    Auth.logout(function () {
                        Alert.error("Your scope has been changed, please relogin...");
                    }, function (status, message) {
                        Alert.error(message);
                    })
                });

                $scope.socket.on('updatingPageStatistic', function (progress, pageName) {
                    Alert.info(progress + " page statistic updates for " + pageName)
                });

                $scope.socket.on('updatingPostStatistic', function (progress, pageName) {
                    Alert.info(progress + " post statistic updates for " + pageName)
                });
                $scope.socket.on('updatingPostInformation', function (progress, pageName) {
                    Alert.info(progress + " post statistic updates for " + pageName)
                });
                $scope.socket.on('postedScheduledPost', function (data, le) {
                    Alert.success("A scheduled post is now live.")
                });


                $scope.socket.on('disconnect', function () {
                    $scope.disconnected = true;
                    Alert.error("Lost connection... Reconnecting.");
                });

                Profile.getPermissions(function (data) {
                    $scope.permissions = data.data.permissions;
                    $scope.limits = data.data.limits;
                    $scope.used = data.data.used;
                    Dashboard.getDashboardPosts(null, function (data) {
                        $scope.socialPostMainList = data;
                    }, function (status, message) {
                        Alert.error(message, 600);
                    });
                }, function (status, message) {
                    Alert.error(message, 600);
                });


                $scope.feeds = {};
                /**
                 * Initialize code...
                 */









                $scope.platformLookup = function (platformId) {
                    return platforms[platformId];
                };
                $scope.toggleMenu = function () {
                    $mdSidenav('left').toggle()
                };

                $scope.postComment = function (reply) {
                    if (!reply.comment || !reply._id) return;
                    Action.postComment({reply_id: reply._id, reply: reply.comment},
                        function (data) {
                            Alert.success("Successfully commented.", 600);
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
                    var data = {parent_post: parent_post};
                    if (parent_reply) data.parent_reply = parent_reply;
                    if (cursor) data.cursor = cursor;
                    PostComment.getReplies(data, function (data) {
                        if (!reply.replies) reply.replies = [];

                        for (var index = 0; index < data.data.replies.length; index++) {
                            reply.replies.unshift(data.data.replies[index]);
                        }
                        reply.remaining = data.data.remaining;
                    }, function (err, data) {
                        console.log(err, data)
                        Alert.error("Failed to fetch comments.");
                    });
                };

                $scope.toggleLike = function (reply) {
                    reply.liked = !reply.liked;
                    Action.toggleLikeComment({reply_id: reply._id}, function (data) {
                        Alert.success("You " + (data.liked ? 'liked' : 'unliked') + " this comment", 600);
                        reply.liked = data.liked;
                    }, function (err, message) {
                        reply.liked = !reply.liked;
                        Alert.error(message, 600);
                    });
                };

                $scope.deleteComment = function (reply) {
                    Action.deleteComment({reply_id: reply._id}, function (data) {
                        Alert.success("You deleted this comment", 600);
                        reply.deleted = true;
                    }, function (err, message) {
                        reply.deleted = false;
                        Alert.error(message, 600);
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

                // $scope.switchTheme = function () {
                //     if ($scope.dynamicTheme == "dark") $scope.dynamicTheme = "default";
                //     else $scope.dynamicTheme = "dark";
                //     $cookies.put("theme", $scope.dynamicTheme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
                // };
                $scope.setTheme = function (theme) {
                    $scope.theme = theme;
                    $cookies.put("theme", theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
                }
            }]);
});

