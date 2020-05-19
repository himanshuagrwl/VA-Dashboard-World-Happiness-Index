var color = d3.scaleThreshold()
    .domain([0, 0.1, 0.2, 0.3, 0.35, 0.4, 0.5, 0.6, 0.7, 0.8])//,1.0,1.5,2,3,4,5,6,7,8])
    .range(d3.schemeBlues[7])
console.log(d3.schemeBlues[7])
var color1 = d3.scaleThreshold()
    // .domain([3.0,3.5,4.0,4.5,5.0,5.5,6.5,7.0,7.5,8])//,1.0,1.5,2,3,4,5,6,7,8])
    .domain([1, 2, 3, 4, 5, 6, 7, 8])//,1.0,1.5,2,3,4,5,6,7,8])
    .range(d3.schemeBlues[8])


function scatterplot(onBrush) {
    // console.log("scatter",data)
    var margin = {top: 10, right: 15, bottom: 40, left: 60}
    var width = 500 - margin.left - margin.right
    var height = 400 - margin.top - margin.bottom

    var x = d3.scaleLinear()
        .range([0, width])
    var y = d3.scaleLinear()
        .range([height, 0])

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.format('.2'))
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickFormat(d3.format('.2'))

    var brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on('start brush', function () {
            var selection = d3.event.selection

            var x0 = x.invert(selection[0][0])
            var x1 = x.invert(selection[1][0])
            var y0 = y.invert(selection[1][1])
            var y1 = y.invert(selection[0][1])

            onBrush(x0, x1, y0, y1)
        })

    var svg = d3.select('#scatterplot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var bg = svg.append('g')
    var gx = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
    var gy = svg.append('g')
        .attr('class', 'y axis')

    gx.append('text')
        .attr('x', 2 * width / 3 - 30)
        .attr('y', 35)
        .style('text-anchor', 'end')
        .style('fill', '#000')
        // .style('font-weight', 'bold')
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .text('Social Index')

    gy.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -100)
        .attr('y', -40)
        .style('text-anchor', 'end')
        .style('fill', '#000')
        // .style('font-weight', 'bold')
        // .style("font-size",25)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .text('Freedom Index')

    svg.append('g')
        .attr('class', 'brush')
        .call(brush)

    return function update(data) {
        x.domain(d3.extent(data, function (d) {
            return d.social
        })).nice()
        y.domain(d3.extent(data, function (d) {
            return d.freedom
        })).nice()

        gx.call(xAxis)
        gy.call(yAxis)

        var bgRect = bg.selectAll('rect')
            .data(d3.pairs(d3.merge([[y.domain()[0]], color.domain(), [y.domain()[1]]])))
        bgRect.exit().remove()
        bgRect.enter().append('rect')
            .attr('x', 0)
            .attr('width', width)
            .merge(bgRect)
            .attr('y', function (d) {
                return y(d[1])
            })
            .attr('height', function (d) {
                return y(d[0]) - y(d[1])
            })
            .style('fill', function (d) {
                return color(d[0])
            })

        var circle = svg.selectAll('circle')
            .data(data, d => d);

        circle.exit().remove()
        circle.enter().append('circle')
            .attr('r', 4)
            .style('stroke', '#fff')
            .merge(circle)
            .attr('cx', function (d) {
                return x(d.social)
            })
            .attr('cy', function (d) {
                return y(d.freedom)
            })
            .style('fill', function (d) {
                return color(d.freedom)
            })
            .style('opacity', function (d) {
                return d.filtered ? 0.3 : 1
            })
            .style('stroke-width', function (d) {
                return d.filtered ? 1 : 2
            })
    }
}


function choropleth(features) {
    var tooltip = d3.select("div.tooltip");
    var margin = {top: 10, right: 10, bottom: 10, left: 10}
    var width = 700 - margin.left - margin.right
    var height = 400 - margin.top - margin.bottom
    var svg = d3.select("#choropleth").append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    // Map and projection
    var path = d3.geoPath();
    var projection = d3.geoMercator()
        .scale(90)
        .center([0, 20])
        .translate([width / 2, (height / 2) + 10]);
    var offsetL = document.getElementById('choropleth').offsetLeft + 10;
    var offsetT = document.getElementById('choropleth').offsetTop + 10;
    var tooltip = d3.select("#choropleth")
        .append("div")
        .attr("class", "tooltip hidden");
    // Data and color scale
    var data = d3.map();

    var g = svg.append("g");
    const width1 = 260;
    const length = color1.range().length;

    var x = d3.scaleLinear()
        .domain([2, 10])
        .range([0, 200]);
    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0] + 20)
        .attr("y", 290)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .text("Happiness Score Index");
    var xAxis = d3.axisBottom(x)
        .tickSize(7)
        .tickValues(color1.domain())
    g.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(40,320)")
        .call(xAxis)
        .select(".domain")
        .remove()

    g.selectAll("rect")
        .data(color1.range().map(function (d) {
            d = color1.invertExtent(d);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        }))
        .enter().append("rect")
        .attr("height", 20)
        .attr("x", function (d) {
            return x(d[0]) + 40;
        })
        .attr("y", 300)
        .attr("width", function (d) {
            return x(d[1]) - x(d[0]);
        })
        .attr("fill", function (d) {
            return color1(d[0]);
        });

    g.selectAll("path")
        .data(features)
        .enter()
        .append("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        ).style('fill', '#D3D3D3')
        .on("mouseover", function (d, i) {
            return tooltip.style("hidden", false).html(d.country);
        })
        .on("mousemove", function (d) {
            tooltip.classed("hidden", false)
                .style("top", (d3.event.pageY - 100) + "px")
                .style("left", (d3.event.pageX + 10) + "px")
                .html(d.country);
        }).on("mouseout", function (d, i) {
        tooltip.classed("hidden", true);
        })
        .on('click', function (d, i) {
            generate_time_series(d.country,1);
        })
        .on('dblclick',function (d, i) {
            generate_time_series(d.country,2);
        });


    return function update(data) {
        svg.selectAll('path')
            .data(data, function (d) {
                return d.country || d.properties.name
            })
            .style('fill', function (d) {
                return d.filtered ? '#ddd' : color1(d.score)
            })
    }
}