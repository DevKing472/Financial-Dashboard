function drawProgressChart(selector, progress, fcolor, text) {
    const progressChart = document.getElementById(selector.slice(1));
    progressChart.innerHTML = `<span class="progress-status">${text}</span>`;
    // Configuration for our progress chart
    var config = {
        size: Math.min(progressChart.clientWidth, progressChart.clientHeight),
        lineWidth: 30,
        progress: progress // This is the progress percentage
    };

    // Select the div and append an SVG
    var svg = d3.select(selector)
        .append('svg')
        .attr('width', config.size)
        .attr('height', config.size);

    // Define the radius
    var radius = config.size / 2 - config.lineWidth / 2;

    // Create an arc
    var arc = d3.arc()
        .innerRadius(radius - config.lineWidth)
        .outerRadius(radius)
        .startAngle(0); // Start angle at 0

    // Append the background arc
    svg.append('path')
        .datum({ endAngle: 2 * Math.PI }) // Full circle
        .style('fill', '#e6e6e6')
        .attr('d', arc)
        .attr('transform', 'translate(' + config.size / 2 + ',' + config.size / 2 + ')');

    // Append the foreground arc (progress)
    var foreground = svg.append('path')
        .datum({ endAngle: 0 }) // Start at 0
        .style('fill', fcolor)
        .attr('d', arc)
        .attr('transform', 'translate(' + config.size / 2 + ',' + config.size / 2 + ')');

    // Animate the progress
    foreground.transition()
        .duration(1500)
        .attrTween('d', function(d) {
            var interpolate = d3.interpolate(d.endAngle, config.progress / 100 * 2 * Math.PI);
            return function(t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        });
}
