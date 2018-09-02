require("expose-loader?io!socket.io-client");

// require("expose-loader?moment!moment");

define(['../module', '../../enums/platforms', '../../enums/errorCodes', '../../enums/platformErrors'], function (controllers, platforms, errorCodes, platformErrors) {
    'use strict';
    return controllers.controller('portalHomeController',
        ['$rootScope', '$scope', 'Auth', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdSidenav', '$cookies',
            'Profile', 'General','$state', '$mdDialog', 'ngIntroService', '$http', "SocialStacks", "SocialAccounts", "$transitions", "$sce",
            function ($rootScope, $scope, Auth, Alert, Action, Dashboard, PostComment, $mdSidenav,
                      $cookies, Profile, General, $state, $mdDialog, ngIntroService, $http, SocialStacks, SocialAccounts, $transitions, $sce) {
                $scope.errorCodes = errorCodes;
                $scope.platforms = platforms;
                $scope.platformErrors = platformErrors;
                $scope.permissions = {};
                $scope.notifications = [];
                $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";
                if ($scope.user)
                $scope.tutorialMode = $scope.user.information.tutorial_step == 999 ? false : true;
                $scope.socket = io(__SOCKETS__);

                $scope.socket.on('connect', function () {
                    console.log("Connected to Sockets");
                    $scope.socket.emit('getOnline');
                    if ($scope.disconnected){
                        delete $scope.disconnected;
                        Alert.success("Reconnected.")
                    }
                });
                $scope.toggleMenu = function () {
                    $mdSidenav('left').toggle();
                };
                $scope.openMenu = function () {
                    $mdSidenav('left').open();
                };

                // $scope.socket.on('ticket_new_user', function (ticket_reply) {
                //     Alert.info("A new ticket was created.");
                //     $scope.notifications.support_tickets++;
                // });
                // $scope.socket.on('ticket_reply_user', function (ticket_reply) {
                //     Alert.info("A ticket has been replied to");
                //     $scope.notifications.support_tickets++;
                // });


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
                SocialStacks.getSocialStacks(true, false, 1, function (socialStacks) {
                    $scope.allStacks = socialStacks.social_stacks;
                    SocialAccounts.getSocialAccounts(null, null, function (socialAccounts) {
                        $scope.allPages = socialAccounts.pages;
                    }, function (status, error) {
                        $scope.platforms = [];
                        Alert.error(error.code + ": Failed to get social accounts. ")
                    });
                }, function (status, error) {
                    $scope.platforms = [];
                    Alert.error(error.code + ": Failed to get social stacks. ")
                });


                General.getNotifications(function(data){
                    $scope.notifications = data.data;
                }, function(status, message){

                });

                /**
                 * Initialize code...
                 */
                // $scope.$step = $cookies.get("tutorial") == 3 ? 4 : ($scope.user.information.tutorial_step == 2 ? 1 : $scope.user.information.tutorial_step);
                //
                //
                // $scope.$steps = [{
                //     description: 'Click \'Accounts\' to add your first account',
                //     div: 'tutorial_step_1',
                //     state: 'portal.home',
                // }, {
                //     description: 'Click the Add button',
                //     div: 'tutorial_step_2',
                //     state: 'portal.schedule.table',
                // }, {
                //     description: 'Choose a platform to add',
                //     div: 'tutorial_step_3',
                //     state: 'portal.schedule.table',
                // },{
                //     description: 'You are now being redirected to authorization',
                //     div: 'tutorial_step_4',
                //     state: 'portal.schedule.table',
                // }, {
                //     description: 'Choose one page to add to your account.',
                //     div: 'tutorial_step_4'
                // }, {
                //     description: 'Now we make our first post',
                //     div: 'tutorial_step_5'
                // }, {
                //     description: 'Fill the fields and choose the time.',
                //     div: 'tutorial_step_7'
                // }, {
                //     description: 'You have successfully scheduled your first post. If you need any help, don\'t hesitate to contact us via Support.',
                //     div: 'tutorial_step_8'
                // }];
                $scope.IntroOptions = {
                    showStepNumbers: false,
                    showBullets: false,
                    exitOnOverlayClick: false,
                    exitOnEsc: false,
                    hideNext: true,
                    hidePrev: true,
                    disableInteraction: false,
                    steps:[
                        {
                            element: ".tutorial_step_1",
                            intro: "Let's go to account management."
                        },
                        {
                            element: ".tutorial_step_1",
                            intro: "Let's go to account management."
                        },
                    ],
                };
                // ngIntroService.clear();
                ngIntroService.setOptions($scope.IntroOptions);
                if ($scope.tutorialMode) {
                    $scope.$step = $cookies.get("tutorial") || 1 ;
                    if ($scope.$step == 1) {
                        setTimeout(function () {
                            $scope.openMenu();
                        }, 300);
                        setTimeout(function () {
                            ngIntroService.start();
                        }, 750)
                    }


                    if ($cookies.get("tutorial") > 5)
                        $cookies.remove("tutorial");

                    $scope.nextStep = function () {
                        console.log("Nexted...");
                        $scope.$step++;
                        $cookies.put("tutorial", $scope.$step)
                        ngIntroService.next();
                    };
                }

                $rootScope.finishTutorial = function (skipped) {
                    if ($scope.tutorialMode){
                        $scope.tutorialMode = false;
                        Profile.updateUser({
                            tutorial_step: 999,
                        }, function (result) {
                            if (skipped){
                                Alert.success("Skipping tutorial. To restart tutorial, access 'Profile'.", 4000);
                            } else {
                                Alert.success("Successfully finished tutorial. If you need help, contact support.", 4000);
                            }
                        }, function (status, message){
                            Alert.error(message);
                        })
                    }
                };

                $scope.platformLookup = function (platformId) {
                    return platforms[platformId];
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
                        Alert.error(message);
                    });
                };


                $scope.addPost = function (previousId, postInformation) {
                    $mdDialog.show({
                        locals:{
                            'postId': previousId,
                            'postInformation': postInformation,
                            'theme': $scope.theme,
                            'socket': $scope.socket,
                            'socialStacks': $scope.allStacks,
                            'socialPages': $scope.allPages,
                        },
                        // template: __ASSETS__ + '/_portal/schedule/_scheduleDialog.html',
                        // contentElement: '#scheduleDialog',
                        template: require("ejs-compiled-loader!views/_portal/schedule/_scheduleDialog.ejs")(),
                        controller: 'editControllerDialog',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    })
                        .then(function (message) {
                            if (message.updateId && message.updateContent && message.updateState == "ADD") {
                                // Modifying a post
                                if ($scope.updateSocialPost != null) {
                                    $scope.updateSocialPost(message.updateId, message.updateContent);
                                }
                            } else if (message.updateContent  && message.updateState == "ADD") {
                                // Adding a post
                                if ($scope.allDraftedPosts != null) {
                                    for (let index = 0; index < $scope.allDraftedPosts.length; index++) {
                                        if ($scope.allDraftedPosts[index]._id == message.updateContent._id) {
                                            $scope.allDraftedPosts.splice(index, 1);
                                            break;
                                        }
                                    }
                                }
                                if ($scope.allActivePosts != null) {
                                    $scope.allActivePosts.push(message.updateContent);
                                }
                                if ($scope.tutorialMode) $scope.nextStep();
                            } else if (message.updateId && message.updateState == "DELETE"){
                                // Deleting a draft
                                if ($scope.allDraftedPosts != null) {
                                    for (let index = 0; index < $scope.allDraftedPosts.length; index++) {
                                        if ($scope.allDraftedPosts[index]._id == message.updateId) {
                                            $scope.allDraftedPosts.splice(index, 1);
                                            break;
                                        }
                                    }
                                }

                            } else if (message.updateId && message.updateContent && message.updateState == "DRAFT"){
                                // Drafting a post.
                                if ($scope.updateSocialPost != null) {
                                    $scope.updateSocialPost(message.updateId, null);
                                }
                                if ($scope.allDraftedPosts) {
                                    $scope.allDraftedPosts.unshift(message.updateContent);
                                }
                            }
                            if ($scope.tutorialMode) {
                                ngIntroService.exit();
                                ngIntroService.clear();
                                $cookies.remove("tutorial");
                                $scope.finishTutorial();
                            }
                        }, function () {


                        });
                    // $state.go('portal.schedule.edit', {postId: previousId});
                };

                $scope.toTrustedHTML = function( html ){
                    return $sce.trustAsHtml( html );
                };

                ngIntroService.onExit(function(){
                    $rootScope.finishTutorial(true);
                });


                $scope.setTheme = function (theme) {
                    $scope.theme = theme;
                    $cookies.put("theme", theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
                }

            }]);
});

