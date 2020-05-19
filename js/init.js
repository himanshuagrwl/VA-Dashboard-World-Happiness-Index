// function dashboard() {
// Load data once.
d3.queue()
    .defer(d3.csv, 'dataset/2019.csv', function (d) {
        return {
            country: d.Country,
            corruption: +d.corruption,
            GDP: +d.GDP,
            rank: +d['Overall rank'],
            score: +d.Score,
            social: +d['Social support'],
            health: +d['Healthy life expectancy'],
            freedom: +d['Freedom to make life choices'],
            generosity: +d.Generosity
        }
    })
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .awaitAll(initialize)

function initialize(error, results) {
    if (error) {
        throw error
    }

    var data = results[0]
    var features = results[1].features

    var components = [
        choropleth(features),
        scatterplot(onBrush),
        create_parallel(),
        createHistogram(updateFromHist)
    ]

    function update() {
        components.forEach(function (component) {
            component(data)
        })
    }

    function onBrush(x0, x1, y0, y1) {
        var clear = x0 === x1 || y0 === y1
        data.forEach(function (d) {
            d.filtered = clear ? false
                : d.social < x0 || d.social > x1 || d.freedom < y0 || d.freedom > y1
        })
        update()
    }

    function updateFromHist(data_array, i, binWidth, clickk) {
        var clear = false
        if (clickk === 2) {
            clear = true;
        }
        data.forEach(function (d) {
            // if(Math.floor((d.score - d3.min(data_array)) / binWidth) === i)

            d.filtered = clear ? false : Math.floor((d.score - d3.min(data_array)) / binWidth) !== i
        })
        update()
    }

    update()
}
