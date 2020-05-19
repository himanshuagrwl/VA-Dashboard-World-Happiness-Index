var data_2019 = {}
var data_2018 = {}
var data_2017 = {}
var data_2016 = {}
var data_2015 = {}

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
    data1.forEach(function(d){
        data_2019[d.country] = d.score
    })

    data1 = results[1]
    data1.forEach(function(d){
        data_2018[d.country] = d.score
    })
    data1 = results[2]
    data1.forEach(function(d){
        data_2017[d.country] = d.score
    })
    data1 = results[3]
    data1.forEach(function(d){
        data_2016[d.country] = d.score
    })
    data1 = results[4]
    data1.forEach(function(d){
        data_2015[d.country] = d.score
    })
}

function generate_time_series(country){
    var margin = {top: 50, right: 60, bottom: 50, left: 60},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scaleBand()
.domain([2015,2016,2017,2018,2019])
.padding(width/5)
.range([0,width]);

var y = d3.scaleLinear().range([height, 0]);
// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.score); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#timeseries").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
  country_time_data = []

  var country_map = {}
  country_map["date"] = 2019;
  country_map["score"] = data_2019[country]

  var country_map2 = {}
  country_map2["date"] = 2018;
  country_map2["score"] = data_2018[country]

  var country_map3 = {}
  country_map3["date"] = 2017;
  country_map3["score"] = data_2017[country]

  var country_map4 = {}
  country_map4["date"] = 2016;
  country_map4["score"] = data_2016[country]

  var country_map5 = {}
  country_map5["date"] = 2015;
  country_map5["score"] = data_2015[country]

  country_time_data.push(country_map)
  country_time_data.push(country_map2)
  country_time_data.push(country_map3)
  country_time_data.push(country_map4)
  country_time_data.push(country_map5)

  console.log(data_2019);

  // Scale the range of the data
  y.domain([0, d3.max(country_time_data, function(d) { return d.score; })]);

  // Add the valueline path.
  svg.append("path")
      .data([country_time_data])
      .attr("class", "linetime")
      .attr("d", valueline);


  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
      svg.selectAll("circle")
           .data(country_time_data)
              .enter().append("circle")
                   .attr("class", "circle")
                        .attr("cx", function(d) { return x(d.date); })
                             .attr("cy", function(d) { return y(d.score); })
                                  .attr("r", 4);


}
