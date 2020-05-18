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
        // console.log(data)
        var features = results[1].features

        var components = [
            // choropleth(features),
            // scatterplot(onBrush),
            // create_parallel(),
            createHistogram(data)
        ]

        function update() {
            components.forEach(function (component) {
                component(data)
                // console.log(data)
            })
        }

        function onBrush(x0, x1, y0, y1) {
            var clear = x0 === x1 || y0 === y1
            data.forEach(function (d) {
                d.filtered = clear ? false
                    : d.GDP < x0 || d.GDP > x1 || d.corruption < y0 || d.corruption > y1
            })
            update()
        }

        update()
    }
