var chartObject = null;
var chartElement = null;

module.exports = {
    loadChart: function (socialPage) {
        if (!chartObject) {
            chartElement = document.getElementById("audienceGenderChart").getContext('2d');

            chartObject = new Chart(chartElement, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: [
                            socialPage.statistic.audience.gender[0].value,
                            socialPage.statistic.audience.gender[1].value,
                            socialPage.statistic.audience.gender[2].value
                        ],
                        backgroundColor: [
                            "#E91E63",
                            "#55A4DA",
                            "#9E9E9E"
                        ],
                        datalabels: {
                            display: true,
                            color: "#fff",
                        }
                    }],
                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: [
                        'Female',
                        'Male',
                        'Unknown'
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        }
        chartObject.update();
    }
};