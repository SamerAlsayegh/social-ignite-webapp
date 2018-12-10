var chartObject = null;
var chartElement = null;

module.exports = {
    loadChart: function (keywordData) {
        if (!chartObject) {
            chartElement = document.getElementById("keywordChart").getContext('2d');
            let keywordValues = [];
            let keywordLabel = [];
            let colors = [];
            var dynamicColors = function() {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgb(" + r + "," + g + "," + b + ")";
            };

            for (let keyword in keywordData){
                keywordValues.push(keywordData[keyword][1]);
                keywordLabel.push(keywordData[keyword][0]);
                colors.push(dynamicColors());
            }


            chartObject = new Chart(chartElement, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: keywordValues,
                        backgroundColor: colors,
                        datalabels: {
                            display: true,
                            color: "#fff",
                        }
                    }],
                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: keywordLabel
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