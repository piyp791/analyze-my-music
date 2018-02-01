function createHist(id, data, data_low = 0, data_high = 1) {

    var formatCount = d3.format(",.0f");

    var svg = d3.select("#" + id),
        margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 30
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear().domain([data_low, data_high])
        .rangeRound([0, width]);

    //console.log('x->' + x.ticks())


    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (data);


    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) {
            return d.length;
        })])
        .range([height, 0]);

    var bar = g.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) {
            return height - y(d.length);
        });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) {
            return formatCount(d.length);
        });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
}



function populateArrays(data) {


    danceability_ar = []
    energy_ar = []
    key_ar = []
    loudness_ar = []
    mode_ar = []
    speechiness_ar = []
    acousticness_ar = []
    instrumentalness_ar = []
    liveness_ar = []
    valence_ar = []
    tempo_ar = []
    time_signature_ar = []
    //iterate over the JSON
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            //console.log("song -> " + key);

            outerObj = data[key]
            for (var outerKey in outerObj) {
                if (outerObj.hasOwnProperty(outerKey)) {


                    obj = outerObj[outerKey]
                    if (outerKey == 'genreInfo') {

                        for (var innerkey in obj) {

                            if (obj.hasOwnProperty(innerkey)) {

                                //console.log(innerkey + ' ->' + obj[innerkey])

                                if (innerkey === 'danceability') {

                                    danceability_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'energy') {

                                    energy_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'key') {

                                    key_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'loudness') {

                                    loudness_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'mode') {

                                    mode_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'speechiness') {

                                    speechiness_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'acousticness') {

                                    acousticness_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'instrumentalness') {

                                    instrumentalness_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'liveness') {

                                    liveness_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'valence') {

                                    valence_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'tempo') {

                                    tempo_ar.push(obj[innerkey])

                                }
                                if (innerkey === 'time_signature') {

                                    time_signature_ar.push(obj[innerkey])

                                }

                            }
                        }

                    } else if (outerKey == 'tagInfo') {

                        console.log(JSON.stringify(obj))

                        tags = obj
                        console.log('tag info-->' + JSON.stringify(tags))


                        var tagArea = document.getElementById("tags");
                        //console.log('tagArea->' +  tagArea)
                        if (tags && tags != [] && tags.length > 0) {
                            tagArea.innerHTML += tags + ","
                        }

                    }

                }
            }
        }
    }

}