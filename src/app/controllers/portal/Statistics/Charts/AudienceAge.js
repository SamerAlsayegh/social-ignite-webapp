var chartObject = null;
var chartElement = null;

module.exports = {
    loadChart: function (ageData) {
        if (!chartObject) {
            chartElement = document.getElementById("audienceAgeChart").getContext('2d');
            let agesData = [];
            let agesLabel = [];
            angular.forEach(ageData, function (ageData) {
                agesData.push(ageData.value);
                agesLabel.push(ageData.name);
            });


            chartObject = new Chart(chartElement, {
                type: 'bar',
                data: {
                    datasets: [{
                        label: "Age Demographic",
                        data: agesData,
                        backgroundColor: "#55A4DA",
                        datalabels: {
                            display: true,
                            color: "#fff",
                        }
                    }],
                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: agesLabel
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