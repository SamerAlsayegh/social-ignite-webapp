define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('editControllerDialog', ['$scope', '$rootScope',
        'SocialPosts', 'Alert', 'SocialAccounts', '$filter', 'Image', 'Action', 'SocialStacks', '$mdDialog', 'postId', 'postInformation', 'theme', 'socket', '$window', 'ngIntroService', '$cookies', 'socialPages', 'socialStacks',
        function ($scope, $rootScope, SocialPosts, Alert, SocialAccounts, $filter, Image, Action, SocialStacks, $mdDialog, postId, postInformation, theme, socket, $window, ngIntroService, $cookies, socialPages, socialStacks) {
            $scope.postId = postId;
            $scope.attachImages = false;
            $scope.postInformation = postInformation;
            $scope.hashtag_lookups = 0;
            $scope.currentTime = new Date();
            $scope.pending = false;
            $scope.draftUpdater = null;
            $scope.theme = theme;
            $scope.socket = socket;
            $scope.dirtyForm = false;
            $scope.scheduleShowing = false;
            $scope.allPages = socialPages;
            $scope.allStacks = socialStacks;
            $scope.availableImages = [];
            $scope.usedImages = [];



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
                        element: ".tutorial_step_6",
                        intro: "Choose the page you just linked."
                    },
                    {
                        element: ".tutorial_step_7",
                        intro: "Fill the post to schedule, perhaps give an update about new products.<i> Once done, stop typing and we will go to the next step.</i>"
                    },
                    {
                        element: ".tutorial_step_8",
                        intro: "To get some extra exposure we will get add Hashtags, so click here to generate some. It may take a moment to generate."
                    },
                    {
                        element: ".tutorial_step_9",
                        intro: "Choose one Hashtag for now, if a Hashtag is recommended it will be highlighted in blue."
                    },
                    {
                        element: ".tutorial_step_10",
                        intro: "We will now schedule the post, choose the hour to post at."
                    },
                    {
                        element: ".tutorial_step_10",
                        intro: "Now you can choose the minute to post at."
                    },
                    {
                        element: ".tutorial_step_11",
                        intro: "That's it! Click to schedule the post."
                    },
                ],
            }
            // ngIntroService.refresh();


            // $scope.$watch('currentSocialPost.date', function(new){
            //
            // })


            function confirmLeavePage(e) {
                if ($scope.dirtyForm) {
                    var confirmed;
                    confirmed = $window.confirm("You have unsaved edits. Do you wish to leave?");
                    if (e && !confirmed) {
                        e.returnValue = "You have unsaved edits.";
                        e.preventDefault();
                    } else {
                        $mdDialog.cancel();
                    }
                }
            }


            if (window.addEventListener) {
                $window.addEventListener("beforeunload", confirmLeavePage);
            } else {
                $window.attachEvent("onbeforeunload", confirmLeavePage); //For IE
            }

            $scope.attachImage = function () {
                setTimeout(function () {
                    angular.element(document.querySelectorAll('.imageSelector')).triggerHandler('click');
                }, 0);
            };
            $scope.scheduleShow = function () {
                $scope.scheduleShowing = true;
            }

            $scope.cancel = function () {
                $mdDialog.cancel();
            };


            setTimeout(function () {
                if ($scope.permissions_used != null)
                    $scope.hashtag_lookups = $scope.permissions_used.hashtag_lookups;
            }, 0);
            $scope.currentSocialPost = {
                pages: [],
                stacks: [],
                content: '',
                images: [],
                date: $scope.currentTime,
                maxLength: 280//Lim = false;it for Twitter. We wil adjust dynamically
            };
            $scope.platforms = platforms;

            $scope.chooseImage = function(image){
                if (image == $scope.selectedImage){
                    // Double click
                    if ($scope.currentSocialPost.images.indexOf(image) == -1){
                        $scope.currentSocialPost.images.push(image)
                    } else {
                        for (var i = 0; i > $scope.currentSocialPost.images.length; i++){
                            if ($scope.currentSocialPost.images[i]._id == image._id){
                                $scope.currentSocialPost.images.slice(i, 1);
                            }
                        }
                    }
                } else {
                    $scope.selectedImage = image;
                    console.log(image);
                }
            }


            $scope.choosePage = function (page_id, platform) {
                $scope.currentSocialPost.pages = $scope.currentSocialPost.pages || [];
                if (platform == 4) $scope.instagramWarning = true;

                if ($scope.currentSocialPost.pages.indexOf(page_id) != -1)
                    $scope.currentSocialPost.pages.splice($scope.currentSocialPost.pages.indexOf(page_id), 1);
                else
                    $scope.currentSocialPost.pages.push(page_id);
            };
            $scope.chooseStack = function (stack_id) {
                $scope.currentSocialPost.stacks = $scope.currentSocialPost.stacks || [];
                if ($scope.currentSocialPost.stacks.indexOf(stack_id) != -1)
                    $scope.currentSocialPost.stacks.splice($scope.currentSocialPost.stacks.indexOf(stack_id), 1);
                else
                    $scope.currentSocialPost.stacks.push(stack_id);
            };

            $scope.secondaryAction = function () {

                switch ($scope.currentSocialPost.state) {
                    case 'ACTIVE':
                        // Make it a draft now
                        SocialPosts.draftScheduledPost({id: $scope.postId}, function (message) {
                            // $state.go('portal.schedule.table', {});
                            $scope.currentSocialPost.post_time = $scope.currentSocialPost.date;
                            $scope.currentSocialPost._id = $scope.postId;
                            $mdDialog.hide({
                                'updateId': $scope.postId,
                                'updateState': 'DRAFT',
                                'updateContent': $scope.currentSocialPost
                            });

                            // $state.transitionTo('portal.schedule.table', {
                            //     'updateId': $scope.postId,
                            //     'updateState': 'DRAFT',
                            //     'updateContent': $scope.currentSocialPost
                            // });

                        }, function (status, message) {
                            Alert.error(message);
                        });

                        break;
                    case 'DRAFT':
                        // Delete the post.
                        SocialPosts.deletePost($scope.postId, function (message) {
                            $mdDialog.hide({
                                'updateId': $scope.postId,
                                'updateState': 'DELETE',
                                'updateContent': null
                            });


                            // $state.transitionTo('portal.schedule.table', {
                            //     'updateId': $scope.postId,
                            //     'updateState': 'DELETE',
                            //     'updateContent': null
                            // });
                        }, function (status, message) {
                            Alert.error(message);
                        });
                        break;

                }
            };

            $scope.changedForm = function () {
                SocialPosts.draftScheduledPost()
            };

            $scope.getHashtags = function (content, forceRefresh) {
                if (content.length > 0 && $scope.postId != null) {
                    $scope.hashtagsLoading = true;
                    Action.fetchHashtags(content, forceRefresh, $scope.postId, function (message, used) {
                        $scope.hashtags = message
                        $scope.hashtag_lookups = used;
                        if ($scope.hashtags.length == 0) {
                            $scope.nextStep();
                        }
                        $scope.hashtagsLoading = false;
                    }, function (status, message) {
                        Alert.error(message);
                        $scope.hashtagsLoading = false;
                    })
                } else {
                    Alert.error("Must have some content to lookup.")
                }
            };

            $scope.addHashtag = function (hashtag) {
                if (!$scope.hashtagUsed(hashtag)) {
                    // Add the hashtag
                    if (!$scope.currentSocialPost.content.endsWith(" ")) $scope.currentSocialPost.content += " ";
                    $scope.currentSocialPost.content += "#" + hashtag + " ";
                }
            };
            $scope.hashtagUsed = function (hashtag) {
                return $scope.currentSocialPost.content.indexOf("#" + hashtag + " ") != -1;
            };


            $scope.$watch("currentSocialPost", function (newValue, oldValue) {
                if (newValue == oldValue || newValue == null) return;


                if (newValue.images.length > 0) $scope.attachImages = true;
                else $scope.attachImages = false;

                $scope.dirtyForm = true;
                if ($scope.currentSocialPost.content.length > 0) {
                    if ($scope.draftUpdater != null)
                        clearTimeout($scope.draftUpdater);
                    if ($scope.contentUpdater != null)
                        clearTimeout($scope.contentUpdater);
                    try {
                        $scope.draftUpdater = setTimeout(function () {
                            if ($scope.currentSocialPost.state != "ACTIVE") {
                                $scope.applyDraft();
                            }
                        }, 2000);
                    } catch (e) {
                        console.log(e)
                    }
                    if (newValue.content != oldValue.content) {
                        $scope.contentUpdater = setTimeout(function () {
                            $scope.nextStep();
                        }, 2000);
                    }

                    if (oldValue.dateString != newValue.dateString) {
                        $scope.nextStep();
                    }

                }
            }, true);

            $scope.applyDraft = function () {
                var image_ids = [];
                angular.forEach($scope.currentSocialPost.images, function (image) {
                    image_ids.push(image._id);
                });

                var params = {
                    pages: $scope.currentSocialPost.pages,
                    stacks: $scope.currentSocialPost.stacks,
                    content: $scope.currentSocialPost.content.length > 0 ? $scope.currentSocialPost.content : '',
                    images: image_ids
                };

                params.post_time = $scope.currentSocialPost.date;

                if ($scope.postId != null)
                    params.id = $scope.postId;
                if ($scope.postId) {
                    $scope.socket.emit('updateDraft', params);
                    $scope.dirtyForm = false;
                } else {
                    SocialPosts.draftScheduledPost(params, function (data) {
                        $scope.postId = data._id;
                        // if ($stateParams.postId != $scope.postId) {
                        //     $state.go('portal.schedule.edit', {postId: $scope.postId}, {reload: false})
                        //
                        // }
                        $scope.dirtyForm = false;
                    }, function (status, message) {
                        Alert.error("Failed to save draft")
                    });
                }
            };


            $scope.submitPost = function () {
                if ($scope.currentSocialPost.pages.length == 0)
                    return Alert.error("You must choose at least one platform.")
                else if ($scope.currentSocialPost.content.length == 0)
                    return Alert.error("You must have some content.");

                var image_ids = [];
                angular.forEach($scope.currentSocialPost.images, function (image) {
                    image_ids.push(image._id);
                });

                var params = {
                    pages: $scope.currentSocialPost.pages,
                    stacks: $scope.currentSocialPost.stacks,
                    content: $scope.currentSocialPost.content,
                    images: image_ids
                };

                params.post_time = $scope.currentSocialPost.date;

                if ($scope.postId != null)
                    params.id = $scope.postId;


                if (!$scope.pending) {
                    $scope.pending = true;
                    SocialPosts.submitScheduledPost(params, function (postDetails) {
                        $scope.pending = false;
                        Alert.success("Scheduled post on " + $filter('date')(postDetails.post_time, 'short'));
                        // $state.transitionTo('portal.schedule.table', {
                        //     'updateId': null,
                        //     'updateState': 'ADD',
                        //     'updateContent': postDetails
                        // });
                        $mdDialog.hide({
                            'updateId': null,
                            'updateState': 'ADD',
                            'updateContent': postDetails
                        });

                    }, function (status, message) {
                        $scope.pending = false;
                        Alert.error("Failed to submit: " + message)
                    });
                }
            };


            // Get the simple list which basically is the grouped up version?


                    if ($scope.allPages.length == 0) {
                        Alert.error("You must add a social account first.");
                        $mdDialog.cancel();
                        $state.go('portal.accounts.home');
                    }
                    else {
                        // setTimeout(function () {
                        //     $scope.step();
                        // }, 0);
                        $scope.nextStep = function () {};
                        if ($cookies.get("tutorial") != null) {
                            // ngIntroService.clear();
                            ngIntroService.onExit(function(){
                                $rootScope.finishTutorial(true);
                            });

                            ngIntroService.setOptions($scope.IntroOptions);

                            if ($cookies.get("tutorial") >= 10)
                                $cookies.remove("tutorial");

                            $scope.$step = $cookies.get("tutorial") || 6;
                            setTimeout(function () {
                                ngIntroService.start();
                            }, 500)


                            $scope.nextStep = function () {
                                $scope.$step++;
                                $cookies.put("tutorial", $scope.$step);
                                ngIntroService.next();
                            };
                        }

                        if ($scope.postId && !$scope.postInformation) {
                            // Editing social post
                            SocialPosts.getDetails($scope.postId,
                                function (socialPostDetails) {
                                    if (socialPostDetails != null && new Date(socialPostDetails.post_time).getTime() < new Date() && socialPostDetails.state != "DRAFT") {
                                        // Already posted
                                        Alert.info("You are unable to edit a posted social post.");
                                        // $state.go('portal.schedule.table');
                                    }

                                    var chosenPlatforms = [];
                                    for (var socialPageIndex in socialPostDetails.pages) {
                                        var socialPage = socialPostDetails.pages[socialPageIndex];
                                        chosenPlatforms.push(socialPage);
                                    }
                                    $scope.currentSocialPost.stacks = socialPostDetails.stacks;
                                    $scope.currentSocialPost.state = socialPostDetails.state;
                                    $scope.currentSocialPost.pages = chosenPlatforms;
                                    $scope.currentSocialPost.images = socialPostDetails.images;
                                    $scope.currentSocialPost.content = socialPostDetails.content;

                                    if (socialPostDetails.images.length > 0) {
                                        socialPostDetails.images.forEach(function(image){
                                            Image.getDetails(image._id, function (data) {
                                                $scope.usedImages.push(data.data);
                                            }, function (status, message) {
                                                console.log("Failed?", status, message)
                                            })
                                        });
                                        Image.getDetails($scope.attachedImage, function (data) {
                                            $scope.currentSocialPost.images.push(data.data);
                                        }, function (status, message) {
                                            console.log("Failed?", status, message)
                                        })

                                    }

                                    // var time = new Date(socialPostDetails.post_time);
                                    if ($scope.attachedImage) {
                                        Image.getDetails($scope.attachedImage, function (data) {
                                            $scope.currentSocialPost.images.push(data.data);
                                        }, function (status, message) {
                                            console.log("Failed?", status, message)
                                        })
                                    }


                                    $scope.currentSocialPost.date = moment(socialPostDetails.post_time);
                                }, function (status, message) {
                                    // Failed to get details...
                                    console.log(message);
                                    $scope.postId = null;
                                    Alert.error("Failed to get details of this post. Creating new post.");

                                })
                        } else if ($scope.postInformation) {
                            $scope.currentSocialPost = Object.assign($scope.currentSocialPost, $scope.postInformation);
                            $scope.currentSocialPost.date = moment($scope.currentSocialPost.date);
                            if ($scope.postInformation.attachedImages != null && $scope.postInformation.attachedImages.length > 0) {
                                $scope.attachImages = true;
                                for (var index = 0; index < $scope.postInformation.attachedImages.length; index++) {
                                    Image.getDetails($scope.postInformation.attachedImages[index], function (data) {
                                        $scope.currentSocialPost.images.push(data.data);
                                    }, function (status, message) {
                                        Alert.error("Failed to get images");
                                    })
                                }
                            }
                        } else {
                            // $scope.applyDraft();
                        }
                        Image.getImages(null, function(images){
                            $scope.availableImages = images.data.images;
                        }, function(status, message){

                        })
                    }



        }]);
});

