define(['../../module'], controllers => {
    return controllers.controller('accountController', [
        '$rootScope', '$scope', '$state', '$stateParams', 'SocialAccounts', '$mdDialog', 'moment', '$window', 'Alert', 'ngIntroService', '$cookies',
        function (
            $rootScope,
            $scope,
            $state,
            $stateParams,
            SocialAccounts,
            $mdDialog,
            moment,
            $window,
            Alert,
            ngIntroService,
            $cookies
        ){
            $scope.isOpen = false;
            $scope.socialPlatformDetails = [];

            $scope.nextStep = () => {
            };


            $scope.openStatistic = pageId => {
                $state.go('portal.statistics.page_detail', {pageId}, {reload: 'portal.statistics.page_detail'})
            };


            if ($scope.tutorialMode) {
                ngIntroService.onExit(() => {
                    $rootScope.finishTutorial(true);
                });
                $scope.IntroOptions = {
                    showStepNumbers: false,
                    showBullets: false,
                    exitOnOverlayClick: false,
                    exitOnEsc: false,
                    hideNext: true,
                    hidePrev: false,
                    steps: [
                        {
                            element: ".tutorial_step_2",
                            intro: "Now click here to add your first page."
                        },
                        {
                            element: ".tutorial_step_3",
                            intro: "Choose which platform you want to link."
                        },
                        {
                            element: ".tutorial_step_4",
                            intro: "Choose one page to link from this platform."
                        },
                        {
                            element: ".tutorial_step_5",
                            intro: "Click here to schedule your first post."
                        },
                        {
                            element: ".tutorial_step_5",
                            intro: "Click here to schedule your first post."
                        },
                    ],
                };
                // ngIntroService.exit();
                // ngIntroService.clear();

                ngIntroService.setOptions($scope.IntroOptions);

                if ($cookies.get("tutorial") >= 6)
                    $cookies.remove("tutorial");

                $scope.$step = $cookies.get("tutorial") || 2;
                setTimeout(() => {
                    ngIntroService.start();
                    ngIntroService.goToStepNumber($scope.$step - 1);
                }, 500);


                $scope.nextStep = () => {
                    $scope.$step++;
                    $cookies.put("tutorial", $scope.$step);
                    if ($scope.$step == 4) {
                        setTimeout(() => {
                            $scope.openMenu();
                        }, 300);
                        setTimeout(() => {
                            ngIntroService.next();
                        }, 750)
                    } else {
                        ngIntroService.next();
                    }
                };
            }


            $scope.addStack = () => {
                $scope.$emit('addStack', {});
            };
            $scope.addSocialAccount = (platformId, $event) => {
                if (!$scope.platforms.hasOwnProperty(parseInt(platformId)))
                    return Alert.error("Must choose a valid platform.");
                platformId = parseInt(platformId);
                $scope.nextStep();

                if (platformId == 1) {
                    $scope.nextStep();
                }

                $window.open(__API__ + '/api/v1/oauth/' + $scope.platforms[platformId].id + '/', '_self');
                if ($event) $event.stopPropagation();
            };

            $scope.clickedSpeedDial = () => {
                if ($scope.$step == 2) {
                    $scope.nextStep();
                    $scope.isOpen = true;
                } else {
                    $scope.isOpen = !$scope.isOpen;
                }
            };

            if ($stateParams.cache_id != null) {
                // They are asked to choose a main page from a list.
                $scope.newPage = {
                    mainPage: null
                };
                $scope.pendingPages = [];

                $scope.linkAccount = socialPage => {
                    if (!socialPage.linked) {
                        socialPage.linking = true;
                        SocialAccounts.updateSocialAccount({
                            pages: [socialPage.id],
                            cache_id: $stateParams.cache_id
                        }, pages => {
                            socialPage.linking = false;
                            socialPage.linked = true;
                            $scope.pendingPages = $scope.pendingPages.concat(pages);
                            SocialAccounts.getSocialAccounts(null, null, socialAccounts => {
                                $rootScope.allPages = socialAccounts.pages;
                            }, (status, error) => {
                                $scope.platforms = [];
                                Alert.error(error.code + ": Failed to get social accounts. ")
                            });

                            $scope.nextStep();
                            // $state.go('portal.accounts.home', {appendPages: pages});//If the session is invalid, take to login page.
                        }, (status, message) => {
                            socialPage.linking = false;
                            Alert.error(message);
                        });
                    }
                };
                $scope.return = () => {
                    $state.go('portal.accounts.home', {});//If the session is invalid, take to login page.
                };

                SocialAccounts.getPagesOnHold({cacheId: $stateParams.cache_id}, response => {
                    if (response.hasOwnProperty("pages"))
                        $scope.newPage.pages = response.pages;

                }, (status, message) => {
                    Alert.error(message);
                });
            } else {
                for (let platformKey in $scope.platforms) {
                    if (parseInt(platformKey) == platformKey) {
                        $scope.socialPlatformDetails.push({
                            id: platformKey,
                            shortname: $scope.platforms[platformKey].id,
                            fullname: $scope.platforms[platformKey].detail
                        });
                    }
                }
            }
        }]);
});

