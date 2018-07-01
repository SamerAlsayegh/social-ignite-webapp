define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('postStatisticsController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state) {
            var postId = $stateParams.postId;
            $scope.platforms = platforms;
            $scope.socialPosts = [];
            $scope.activeSocialPost = null;
            $scope.openStat = null;

            $scope.$watch('openStat', function (newVar, oldVar) {
                console.log("Changed visitors?", newVar)
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
                console.log(data);
                SocialPosts.getSocialPosts(data._id, null, function (message) {
                    $scope.socialPosts = message.social_posts;
                    if ($scope.socialPosts.length > 0){
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

            $scope.loadVisitors = function(){
                $scope.chartElementVisitors = document.getElementById("visitorsChart").getContext('2d');
                $scope.chartConfigVisitors = {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Visitors (Total)',
                            data: [{x:0, y: 0}],
                        },
                            {
                                label: 'Visitors (Unique)',
                                data: [{x:0, y: 0}],
                            }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: true,
                        title: {
                            display: true,
                            text: 'Post Statistics'
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                display: true,
                                scaleLabel: {
                                    display: false,
                                    labelString: 'Date'
                                },
                                ticks: {
                                    major: {
                                        fontStyle: 'bold',
                                        fontColor: '#FF0000'
                                    }
                                },
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'value'
                                }
                            }]
                        }
                    }
                };
                $scope.chartObjectVisitors = new Chart($scope.chartElementVisitors, $scope.chartConfigVisitors);
                Statistics.getPostStatistics($scope.activeSocialPost._id, ["views.total"], function (data) {
                    var fixedDataTotal = data.data.set;

                    // Statistics.getPostStatistics(socialPost._id, ["views.unique"], function (data) {
                    //     console.log(data);
                    //     var fixedDataUnique = data.data.set;

                    $scope.chartObjectVisitors.data.datasets = [];

                    $scope.chartObjectVisitors.data.datasets = [
                        {
                            label: 'Visitors (Total)',
                            fill: true,
                            data: fixedDataTotal,
                        },
                        // {
                        //     label: 'Visitors (Unique)',
                        //     fill: false,
                        //     data: fixedDataUnique,
                        // },
                        {
                            label: 'Trend-line',
                            borderColor: "#000",
                            borderWidth: 1,
                            fill: false,
                            data: [
                                data.data.other.bestFit.start,
                                data.data.other.bestFit.end
                            ],
                        },
                    ];
                    $scope.chartObjectVisitors.update();
                    // }, function (status, message) {
                    //     Alert.error("Failed to load statistics");
                    // })
                }, function (status, message) {
                    Alert.error("Failed to load statistics");
                });
            };

            $scope.loadLikes = function(){
                $scope.chartElementLikes = document.getElementById("likesChart").getContext('2d');
                $scope.chartConfigLikes = {
                    type: 'bar',
                    data: {
                        datasets: [{
                            label: 'Likes (Total)',
                            data: [{x:0, y: 0}],
                        },
                            {
                                label: 'Likes (New)',
                                data: [{x:0, y: 0}],
                            }]
                    },
                    options: {
                        responsive: false,
                        maintainAspectRatio: true,
                        title: {
                            display: true,
                            text: 'Post Statistics'
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                display: true,
                                scaleLabel: {
                                    display: false,
                                    labelString: 'Date'
                                },
                                ticks: {
                                    major: {
                                        fontStyle: 'bold',
                                        fontColor: '#FF0000'
                                    }
                                },
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'value'
                                }
                            }]
                        }
                    }
                };
                $scope.chartObjectLikes = new Chart($scope.chartElementLikes, $scope.chartConfigLikes);
                Statistics.getPostStatistics($scope.activeSocialPost._id, ["likes.total"], function (data) {
                    var fixedDataTotal = data.data.set;

                    // Statistics.getPostStatistics(socialPost._id, ["likes.new"], function (data) {
                    //     console.log(data);
                    //     var fixedDataUnique = data.data.set;

                    $scope.chartObjectLikes.data.datasets = [
                        {
                            label: 'Likes (Total)',
                            fill: true,
                            data: fixedDataTotal,
                        },
                        // {
                        //     label: 'Likes (New)',
                        //     fill: false,
                        //     data: fixedDataUnique,
                        // },
                        {
                            label: 'Trend-line',
                            borderColor: "#000",
                            borderWidth: 1,
                            fill: false,
                            data: [
                                data.data.other.bestFit.start,
                                data.data.other.bestFit.end
                            ],
                        },
                    ];


                    // $scope.chartObjectLikes.options.annotation = {
                    //     annotations: [{
                    //         type: 'line',
                    //         mode: 'horizontal',
                    //         scaleID: 'y-axis-0',
                    //         value: ,
                    //         endValue: data.data.other.bestFit.end.y,
                    //         borderColor: 'rgb(75, 192, 192)',
                    //         borderWidth: 4,
                    //         label: {
                    //             enabled: true,
                    //             content: 'Trend',
                    //             yAdjust: 0,
                    //         }
                    //     }]
                    // };




                    $scope.chartObjectLikes.update();
                    // }, function (status, message) {
                    //     Alert.error("Failed to load statistics");
                    // })
                }, function (status, message) {
                    Alert.error("Failed to load statistics");
                });
            };


            $scope.return = function () {
                $state.go('portal.schedule.table')
            };


        }]);
});

