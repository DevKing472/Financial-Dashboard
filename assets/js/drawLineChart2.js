function drawLineChart2() {
  let CRLmargin = {top: 10, right: 30, bottom: 30, left: 60},
      CRLwidth = 460 - CRLmargin.left - CRLmargin.right,
      CRLheight= 400 - CRLmargin.top - CRLmargin.bottom;
  
  // append the svg object to the body of the page
  let svg = d3.select("#lineChart2")
    .append("svg")
      .attr("width", CRLwidth + CRLmargin.left + CRLmargin.right)
      .attr("height", CRLheight + CRLmargin.top + CRLmargin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + CRLmargin.left + "," + CRLmargin.top + ")");
            console.log(svg);
  
  //Read the data
  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv", function(data) {
  
    // group the data: I want to draw one line per group
    let sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function(d) { return d.name;})
      .entries(data);
  
    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))
      .range([ 0, CRLwidth ]);
    svg.append("g")
      .attr("transform", "translate(0," + CRLheight + ")")
      .call(d3.axisBottom(x).ticks(5));
  
    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.n; })])
      .range([ CRLheight, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // color palette
    let res = sumstat.map(function(d){ return d.key }) // list of group names
    let color = d3.scaleOrdinal()
      .domain(res)
      .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
  
    // Draw the line
    svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
          .attr("fill", "none")
          .attr("stroke", function(d){ return color(d.key) })
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return x(d.year); })
              .y(function(d) { return y(+d.n); })
              (d.values)
          })
  
  })
}
drawLineChart2();