(function (dw) {
    var charts;
    (function (charts) {
        function appendToGraphList(graph) {
            dw.graphs.push(graph);
            dw.refreshStyle();
        }

        function Histogram(i, data) {
            nv.addGraph(function () {
                var chart = nv.models.discreteBarChart()
                    .x(function (d) { return d.label; })
                    .y(function (d) { return d.value; })
                    .staggerLabels(true)
                    .showValues(true)
                    .duration(250);

                d3.select('#chart' + i)
                    .datum(data)
                    .call(chart);

                nv.utils.windowResize(chart.update);
                return chart;
            }, appendToGraphList);
        }
        charts.Histogram = Histogram;

        function Scatter(i, data) {
            nv.addGraph(function () {

                var chart = nv.models.scatterChart()
                    .pointSize(function (d) {
                        return d.r;
                    })
                    .showDistX(true)
                    .showDistY(true)
                    .duration(300)
                    .color(d3.scale.category10().range());


                chart.xAxis.tickFormat(d3.format('.2f'));
                chart.yAxis.tickFormat(d3.format('.2f'));


                d3.select('#chart' + i)
                    .datum(data)
                    .call(chart);

                nv.utils.windowResize(chart.update);
                return chart;
            }, appendToGraphList);
        }
        charts.Scatter = Scatter;

        function Line(i, data) {
            nv.addGraph(function () {
                var chart = nv.models.lineChart();
                chart.dispatch.on('renderEnd', function () {
                    console.log('render line chart complete');
                });
                chart.xAxis.tickFormat(d3.format('.02f'));
                chart.yAxis.tickFormat(d3.format('.02f'));
                d3.select('#chart' + i)
                    .datum(data)
                    .call(chart);
                nv.utils.windowResize(chart.update);
                return chart;
            }, appendToGraphList);
        }
        charts.Line = Line;

        function StackedBar(i, data) {
            nv.addGraph(function () {

                var chart = nv.models.multiBarChart()
                    .barColor(d3.scale.category20().range())
                    .stacked(true)
                    .options({ showControls: false })
                    .duration(250)
                    .rotateLabels(360)
                    .groupSpacing(0.3)
                    ;

                chart.reduceXTicks(false).staggerLabels(true);

                chart.xAxis
                    .axisLabelDistance(5)
                    .showMaxMin(false)
                    .tickFormat(d3.format(',.0f'))
                ;

                chart.yAxis
                    .axisLabelDistance(-5)
                    .tickFormat(d3.format(',.01f'))
                ;

                chart.dispatch.on('renderEnd', function () {
                    nv.log('Render Complete');
                });

                d3.select('#chart' + i)
                    .datum(data)
                    .call(chart);

                nv.utils.windowResize(chart.update);

                chart.dispatch.on('stateChange', function (e) {
                    nv.log('New State:', JSON.stringify(e));
                });
                chart.state.dispatch.on('change', function (state) {
                    nv.log('state', JSON.stringify(state));
                });

                return chart;
            }, appendToGraphList);
        }
        charts.StackedBar = StackedBar;

    })(charts = dw.charts || (dw.charts = {}));
})(dw = dw || {});