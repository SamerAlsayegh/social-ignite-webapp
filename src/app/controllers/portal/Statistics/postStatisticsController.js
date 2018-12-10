define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('postStatisticsController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state', '$mdDialog',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state, $mdDialog) {
            $scope.postId = $stateParams.postId;
            $scope.socialPages = [];
            $scope.supportedStatistics = [];


            SocialPosts.getDetails($scope.postId, function (socialPost) {
                $scope.mainSocialPost = socialPost;
                SocialPosts.getSocialPosts($scope.postId, null, function (socialPosts) {
                    socialPosts.social_posts.forEach(function (socialpost) {
                        socialpost.page_id.social_post = socialpost._id;
                        $scope.socialPages.push(socialpost.page_id)

                    });
                    if ($scope.socialPages.length > 0) {
                        console.log($scope.socialPages)
                        $scope.loadStats($scope.socialPages[0].social_post);
                    }
                }, function (status, message) {
                    Alert.error(message);
                });
            }, function (status, message) {
                Alert.error(message);
            });




            $scope.return = function () {
                $state.go('portal.schedule.table')
            };
            $scope.loadStats = function (socialPostId) {
                if (socialPostId === $scope.socialPostId) return;
                $scope.socialPostId = socialPostId;
                $scope.socialPost = null;
                $scope.openStat = null;
                $scope.supportedStatistics = [];

                $scope.loadVisitors = function () {
                    if (!$scope.chartObjectVisitors) {
                        $scope.chartElementVisitors = document.getElementById("visitorsChart").getContext('2d');
                        $scope.chartObjectVisitors = new Chart($scope.chartElementVisitors, Statistics.getStatisticsConfig("Post Statistics", "Time", "Value"));
                    }
                    Statistics.getPostStatistics($scope.socialPost._id, ["views.total"], function (data) {

                        $scope.chartObjectVisitors.data.datasets = [
                            {
                                label: 'Visitors (Total)',
                                borderColor: "rgba(63,169,245, 0.7)",
                                backgroundColor: "rgba(63,169,245, 0.5)",
                                fill: true,
                                datalabels: {
                                    display: false,
                                },
                                lineTension: 0.3,
                                data: data,
                            },
                        ];
                        $scope.chartObjectVisitors.update();
                        $scope.chartObjectVisitors.resize();
                    }, function (status, message, rawMessage) {
                        Alert.error(message);

                    });
                };

                $scope.loadLikes = function () {

                    if (!$scope.chartObjectLikes) {
                        $scope.chartElementLikes = document.getElementById("likesChart").getContext('2d');
                        $scope.chartObjectLikes = new Chart($scope.chartElementLikes, Statistics.getStatisticsConfig("Post Statistics", "Time", "Value"));
                    }

                    Statistics.getPostStatistics($scope.socialPost._id, ["likes.total"], function (data) {
                        $scope.chartObjectLikes.data.datasets = [
                            {
                                label: 'Likes (Total)',
                                borderColor: "rgba(63,169,245, 0.7)",
                                backgroundColor: "rgba(63,169,245, 0.5)",
                                fill: true,
                                datalabels: {
                                    display: false,
                                },
                                lineTension: 0.3,
                                data: data,
                            }
                        ];

                        $scope.chartObjectLikes.update();
                        $scope.chartObjectLikes.resize();
                    }, function (status, message, rawMessage) {
                        Alert.error(message);
                    });
                };

                SocialPosts.getSocialPost($scope.postId, socialPostId, function (message) {
                    $scope.socialPost = message;
                    if ($scope.socialPost.statistic.likes != null && $scope.socialPost.statistic.likes.total != null)
                        $scope.supportedStatistics.push("likes.total");
                    if ($scope.socialPost.statistic.likes != null && $scope.socialPost.statistic.likes.new != null)
                        $scope.supportedStatistics.push("likes.new");
                    if ($scope.socialPost.statistic.views != null && $scope.socialPost.statistic.views.total != null)
                        $scope.supportedStatistics.push("views.total");

                    if ($scope.supportedStatistics.indexOf("views.total") !== -1) $scope.loadVisitors();
                    if ($scope.supportedStatistics.indexOf("likes.total") !== -1) $scope.loadLikes();
                    console.log($scope.socialPost);

                }, function (status, message) {
                    Alert.error(message);
                });
            }


        }]);
});

