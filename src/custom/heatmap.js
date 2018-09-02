/**
 * heatmap extension for Chart.js 2
 * @author Thomas Talbot <thomas.talbot@zephyr-web.fr>
 */

(function () {
    'use strict';

    Chart.Heatmap = function(context, config) {
        config.type = 'heatmap';

        return new Chart(context, config);
    };

    const helpers = Chart.helpers;

    Chart.defaults.heatmap = {
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
                title: function(tooltipItems, data) {
                    // Pick first xLabel for now
                    if (tooltipItems.length > 0) {
                        return data.yLabels[tooltipItems[0].yLabel];
                    }

                    return '';
                },
                label: function(tooltipItem, data) {
                    let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                    return datasetLabel + ': ' + (data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].v * 100).toFixed(2) + '%';
                }
            }
        },
        yColors: [],
        scales: {
            xAxes: [{
                type: 'category',
                position: 'bottom',

                gridLines: {
                    offsetGridLines: true // labels are between lines
                }
            }],
            yAxes: [{
                type: 'category',
                position: 'left',

                gridLines: {
                    offsetGridLines: true // labels are between lines
                }
            }]
        }
    };

    Chart.controllers.heatmap = Chart.DatasetController.extend({

        /**
         * Element type used to generate a meta dataset (e.g. Chart.element.Line).
         * @type {Chart.core.element}
         */
        datasetElementType: null,

        /**
         * Element type used to generate a meta data (e.g. Chart.element.Point).
         * @type {Chart.core.element}
         */
        dataElementType: Chart.elements.Rectangle,

        update: function (reset) {
            let me = this;
            helpers.each(me.getMeta().data, function(rectangle, index) {
                me.updateElement(rectangle, index, reset);
            }, me);
        },

        updateElement: function(rectangle, index, reset) {
            const me = this;
            const dataset = me.getDataset();
            const data = dataset.data[index];
            const meta = me.getMeta();
            const xScale = me.getScaleForId(meta.xAxisID);
            const yScale = me.getScaleForId(meta.yAxisID);
            const yTickHeight = Math.abs(yScale.getPixelForTick(1)/2 - yScale.getPixelForTick(0)/2);
            const xTickWidth = Math.abs(xScale.getPixelForTick(index + 1) - xScale.getPixelForTick(index));
            const color = me.chart.options.yColors[data.y] || me.chart.options.yColor;

            rectangle._xScale = xScale;
            rectangle._yScale = yScale;
            rectangle._datasetIndex = me.index;
            rectangle._index = index;
            rectangle._model = {
                x: reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(null, data.x, me.index, true),
                y: reset ? yScale.getBasePixel() : yScale.getPixelForTick(data.y),

                // Tooltip
                label: me.chart.data.labels[index],
                datasetLabel: dataset.label,

                // Appearance
                base: yScale.getPixelForTick(data.y) + yTickHeight,
                width: xTickWidth,
                backgroundColor: 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + data.a + ')',
            };

            rectangle.pivot();
        },

        removeHoverStyle: function(rectangle) {
            const dataset = this.chart.data.datasets[rectangle._datasetIndex];
            const index = rectangle._index;
            let custom = rectangle.custom || {};
            let model = rectangle._model;
            const options = this.chart.options;
            const rectangleElementOptions = this.chart.options.elements.rectangle;
            const data = dataset.data[index];

            const color = options.yColors[data.y];
            model.backgroundColor = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + data.a + ')';
        }
    });
})();
