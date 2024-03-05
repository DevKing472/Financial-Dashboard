function drawGaugeChart(){
    var width = 300,
        height = 150,
        twoPi = Math.PI * 2,
        progress = 0,
        total = 100, // must be the hard-coded total
        formatPercent = d3.format(".0%");
    
    var arc = d3.arc()
        .startAngle(0)
        .innerRadius(70)
        .outerRadius(90);
    
    var svg = d3.select("#gauge").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height + ")");
    console.log("adf");
    var meter = svg.append("g")
        .attr("class", "progress-meter");
    
    meter.append("path")
        .attr("class", "background")
        .attr("d", arc.endAngle(twoPi));
    
    var foreground = meter.append("path")
        .attr("class", "foreground");
    
    var text = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");
}
function updateProgress(progress) {
    var i = d3.interpolate(progress / total, progress / total);

    d3.transition().duration(750).tween("progress", function() {
        return function(t) {
            var progress = i(t);
            foreground.attr("d", arc.endAngle(twoPi * progress));
            text.text(formatPercent(progress));
        };
    });
}

updateProgress(50); 

drawGaugeChart();
