define(['./module'], services => {
    services.factory('Statistics', ['Request', '$rootScope',
        (Request, $rootScope) => ({
            getPostStatistics(postId, filter, cbSuccess, cbFail) {
                if (postId == null) {
                    return cbFail(400, "Missing postId");
                }

                return Request.get('portal/statistic/post/' + postId, {filter},
                    message => cbSuccess(message.data), (status, message, rawMessage) => cbFail(status, message, rawMessage));
            },

            getPageStatistics(pageId, filter, cbSuccess, cbFail) {
                if (pageId == null) {
                    return cbFail(400, "Missing pageId");
                }

                return Request.get('portal/statistic/page/' + pageId,
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getPageGeneralStatistics(pageId, cbSuccess, cbFail) {
                if (pageId == null) {
                    return cbFail(400, "Missing pageId");
                }
                return Request.get('portal/statistic/general/' + pageId,
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getPageRecommendations(pageId, cbSuccess, cbFail) {
                if (pageId == null) {
                    return cbFail(400, "Missing pageId");
                }
                return Request.get('portal/page_analysis/' + pageId + '/suggestions',
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getStatisticsConfig(graphTitle, xLabelTitle, yLabelTitle) {
                Chart.defaults.global.defaultFontColor = $rootScope.theme === 'dark' ? '#FFFFFF' : '#666666';

                return JSON.parse(JSON.stringify({
                    type: 'line',
                    data: {
                        datasets: [],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: graphTitle
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: xLabelTitle
                                },
                                time: {
                                    tooltipFormat: 'h:mm A on MMM DD', // <- HERE
                                    format: "MMM DD",
                                    unit: 'day',
                                    unitStepSize: 1,
                                },
                            }],
                            yAxes: [{
                                type: 'linear',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: yLabelTitle
                                },
                                ticks: {
                                    maxTicksLimit: 5,
                                    callback(value, index, values) {
                                        if (Math.floor(value * 10) === value * 10) {
                                            return value;
                                        }
                                    }
                                },
                                value: {
                                    tooltipFormat: 'h:mm A', // <- HERE
                                    format: "MMM DD",
                                }
                            }]
                        }
                    }
                }));
            }
        })]);
});
