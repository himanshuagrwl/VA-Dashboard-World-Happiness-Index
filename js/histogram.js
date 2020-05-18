function createHistogram() {

    var margin = {top: 50, right: 60, bottom: 50, left: 60};
    var width = 500 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var graph = d3.select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')


    var y = d3.scaleLinear()
        .range([height, 0]);

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    graph.append("g")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40)
        .attr("x", -200)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text("Frequency Count")

    graph.append("g")
        .append("text")
        .attr("y", height * 2)
        .attr("x", width / 2)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "20px")
        .text("himanshu")

    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y)

    var xAxisGroup = graph.append('g')
        .attr("transform", "translate(0," + height + ")");
    var yAxisGroup = graph.append('g');

    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'end')
        .attr("dx", "-.8em")
        .attr("dy", "-0.6em");
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);



    return function update(data) {
        console.log(data)
        // xAxisGroup.call(xAxis);
        // yAxisGroup.call(yAxis);

        let noBins = 10
        var ftrFreq = Array.apply(null, Array(noBins + 1)).map(Number.prototype.valueOf, 0);
        var binValues = [];
        data_array = data.map(function(d){ return d.score});
        var binWidth = (d3.max(data_array) - d3.min(data_array)) / (noBins);

        data.map(function (d) {
            ftrFreq[Math.floor((d.score - d3.min(data_array)) / binWidth)]++;
        });

        var min = d3.min(data_array);

        for (i = 0; i < noBins; i++) {
            var end = (+min + +binWidth).toFixed(1);
            binValues.push(min + "-" + end);
            min = end;
        }
        x.domain(binValues);
        y.domain([0, d3.max(ftrFreq)]);
        graph.selectAll("rect")
            .data(binValues)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d);
            })
            .attr("y", function (d, i) {
                return y(ftrFreq[i]);
            })
            .attr("fill", "aquamarine")
            .attr("width", x.bandwidth())
            .attr("height", function (d, i) {
                return height - y(ftrFreq[i]);
            })
            .on("click", function (d, i) {
                d3.select(this)
                    .attr("fill", "blue");
            })

            .on("dblclick", function (d, i) {
                d3.select(this)
                    .attr("fill", "aquamarine");
            });
    }

}