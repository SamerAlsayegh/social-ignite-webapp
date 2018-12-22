define(['../../module'], controllers => {
    return controllers.controller('pageStatisticsDetailController', ['$scope', '$state', '$stateParams', 'Alert', 'SocialAccounts', 'Statistics', 'SocialPosts',
        function (
            $scope,
            $state,
            $stateParams,
            Alert,
            SocialAccounts,
            Statistics,
            SocialPosts
        ) {
            $scope.socialPages = [];
            $scope.activePage = null;

            $scope.enabledCard = {
                f_analysis_age: true,
                f_analysis_gender: true,
                audience_change: true,
                analysis: true,
            };

            $scope.loadedCard = {
                f_analysis_age: false,
                f_analysis_gender: false,
                audience_change: false,
                analysis: false,
            };

            $scope.commitRecommendation = recommendation => {
                if (recommendation.type === 'SUGGESTED_TIME') {
                    $scope.addPost(null, {date: recommendation.value})
                } else if (recommendation.type === 'LAST_POST_OLD') {
                    $scope.addPost(null, {date: recommendation.value})
                } else if (recommendation.type === 'SUGGESTED_POST_TYPE_VIEWS') {
                    $state.go('portal.resources.view', {}, {reload: 'portal.resources.view'});
                } else
                    return null;

            };

            SocialPosts.getSelectivePosts('active', {pages: [$stateParams.pageId]}, data => {
                $scope.scheduledPosts = data.data;
            }, (status, error) => {
                $scope.scheduledPosts = [];
                Alert.error("Failed to get all social posts.");
            });

            Chart.plugins.register({
                afterDraw(chart) {
                    if (chart.data.datasets.length === 0) {
                        // No data is present
                        let ctx = chart.chart.ctx;
                        let width = chart.chart.width;
                        let height = chart.chart.height;
                        chart.clear();
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'grey';
                        ctx.font = "48px Arial";
                        ctx.fillText('Loading data', width / 2, (height / 2) - 50);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'grey';
                        ctx.font = "22px Arial";
                        ctx.fillText('Please wait...', width / 2, (height / 2) + 50);
                        ctx.restore();
                    } else if (chart.data.datasets[0].data.length < 2) {
                        let ctx = chart.chart.ctx;
                        let width = chart.chart.width;
                        let height = chart.chart.height;
                        chart.clear();
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'grey';
                        ctx.font = "48px Arial";
                        ctx.fillText('No data for display', width / 2, (height / 2) - 50);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'grey';
                        ctx.font = "22px Arial";
                        ctx.fillText('Check back later as we collect some.', width / 2, (height / 2) + 50);
                        ctx.restore();
                    }
                }
            });

            $scope.loadVisitors = page => {
                $scope.activePage = page;
                if (!$scope.chartObjectVisitors) {
                    $scope.chartElementVisitors = document.getElementById("fansChart").getContext('2d');
                    $scope.chartObjectVisitors = new Chart($scope.chartElementVisitors, Statistics.getStatisticsConfig($scope.activePage.name + "\'s Overview", "Time", "Fans"));
                }

                Statistics.getPageGeneralStatistics(page._id, data => {
                    let fixedDataTotal = [];
                    let projectedTotal = [];
                    $scope.currentTrend = data.trend;
                    $scope.recent_change_7 = data.recent_change_7;
                    $scope.recent_change_1 = data.recent_change_1;

                    angular.forEach(data.dataset, data => {
                        if (data.p) projectedTotal.push(data);
                        else fixedDataTotal.push(data);
                    });


                    //
                    // let TESTER = document.getElementById('tester');
                    // let defaultPlotlyConfiguration = {responsive: true, modeBarButtonsToRemove: ['sendDataToCloud', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'lasso2d', 'select2d'], displaylogo: false, showTips: true };
                    //
                    // Plotly.plot( TESTER, [
                    //     {
                    //         x: Array.from(fixedDataTotal, x => x.x),
                    //         y: Array.from(fixedDataTotal, x => x.y),
                    //         name: 'Visitors',
                    //         type: 'scatter'
                    //     },
                    //     {
                    //         x: Array.from(projectedTotal, x => x.x),
                    //         y: Array.from(projectedTotal, x => x.y),
                    //         name: 'Predicted',
                    //         type: 'scatter'
                    //     }
                    // ],{
                    //     xaxis: {
                    //         title: 'Time',
                    //         titlefont: {
                    //             family: 'Courier New, monospace',
                    //             size: 18,
                    //             color: '#7f7f7f'
                    //         },
                    //         fixedrange: true
                    //     },
                    //     yaxis: {
                    //         title: 'Fans',
                    //         titlefont: {
                    //             family: 'Courier New, monospace',
                    //             size: 18,
                    //             color: '#7f7f7f'
                    //         },
                    //         fixedrange: true
                    //     },
                    //     autosize: true,
                    //     margin: {
                    //         t: 20, //top margin
                    //         l: 20, //left margin
                    //         r: 20, //right margin
                    //         b: 20 //bottom margin
                    //     }}, defaultPlotlyConfiguration);
                    //
                    // setTimeout(function () {
                    //     Plotly.Plots.resize(TESTER);
                    // }, 0);


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
                                formatter(value, context) {
                                    return value.posts && value.posts.length > 0 ? value.posts.length + " New Posts" : null;
                                },
                                opacity(context) {
                                    // Change the label text color based on our new `hovered` context value.
                                    return context.hovered ? 1 : 0.5;
                                },
                                listeners: {
                                    enter(context) {
                                        context.hovered = true;
                                        return true;
                                    },
                                    leave(context) {
                                        context.hovered = false;
                                        return true;
                                    }
                                },
                                font(context) {
                                    let w = context.chart.width;
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
                    $scope.loadedCard.audience_change = true;
                }, (status, message) => {
                    Alert.error("Failed to load statistics");
                });
            };


            SocialAccounts.getSocialAccount($stateParams.pageId, data => {
                $scope.page_data = data;
                $scope.enabledCard = {
                    f_analysis_age: data.statistic.audience.age != null && data.statistic.audience.age.length > 0,
                    f_analysis_gender: data.statistic.audience.gender != null && data.statistic.audience.gender.length > 0,
                };

                Statistics.getPageRecommendations($stateParams.pageId, data => {
                    $scope.recommendations = [];


                    angular.forEach(data, recommendation => {
                        if (recommendation.type !== "SUGGESTED_KEYWORDS" && recommendation.type !== "SUGGESTED_HASHTAGS") {
                            $scope.recommendations.push(recommendation);
                        }
                        else if (recommendation.type === "SUGGESTED_KEYWORDS") {
                            $scope.enabledCard.analysis_keywords = true;
                            setTimeout(() => {
                                $scope.recommended_content = recommendation.value;
                                require('./Charts/Keywords').loadChart(recommendation.value);
                                $scope.loadedCard.analysis_keywords = true;
                            }, 0);
                        }
                    });
                }, (status, message) => {
                    Alert.error(message);
                });


                $scope.loadVisitors(data);
                if (data.statistic) {
                    if (data.statistic.audience.gender && $scope.enabledCard.f_analysis_gender) {
                        require('./Charts/AudienceGender').loadChart(data.statistic.audience.gender);
                        $scope.loadedCard.f_analysis_gender = true;
                    }
                    if (data.statistic.audience.age && $scope.enabledCard.f_analysis_age) {
                        require('./Charts/AudienceAge').loadChart(data.statistic.audience.age);
                        $scope.loadedCard.f_analysis_age = true;
                    }
                    if (data.statistic.analysis) {
                        $scope.loadedCard.analysis = true;
                    }
                }

                // require('./Charts/ActivityHeatmap').loadChart(data);
            }, (status, message) => {
                Alert.error(message);
            });


        }]);
});

