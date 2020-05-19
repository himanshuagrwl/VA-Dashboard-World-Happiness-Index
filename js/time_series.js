var data_2019 = {};
var data_2018 = {};
var data_2017 = {};
var data_2016 = {};
var data_2015 = {};
var data_all = {};
var years = ["2015", "2016", "2017", "2018", "2019"];

countries = [];

d3.queue()
    .defer(d3.csv, 'dataset/2019.csv', function (d) {
        return {
            country: d.Country,
            score: +d.Score
        }
    })
    .defer(d3.csv, 'dataset/2018.csv', function (d) {
        return {
            country: d.Country,
            score: +d.Score
        }
    })
    .defer(d3.csv, 'dataset/2017.csv', function (d) {
        return {
            country: d.Country,
            score: +d.Score
        }
    })
    .defer(d3.csv, 'dataset/2016.csv', function (d) {
        return {
            country: d.Country,
            score: +d.Score
        }
    })
    .defer(d3.csv, 'dataset/2015.csv', function (d) {
        return {
            country: d.Country,
            score: +d.Score
        }
    })
    .awaitAll(load_data)

function load_data(error, results) {
    var data1 = results[0]
    data1.forEach(function (d) {
        data_2019[d.country] = d.score;
    })

    data1 = results[1]
    data1.forEach(function (d) {
        data_2018[d.country] = d.score;
    })
    data1 = results[2]
    data1.forEach(function (d) {
        data_2017[d.country] = d.score;
    })
    data1 = results[3]
    data1.forEach(function (d) {
        data_2016[d.country] = d.score;
    })
    data1 = results[4]
    data1.forEach(function (d) {
        data_2015[d.country] = d.score;
    })

    data_all["2019"] = data_2019;
    data_all["2018"] = data_2018;
    data_all["2017"] = data_2017;
    data_all["2016"] = data_2016;
    data_all["2015"] = data_2015;
}

function generate_time_series(country,flag) {
    if(flag===1 && !countries.includes(country))
    {
            countries.push(country);
    }
    else if(flag===2)
    {
        countries.splice(countries.indexOf(country),1);
        console.log("Removed", countries);
    }
    let cc =["#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594"];
    var color = d3.scaleOrdinal(cc).domain(countries);

    d3.select("#timeseries").selectAll("*").remove();
    var margin = {top: 20, right: 20, bottom: 50, left: 50},
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(years)
        .padding(width / 5)
        .range([0, width]);

    var y = d3.scaleLinear().range([height, 0]).domain([0, 10]);
    // define the line
    var valueline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.score);
        });

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    var svg = d3.select("#timeseries").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add the X Axis
    xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    // Add the Y Axis
    yAxis = svg.append("g");

    let all_country_data = [];
    
    for (j in countries) {
        let country_time_data = [];
        let mapped = {};
        for (i in years) {
            var country_map = {}
            country_map["date"] = years[i];
            country_map["score"] = data_all[years[i]][countries[j]];
            country_time_data.push(country_map);
        }
        mapped["name"] = countries[j];
        mapped["values"] = country_time_data;
        all_country_data.push(mapped)
    }
    svg.append("g")
        .append("text")
        .attr("y", height+margin.top+2*margin.bottom)
        .attr("x", width / 2)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .text("Years");
    svg.append("g")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left)
        .attr("x", -height/2)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .text("Happiness Score");

    var country_svg = svg.selectAll(".country_svg")
        .data(all_country_data)
        .enter().append("g")
        .attr("class", "country_svg");

    country_svg.append("path")
        .attr("class", "linetime")
        .attr("d", function (d) {
            return valueline(d.values);
        })
        .style("stroke", function (d) {
            return color(d.name);
        });

    country_svg.append("text")
        .datum(function (d) {
            return {name: d.name, value: d.values[d.values.length - 1]};
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.value.date) + "," + y(d.value.score) + ")";
        })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function (d) {
            return d.name;
        });
    let count = 0;
    country_svg.selectAll("circle")
        .data(d => d.values)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.score))
        .style("fill", function(d,i,j) { count = count+1; return color(all_country_data[Math.floor((count-1)/5)].name); });

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));
}
