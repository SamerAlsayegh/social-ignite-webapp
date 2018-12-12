require("expose-loader?io!socket.io-client");

// require("expose-loader?moment!moment");

define(['../module'], controllers => {
    return controllers.controller('portalHomeController',
        ['$rootScope', '$scope', 'Auth', 'Alert', 'Action', 'Dashboard', 'PostComment', '$mdSidenav', '$cookies',
            'Profile', 'General', '$state', '$mdDialog', 'ngIntroService', '$http', "SocialStacks", "SocialAccounts", "$transitions", "$sce", "SocialPosts",
            function (
                $rootScope,
                $scope,
                Auth,
                Alert,
                Action,
                Dashboard,
                PostComment,
                $mdSidenav,
                $cookies,
                Profile,
                General,
                $state,
                $mdDialog,
                ngIntroService,
                $http,
                SocialStacks,
                SocialAccounts,
                $transitions,
                $sce,
                SocialPosts
            ) {
                $scope.permissions = {};
                $scope.platforms = $rootScope.platforms;
                $scope.notifications = [];
                $rootScope.theme = $rootScope.user && $rootScope.user.options ? $rootScope.user.options.theme : "default";
                if ($rootScope.user != null)
                    $rootScope.tutorialMode = false;//($rootScope.user != null && $rootScope.user.information != null) ? ($rootScope.user.information.tutorial_step == 999 ? false : true) : false;
                $scope.socket = io(__SOCKETS__);

                $scope.socket.on('connect', () => {
                    console.log("Connected to Sockets");
                    $scope.socket.emit('getOnline');
                    if ($scope.disconnected) {
                        delete $scope.disconnected;
                        Alert.success("Reconnected.")
                    }
                });
                $scope.toggleMenu = () => {
                    $mdSidenav('left').toggle();
                };
                $scope.openMenu = () => {
                    $mdSidenav('left').open();
                };


                $scope.socket.on('changedScope', () => {
                    Auth.logout(() => {
                        Alert.error("Your scope has been changed, please relogin...");
                    }, (status, message) => {
                        Alert.error(message);
                    })
                });

                $scope.socket.on('updatingPageStatistic', (progress, pageName) => {
                    Alert.info(progress + " page statistic updates for " + pageName)
                });

                $scope.socket.on('updatingPostStatistic', (progress, pageName) => {
                    Alert.info(progress + " post statistic updates for " + pageName)
                });
                $scope.socket.on('updatingPostInformation', (progress, pageName) => {
                    Alert.info(progress + " post statistic updates for " + pageName)
                });
                $scope.socket.on('postedScheduledPost', (data, le) => {
                    Alert.success("A scheduled post is now live.")
                });


                $scope.socket.on('disconnect', () => {
                    $scope.disconnected = true;
                    Alert.error("Lost connection... Reconnecting.");
                });

                Profile.getPermissions(data => {
                    $scope.permissions = data.data.permissions;
                    $scope.limits = data.data.limits;
                    $scope.used = data.data.used;
                }, (status, message) => {
                    Alert.error(message, 600);
                });
                $scope.allowedActions = [];
                Action.getAllowedActions(data => {
                    $scope.allowedActions = data;
                    console.log($scope.allowedActions);
                }, (status, message) => {
                    // Alert.error(message, 600);
                });
                SocialStacks.getSocialStacks(true, false, 1, socialStacks => {
                    $scope.allStacks = socialStacks.social_stacks;
                    SocialAccounts.getSocialAccounts(null, null, socialAccounts => {
                        $rootScope.allPages = socialAccounts.pages;
                    }, (status, error) => {
                        $scope.platforms = [];
                        Alert.error(error.code + ": Failed to get social accounts. ")
                    });
                }, (status, error) => {
                    $scope.platforms = [];
                    Alert.error(error.code + ": Failed to get social stacks. ")
                });


                General.getNotifications(data => {
                    $scope.notifications = data.data;
                }, (status, message) => {

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
                    steps: [
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
                    $scope.$step = $cookies.get("tutorial") || 1;
                    if ($scope.$step === 1) {
                        setTimeout(() => {
                            $scope.openMenu();
                        }, 300);
                        setTimeout(() => {
                            ngIntroService.start();
                        }, 750)
                    }


                    if ($cookies.get("tutorial") > 5)
                        $cookies.remove("tutorial");

                    $scope.nextStep = () => {
                        $scope.$step++;
                        $cookies.put("tutorial", $scope.$step);
                        ngIntroService.next();
                    };
                }

                $rootScope.finishTutorial = skipped => {
                    if ($scope.tutorialMode) {
                        $scope.tutorialMode = false;
                        Profile.updateUser({
                            tutorial_step: 999,
                        }, result => {
                            if (skipped) {
                                Alert.success("Skipping tutorial. To restart tutorial, access 'Profile'.", 4000);
                            } else {
                                Alert.success("Successfully finished tutorial. If you need help, contact support.", 4000);
                            }
                        }, (status, message) => {
                            Alert.error(message);
                        })
                    }
                };

                $scope.platformLookup = platformId => platforms[platformId];


                /**
                 * Logout user
                 */
                $scope.logout = () => {
                    Auth.logout(data => {
                        Alert.info('Logged out successfully!');
                        $state.go('public.login', {}, {reload: 'public.login'});
                    }, (err, data) => {
                        Alert.error('Failed to log out.');
                    });
                };
                $scope.resendEmail = () => {
                    Auth.requestEmailResend($scope.user.email, data => {
                        Alert.success("An email should be on the way.");
                    }, (status, message) => {
                        Alert.error(message);
                    });
                };


                $rootScope.addPost = (previousId, postInformation) => {
                    $mdDialog.show({
                        locals: {
                            'postId': previousId,
                            'postInformation': postInformation,
                            'theme': $scope.theme,
                            'socket': $scope.socket,
                            'socialStacks': $scope.allStacks,
                            'socialPages': $rootScope.allPages,
                        },
                        template: require("compile-ejs-loader!../../views/_portal/schedule/_scheduleDialog.ejs")(),
                        controller: 'editControllerDialog',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        fullscreen: true // Only for -xs, -sm breakpoints.
                    })
                        .then(message => {
                            if (message.updateId && message.updateContent && message.updateState === "ADD") {
                                // Modifying a post
                                if ($scope.updateSocialPost != null) {
                                    $scope.updateSocialPost(message.updateId, message.updateContent);
                                }
                            } else if (message.updateContent && message.updateState === "ADD") {
                                // Adding a post
                                if ($scope.allDraftedPosts != null) {
                                    for (let index = 0; index < $scope.allDraftedPosts.length; index++) {
                                        if ($scope.allDraftedPosts[index]._id === message.updateContent._id) {
                                            $scope.allDraftedPosts.splice(index, 1);
                                            break;
                                        }
                                    }
                                }
                                if ($scope.allActivePosts != null) {
                                    $scope.allActivePosts.push(message.updateContent);
                                }
                                if ($scope.tutorialMode) $scope.nextStep();
                            } else if (message.updateId && message.updateState === "DELETE") {
                                // Deleting a draft
                                if ($scope.allDraftedPosts != null) {
                                    for (let index = 0; index < $scope.allDraftedPosts.length; index++) {
                                        if ($scope.allDraftedPosts[index]._id === message.updateId) {
                                            $scope.allDraftedPosts.splice(index, 1);
                                            break;
                                        }
                                    }
                                }

                            } else if (message.updateId && message.updateContent && message.updateState === "DRAFT") {
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
                        }, () => {


                        });
                    // $state.go('portal.schedule.edit', {postId: previousId});
                };


                $rootScope.deletePost = socialPostId => {
                    let confirm = $mdDialog.confirm()
                        .title('Would you like to delete this post?')
                        .textContent('Posts will be deleted across all supported platforms. You will be prompted if they need manual intervention.')
                        .ok('Confirm delete')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(() => {
                        SocialPosts.deletePostedSocialPostMain(socialPostId, message => {
                            if (message.deleted_all) {
                                Alert.success("Deleted social post across all platforms");
                                $state.go('portal.schedule.table', {}, {reload: true});
                            } else {
                                Alert.info("Some posts can't be deleted. Pages shows need manual post deletion.");
                                angular.forEach($scope.socialPages, socialPage => {
                                    if (message.deleted.indexOf(socialPage._id) !== -1)
                                        socialPage.deleted = true;
                                });
                            }
                        }, (status, message) => {
                            Alert.error(message);
                        })
                    }, () => {

                    });
                };

                $scope.toTrustedHTML = html => $sce.trustAsHtml(html);

                ngIntroService.onExit(() => {
                    $rootScope.finishTutorial(true);
                });


                $scope.setTheme = theme => {
                    $rootScope.theme = theme;
                    $cookies.put("theme", theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
                }

            }]);
});

