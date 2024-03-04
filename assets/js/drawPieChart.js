function drawPieChart() {
  const Piewidth = 300, Pieheight = 300, Piemargin = 20;
  let radius = Math.min(Piewidth, Pieheight) / 2 - Piemargin

  const svg = d3.select("#pieChart")
    .append("svg")
      .attr("width", Piewidth)
      .attr("height", Pieheight)
    .append("g")
      .attr("transform", "translate(" + Piewidth / 2 + "," + Pieheight / 2 + ")");

  // create 2 data_set
  let data = {a: 9, b: 20, c:30, d:8, e:12}
  let xdomain = Object.keys(data);

  console.log(xdomain, d3.schemeDark2);

  // set the color scale
  let color = d3.scaleOrdinal()
    .domain(xdomain)
    .range(d3.schemeDark2);

  // draw piechart
  let pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(function(a, b) { console.log(a) ; return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
  let data_ready = pie(d3.entries(data))

  // map to data
  let u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
    )
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 1)

  // remove the group that is not present anymore
  u
    .exit()
    .remove()
}
