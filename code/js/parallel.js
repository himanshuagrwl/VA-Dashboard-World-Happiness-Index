function create_parallel() {
// set the dimensions and margins of the graph
    var margin = {top: 30, right: 10, bottom: 10, left: 0},
        width = 750 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#parallel")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = {};
    x = d3.scalePoint()
        .range([0, width])
        .padding(1)
    // Parse the Data
    return function update(data) {
        d3.select("#parallel").select("svg").select("g").selectAll("*").remove();
        // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
        var dimensions = d3.keys(data[0]).filter(function (d) {
            return d !== "score" && d !== "country"
        });

        // For each dimension, I build a linear scale. I store all in a y object
        for (i in dimensions) {
            var name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain(d3.extent(data, function (d) {
                    return +d[name];
                }))
                .range([height, 0]);
        }

        // Build the X scale -> it find the best position for each Y axis
        let idx = dimensions.indexOf("filtered")
        if (idx > -1) {
            dimensions.splice(idx, 1);
        }
        x.domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function (p) {
                return [x(p), y[p](d[p])];
            }));
        }

        // Draw the lines
        svg.selectAll("myPath")
            .data(data)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "line " + d.score;
            })
            // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) {
                return (d.filtered ? '#ddd' : '#2171b5')
            })
            .style("opacity", function (d) {
                return (d.filtered ? 0 : 1)
            });

        // Draw the axis:
        svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) {
                return "translate(" + x(d) + ")";
            })
            .style('font-weight', 'bold')
            // And I build the axis with the call function
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().scale(y[d]));
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "15px")
            .style('font-weight', 'normal')
            .attr("y", -9)
            .text(d => d)
            .style("fill", "black");
    }


}