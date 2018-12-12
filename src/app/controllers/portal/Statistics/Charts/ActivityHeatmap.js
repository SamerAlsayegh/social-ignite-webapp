let chartObject = null;
let chartElement = null;

module.exports = {
    loadChart(socialPage) {
        if (!chartObject) {
            chartElement = document.getElementById("audienceActivityChart").getContext('2d');

            let generateDatasetColors = (valuesArray, scale) => {
                let colors = [];
                let rgb = "0, 175, 221"; // You should probably define this elsewhere

                for (let i in valuesArray) {
                    let value = valuesArray[i];
                    let opacity = value / scale;
                    if (opacity > 1) {
                        opacity = 1
                    }
                    colors.push("rgba(" + rgb + ", " + opacity + ")");
                }

                return colors;
            };


            chartObject = new Chart(chartElement, {
                type: 'heatmap',
                data: {
                    xLabels: ['6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm', '12 am', '1 am', '2 am', '3 am', '4 am', '5 am'],
                    yLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    datasets: [{
                        label: "Activity",
                        data: [{
                            y: 0, // index of 'Strength'
                            x: 0, // index of '2014'
                            a: 0.5, // alpha of the color [0, 1]
                            v: 1, // value
                            label: ''
                        }, {
                            y: 1, // index of 'Stamina'
                            x: 0, // index of '2014'
                            a: 0.5, // alpha of the color [0, 1]
                            v: 0.5, // value,
                            label: ''
                        }, {
                            y: 2, // index of 'Intelligence'
                            x: 0, // index of '2017'
                            a: 0.5, // alpha of the color [0, 1]
                            v: 1, // value,
                            label: ''

                        }]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    yColors: [ // colors for each lines
                        {r: 0, g: 150, b: 136},
                        {r: 255, g: 235, b: 59},
                        {r: 255, g: 152, b: 0},
                        {r: 244, g: 67, b: 54}
                    ],
                }
            });
        }
        chartObject.update();
    }
};