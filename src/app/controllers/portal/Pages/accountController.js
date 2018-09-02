define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('accountController', [
        '$rootScope', '$scope', '$state', '$stateParams', 'SocialAccounts', '$mdDialog', 'moment', '$window', 'Alert', 'ngIntroService', '$cookies',
        function ($rootScope, $scope, $state, $stateParams, SocialAccounts, $mdDialog, moment, $window, Alert, ngIntroService, $cookies) {
            $scope.isOpen = false;
            $scope.socialPlatformDetails = [];

            $scope.nextStep = function () {};

            if ($scope.tutorialMode) {
                ngIntroService.onExit(function(){
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
                setTimeout(function () {
                    ngIntroService.start();
                    ngIntroService.goToStepNumber($scope.$step - 1);
                }, 500)




                $scope.nextStep = function () {
                    $scope.$step++;
                    $cookies.put("tutorial", $scope.$step)
                    if ($scope.$step == 4) {
                        setTimeout(function () {
                            $scope.openMenu();
                        }, 300);
                        setTimeout(function () {
                            ngIntroService.next();
                        }, 750)
                    } else {
                        ngIntroService.next();
                    }
                };
            }


            $scope.addStack = function () {
                $scope.$emit('addStack', {});
            };
            $scope.addSocialAccount = function (platformId) {
                console.log($scope.platforms, platformId);
                if (!$scope.platforms.hasOwnProperty(parseInt(platformId)))
                    return Alert.error("Must choose a valid platform.");
                platformId = parseInt(platformId);
                $scope.nextStep();

                if (platformId == 1) {
                    $scope.nextStep();
                }

                $window.open(__API__ + '/api/v1/oauth/' + $scope.platforms[platformId].id + '/', '_self');
            };

            $scope.clickedSpeedDial = function () {
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

                $scope.linkAccount = function (socialPage) {
                    if (!socialPage.linked) {
                        socialPage.linking = true;
                        SocialAccounts.updateSocialAccount({
                            pages: [socialPage.id],
                            cache_id: $stateParams.cache_id
                        }, function (pages) {
                            socialPage.linking = false;
                            socialPage.linked = true;
                            $scope.pendingPages = $scope.pendingPages.concat(pages);
                            $scope.nextStep();
                            // $state.go('portal.accounts.home', {appendPages: pages});//If the session is invalid, take to login page.
                        }, function (status, message) {
                            socialPage.linking = false;
                            Alert.error(message);
                        });
                    }
                };
                $scope.return = function () {
                    $state.go('portal.accounts.home', {});//If the session is invalid, take to login page.
                };

                SocialAccounts.getPagesOnHold({cacheId: $stateParams.cache_id}, function (response) {
                    if (response.hasOwnProperty("pages"))
                        $scope.newPage.pages = response.pages;

                }, function (status, message) {
                    Alert.error(message);
                });
            } else {
                for (var platformKey in $scope.platforms) {
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

