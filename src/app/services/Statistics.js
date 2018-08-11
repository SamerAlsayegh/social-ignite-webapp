define(['./module'], function (services) {
    'use strict';
    services.factory('Statistics', ['Request',
        function (Request) {

            return {
                getPostStatistics: function (postId, filter, cbSuccess, cbFail) {
                    if (postId == null) {
                        return cbFail(400, "Missing postId");
                    }

                    return Request.get('portal/statistic/post/' + postId, {filter: filter},
                         function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message, rawMessage) {
                            return cbFail(status, message, rawMessage);
                        });
                },
                getPageStatistics: function (pageId, filter, cbSuccess, cbFail) {
                    if (pageId == null) {
                        return cbFail(400, "Missing pageId");
                    }

                    return Request.get('portal/statistic/page/' + pageId ,
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getPageGeneralStatistics: function (pageId, cbSuccess, cbFail) {
                    if (pageId == null) {
                        return cbFail(400, "Missing pageId");
                    }
                    return Request.get('portal/statistic/general/' + pageId,
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getStatisticsConfig: function (graphTitle, xLabelTitle, yLabelTitle){


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
                                        tooltipFormat:'h:mm A on MMM DD', // <- HERE
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
                                        callback: function(value, index, values) {
                                            console.log(value);
                                            if (Math.floor(value * 10) === value * 10) {
                                                return value;
                                            }
                                        }
                                    },
                                    value: {
                                        tooltipFormat:'h:mm A', // <- HERE
                                        format: "MMM DD",
                                    }
                                }]
                            }
                        }
                    }));
                }
            };
        }]);
});
