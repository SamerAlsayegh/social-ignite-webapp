define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('postStatisticsController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state) {
            var postId = $stateParams.postId;
            $scope.socialPosts = [];
            $scope.activeSocialPost = null;
            $scope.openStat = null;

            $scope.$watch('openStat', function (newVar, oldVar) {
                if ($scope.activeSocialPost != null) {
                    switch (newVar) {
                        case 'likes':
                            $scope.loadLikes();
                            break;
                        case 'visitors':
                            $scope.loadVisitors();
                            break;
                    }
                }


            }, true);


            SocialPosts.getDetails(postId, function (data) {
                SocialPosts.getSocialPosts(data._id, null, function (message) {
                    $scope.socialPosts = message.social_posts;
                    if ($scope.socialPosts.length > 0) {
                        $scope.activeSocialPost = $scope.socialPosts[0];
                        switch ($scope.openStat) {
                            case 'likes':
                                $scope.loadLikes();
                                break;
                            case 'visitors':
                                $scope.loadVisitors();
                                break;
                        }
                    }
                }, function (status, message) {
                    Alert.error(message);
                })

            }, function (status, message) {
                Alert.error(message);
            });

            $scope.loadVisitors = function () {
                if (!$scope.chartObjectVisitors) {
                    $scope.chartElementVisitors = document.getElementById("visitorsChart").getContext('2d');
                    $scope.chartObjectVisitors = new Chart($scope.chartElementVisitors, Statistics.getStatisticsConfig("Post Statistics", "Time", "Value"));
                }

                Statistics.getPostStatistics($scope.activeSocialPost._id, ["views.total"], function (data) {
                    var fixedDataTotal = data.data.set;
                    $scope.chartObjectVisitors.data.datasets = [];

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
                            data: fixedDataTotal,
                        },
                        // {
                        //     label: 'Trend-line',
                        //     borderColor: "rgba(0,0,0, 0.4)",
                        //     backgroundColor: "rgba(0,0,0, 0.3)",
                        //     fill: false,
                        //     datalabels: {
                        //         display: false,
                        //     },
                        //     data: [
                        //         data.data.other.bestFit.start,
                        //         data.data.other.bestFit.end
                        //     ],
                        // },
                    ];
                    $scope.chartObjectVisitors.update();
                }, function (status, message, rawMessage) {
                    console.log(rawMessage, $scope.errorCodes.Disabled.id, rawMessage != $scope.errorCodes.Disabled.id)
                    if (rawMessage != $scope.errorCodes.Disabled.id) {
                        Alert.error("Failed to load statistics");
                    } else {
                        $scope.viewsUnsupported = true;
                    }
                });
            };

            $scope.loadLikes = function () {

                if (!$scope.chartObjectLikes) {
                    $scope.chartElementLikes = document.getElementById("likesChart").getContext('2d');
                    $scope.chartObjectLikes = new Chart($scope.chartElementLikes, Statistics.getStatisticsConfig("Post Statistics", "Time", "Value"));
                }

                Statistics.getPostStatistics($scope.activeSocialPost._id, ["likes.total"], function (data) {
                    var fixedDataTotal = data.data.set;

                    $scope.chartObjectLikes.data.datasets = [
                        {
                            label: 'Likes (Total)',
                            borderColor: "rgba(63,169,245, 0.7)",
                            backgroundColor: "rgba(63,169,245, 0.5)",
                            fill: true,
                            lineTension: 0.3,
                            data: fixedDataTotal,

                        }
                    ];

                    $scope.chartObjectLikes.update();
                }, function (status, message, rawMessage) {
                    if (rawMessage != $scope.errorCodes.Disabled) {
                        Alert.error("Failed to load statistics");
                    } else {
                        $scope.likesUnsupported = true;
                    }
                });
            };


            $scope.return = function () {
                $state.go('portal.schedule.table')
            };


        }]);
});

