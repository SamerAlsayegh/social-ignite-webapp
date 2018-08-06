define(['../../module'], function (controllers) {
    'use strict';
    return controllers.controller('pageStatisticsDetailController', ['$scope', '$stateParams', 'Alert', 'SocialAccounts', 'Statistics', 'SocialPosts',
        function ($scope, $stateParams, Alert, SocialAccounts, Statistics, SocialPosts) {
            $scope.socialPages = [];
            $scope.activePage = null;

            SocialPosts.getSelectivePosts('active', {pages: [$stateParams.pageId]}, function (data) {
                $scope.scheduledPosts = data.data;
            }, function (status, error) {
                $scope.scheduledPosts = [];
                Alert.error("Failed to get all social posts.");
            });



            $scope.loadVisitors = function(page){
                $scope.activePage = page;
                if (!$scope.chartObjectVisitors) {
                    $scope.chartElementVisitors = document.getElementById("fansChart").getContext('2d');
                    $scope.chartObjectVisitors = new Chart($scope.chartElementVisitors, Statistics.getStatisticsConfig($scope.activePage.name + "\'s Overview", "Time", "Fans"));
                }
                Statistics.getPageGeneralStatistics(page._id, function (data) {
                    var fixedDataTotal = [];
                    var projectedTotal = [];
                    $scope.currentTrend = data.data.trend;
                    $scope.recent_change_7 = data.data.recent_change_7;
                    $scope.recent_change_1 = data.data.recent_change_1;

                    angular.forEach(data.data.data, function (data) {
                        if (data.p) projectedTotal.push(data);
                        else fixedDataTotal.push(data);
                    });


                    $scope.chartObjectVisitors.data.datasets = [
                        {
                            fill: true,
                            label: "Fans",

                            datalabels: {
                                display: true,
                                align: 'top',
                                anchor: 'end',
                                offset: 5,
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "#fff",
                                padding: 5,
                                rotation: 0,
                                borderRadius: 5,
                                formatter: function (value, context) {
                                    return value.posts && value.posts.length > 0 ? value.posts.length+" New Posts" : null;
                                },
                                opacity: function(context) {
                                    // Change the label text color based on our new `hovered` context value.
                                    return context.hovered ? 1 : 0.5;
                                },
                                listeners: {
                                    enter: function(context) {
                                        context.hovered = true;
                                        return true;
                                    },
                                    leave: function(context) {
                                        context.hovered = false;
                                        return true;
                                    }
                                },
                                font: function(context) {
                                    var w = context.chart.width;
                                    return {
                                        size: w < 512 ? 12 : 14
                                    }
                                },
                            },
                            lineTension: 0.3,
                            data: fixedDataTotal,
                            borderColor: "rgba(63,169,245, 0.7)",
                            backgroundColor: "rgba(63,169,245, 0.5)",

                        },
                        {
                            fill: true,
                            label: "Projection",
                            datalabels: {
                                display: false,
                            },
                            lineTension: 0.3,
                            data: projectedTotal,
                            borderColor: "rgba(0,0,0, 0.4)",
                            backgroundColor: "rgba(0,0,0, 0.3)",
                        },
                    ];
                    $scope.chartObjectVisitors.update();
                }, function (status, message) {
                    Alert.error("Failed to load statistics");
                });
            };
            SocialAccounts.getSocialAccount($stateParams.pageId, function (data) {
                $scope.loadVisitors(data);
            }, function (status, message) {
                Alert.error(message);
            });


        }]);
});

