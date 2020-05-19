var data_2019 = {}
var data_2018 = {}
var data_2017 = {}
var data_2016 = {}
var data_2015 = {}
var data_all = {}
var years = ["2015", "2016", "2017", "2018", "2019"]

countries = []

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
    .awaitAll(himanshu)

function himanshu(error, results) {
    var data1 = results[0]
    data1.forEach(function (d) {
        data_2019[d.country] = d.score
    })

    data1 = results[1]
    data1.forEach(function (d) {
        data_2018[d.country] = d.score
    })
    data1 = results[2]
    data1.forEach(function (d) {
        data_2017[d.country] = d.score
    })
    data1 = results[3]
    data1.forEach(function (d) {
        data_2016[d.country] = d.score
    })
    data1 = results[4]
    data1.forEach(function (d) {
        data_2015[d.country] = d.score
    })

    data_all["2019"] = data_2019
    data_all["2018"] = data_2018
    data_all["2017"] = data_2017
    data_all["2016"] = data_2016
    data_all["2015"] = data_2015
}

function generate_time_series(country) {
    countries.push(country);
    let cc =["#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594","#084594"];
    var color = d3.scaleOrdinal(cc).domain(countries);
    // var color = d3.scaleOrdinal(d3.schemeBlues[7]).domain(countries);
    d3.select("#timeseries").selectAll("*").remove();
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
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

// append the svg obgect to the body of the page
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

    let all_country_data = []
//  countries = ["Greece","USA","Finland", "Brazil"];
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
    // console.log("HIm", all_country_data)
    // // Add the valueline path.
    // svg.append("path")
    //     .data([country_time_data])
    //     .attr("class", "linetime")
    //     .attr("d", valueline);
    //
    // // console.log(country_time_data)
    //
    // svg.selectAll("circle")
    //      .data(country_time_data)
    //      .enter().append("circle")
    //      .attr("class", "circle")
    //      .attr("cx", function(d) {  return x(d.date); })
    //      .attr("cy", function(d) { return y(d.score); })
    //      .attr("r", 4);
    // var cities = all_country_data.keys(dfunction(a){
    //     console.log("hello",a);
    //     return {
    //
    //         name: a
    //     }
    // })
    var city = svg.selectAll(".city")
        .data(all_country_data)
        .enter().append("g")
        .attr("class", "city");

    city.append("path")
        .attr("class", "linetime")
        .attr("d", function (d) {
            return valueline(d.values);
        })
        .style("stroke", function (d) {
            return color(d.name);
        });

    city.append("text")
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
    city.selectAll("circle")
        .data(function (d) {
            return d.values
        })
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(d.score);
        })
        .style("fill", function(d,i,j) { console.log("Name: ",all_country_data[0].name); count = count+1; return color(all_country_data[Math.floor((count-1)/5)].name); });

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));
}
