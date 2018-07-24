require("expose-loader?io!socket.io-client");
define(['../module', '../../enums/platforms', '../../enums/errorCodes'], function (controllers, platforms, errorCodes) {
    'use strict';
    return controllers.controller('portalHomeController',
        ['$rootScope', '$scope', 'Auth', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdSidenav', '$cookies', 'Profile', 'General','$state',
            function ($rootScope, $scope, Auth, Alert, Action, Dashboard, PostComment, $mdSidenav, $cookies, Profile, General, $state) {
                $scope.errorCodes = errorCodes;
                $scope.platforms = platforms;




                $scope.permissions = {};
                $scope.notifications = [];
                $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";

                $scope.socket = io(__SOCKETS__);
                $scope.socket.on('connect', function () {
                    console.log("Connected to Sockets");
                    $scope.socket.emit('getOnline');
                    if ($scope.disconnected){
                        delete $scope.disconnected;
                        Alert.success("Reconnected.")
                    }
                });

                $scope.socket.on('ticket_new_user', function (ticket_reply) {
                    Alert.info("A new ticket was created.");
                    $scope.notifications.support_tickets++;
                });
                $scope.socket.on('ticket_reply_user', function (ticket_reply) {
                    Alert.info("A ticket has been replied to");
                    $scope.notifications.support_tickets++;
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
                }, function (status, message) {
                    Alert.error(message, 600);
                });
                $scope.allowedActions = [];
                Action.getAllowedActions(function (data) {
                    $scope.allowedActions = data;
                }, function (status, message) {
                    // Alert.error(message, 600);
                });

                General.getNotifications(function(data){
                    $scope.notifications = data.data;
                }, function(status, message){

                });

                /**
                 * Initialize code...
                 */
                $scope.$step = $cookies.get("tutorial") == 3 ? 3 : 0;
                $scope.$steps = [{
                    description: 'Navigate to Socials',
                    div: 'tutorial_step_1',
                    state: 'portal.home',
                }, {
                    description: 'Click the Add button',
                    div: 'tutorial_step_2',
                    state: 'portal.schedule.table',
                }, {
                    description: 'Choose a platform to add',
                    div: 'tutorial_step_3',
                    state: 'portal.schedule.table',
                }, {
                    description: 'Choose one page to add to your account.',
                    div: 'tutorial_step_4'
                }, {
                    description: 'Open the Schedule/Agenda',
                    div: 'tutorial_step_5'
                }, {
                    description: 'Click to schedule a new post.',
                    div: 'tutorial_step_6'
                }, {
                    description: 'Fill the fields and choose the time.',
                    div: 'tutorial_step_7'
                }, {
                    description: 'You have successfully scheduled your first post.',
                    div: 'DONE'
                }];

                $scope.nextStep = function () {
                    if (!$scope.tutorialMode) return;
                    if ($scope.$step == 0) $state.go('portal.home');
                    if ($scope.$steps.length <= $scope.$step) $scope.$step = 0;

                    $scope.activeDiv = $scope.$steps[$scope.$step].div;
                    $scope.activeDescription = $scope.$steps[$scope.$step].description;
                    console.log("Clicked on a step.", $scope.$step)

                    angular.element(document.getElementsByClassName($scope.activeDiv)).bind("click", function(e){
                        console.log("Clicked on a step.")
                    });
                    console.log(angular.element(document.getElementsByClassName($scope.activeDiv)));

                    $cookies.put("tutorial", $scope.$step, {});

                    $scope.$step++;
                };
                // $scope.nextStep();

                $scope.platformLookup = function (platformId) {
                    return platforms[platformId];
                };
                $scope.toggleMenu = function () {
                    $mdSidenav('left').toggle()
                };

                /**
                 * Logout user
                 */
                $scope.logout = function () {
                    Auth.logout(function (data) {
                        Alert.info('Logged out successfully!');
                        $state.go('public.login', {}, {reload: 'public.login'});
                    }, function (err, data) {
                        Alert.error('Failed to log out.');
                    });
                };
                $scope.resendEmail = function () {
                    Auth.requestEmailResend($scope.user.email, function (data) {
                        Alert.success("An email should be on the way.");
                    }, function (status, message) {
                        Alert.error("Failed to request verification email.");
                    });
                }

                $scope.setTheme = function (theme) {
                    $scope.theme = theme;
                    $cookies.put("theme", theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
                }

            }]);
});

