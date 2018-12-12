let chartObject = null;
let chartElement = null;

module.exports = {
    loadChart(genderData) {
        if (!chartObject) {
            chartElement = document.getElementById("audienceGenderChart").getContext('2d');
            let dataFormatted = [];
            let dataLabels = [];
            let dataColors = [];
            angular.forEach(genderData, dataEntry => {
                dataFormatted.push(dataEntry.value);
                dataLabels.push(dataEntry.label);
                dataColors.push(dataEntry.color);
            });


            chartObject = new Chart(chartElement, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: dataFormatted,
                        backgroundColor: dataColors,
                        datalabels: {
                            display: true,
                            color: "#fff",
                        }
                    }],
                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: dataLabels
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
            chartObject.update();
        }
    }
};