/**
 * Created by Samer on 2015-09-14.
 */
define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('editPostController', ['$scope', '$stateParams', '$state',
        'SocialPosts', 'Alert', 'SocialAccounts', 'FileReader', '$filter', 'Image',
        function ($scope, $stateParams, $state, SocialPosts, Alert, SocialAccounts, FileReader, $filter, Image) {
            $scope.postId = $stateParams.postId;
            $scope.attachedImage = $stateParams.attachedImage;
            $scope.postInformation = $stateParams.postInformation;

            console.log($scope.attachedImage);

            var currentTime = new Date();
            $scope.currentSocialPost =  {
                pages: [],
                content: '',
                images: [],
                date: currentTime,
                maxLength: 280//Limit for Twitter. We wil adjust dynamically
            };
            $scope.platforms = platforms;
            // console.log($scope.currentSocialPost)


            $scope.validateTime = function (date, type) {
                // disable all Sundays in the Month View
                return date > currentTime;
            };

            $scope.choosePage = function (page_id) {
                $scope.currentSocialPost.pages = $scope.currentSocialPost.pages || [];
                if ($scope.currentSocialPost.pages.indexOf(page_id) != -1)
                    $scope.currentSocialPost.pages.splice($scope.currentSocialPost.pages.indexOf(page_id), 1);
                else
                    $scope.currentSocialPost.pages.push(page_id);
            };

            $scope.hideDialog = function () {
                $state.go('portal.schedule.table')
            };

            $scope.archivePostToggle = function () {
                SocialPosts.archivePostToggle({
                    id: $scope.postId
                }, function (postDetails) {
                    $state.go('portal.schedule.table', {'updateId': $scope.postId, 'updateContent': postDetails});
                }, function (status, message) {
                    return Alert.error("Failed to archive post.");
                })
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
                    content: $scope.currentSocialPost.content,
                    images: image_ids
                };

                params.post_time = $scope.currentSocialPost.date;

                if ($scope.postId != null)
                    params._id = $scope.postId;

                SocialPosts.submitScheduledPost(params, function (postDetails) {
                    Alert.success("Scheduled post on " + $filter('date')(postDetails.post_time, 'short'));
                    $state.go('portal.schedule.table', {'updateId': $scope.postId, 'updateContent': postDetails});
                }, function (status, message) {
                    Alert.error("Failed to submit: " + message)
                });
            };

            SocialAccounts.getSocialAccounts(function (data) {
                $scope.allPages = data;

                if ($scope.postId && !$scope.postInformation) {
                    // Editing social post
                    SocialPosts.getDetails($scope.postId,
                        function (socialPostDetails) {
                            socialPostDetails = socialPostDetails.data;
                            if (new Date(socialPostDetails.post_time).getTime() < new Date()) {
                                // Already posted
                                Alert.info("You are unable to edit a posted social post.");
                                $state.go('portal.schedule.table');
                            }

                            var chosenPlatforms = [];
                            for (var socialPageIndex in socialPostDetails.social_post) {
                                var socialPage = socialPostDetails.social_post[socialPageIndex];
                                chosenPlatforms.push(socialPage.page_id._id);
                            }
                            $scope.currentSocialPost.active = socialPostDetails.active;
                            $scope.currentSocialPost.pages = chosenPlatforms;
                            $scope.currentSocialPost.images = socialPostDetails.images;
                            $scope.currentSocialPost.content = socialPostDetails.content;
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
                } else if ($scope.postInformation){
                    console.log("Preset info",$scope.postInformation)
                    $scope.currentSocialPost = $scope.postInformation;
                    if ($scope.attachedImage) {
                        Image.getDetails($scope.attachedImage, function (data) {
                            $scope.currentSocialPost.images.push(data.data);
                        }, function (status, message) {
                            console.log("Failed?", status, message)
                        })
                    }
                }

            }, function (status, error) {
                $scope.platforms = [];
                Alert.error(error.code + ": Failed to get social accounts. ")
            });


        }]);
});

