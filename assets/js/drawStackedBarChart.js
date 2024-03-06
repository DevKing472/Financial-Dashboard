function drawStackedBarChart() {
    const stackedBarChart = document.getElementById('stackedBarChart');
    stackedBarChart.innerHTML = "";

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = stackedBarChart.clientWidth - margin.left - margin.right,
        height = stackedBarChart.clientWidth - margin.top - margin.bottom;
    console.log(width, height);
    
    // append the svg object to the body of the page
    let svg = d3.select("#stackedBarChart")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    // Parse the Data
    d3.csv("/assets/shortterm_assets.csv", function(data) {
    
      // List of subgroups = header of the csv files = soil condition here
      let subgroups = data.columns.slice(1)
    
      // List of groups = species here = value of the first column called group -> I show them on the X axis
      let groups = d3.map(data, function(d){return(d.group)}).keys()
    
      // Add X axis
      let x = d3.scaleBand()
          .domain(groups)
          .range([0, width])
          .padding([0.2])
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));
    
      // Add Y axis
      let y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0 ]);
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // color palette = one color per subgroup
      let color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c','#377eb8','#4daf4a'])
    
      //stack the data? --> stack per subgroup
      let stackedData = d3.stack()
        .keys(subgroups)
        (data)
    
      // Show the bars
      svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
          .attr("fill", function(d) { return color(d.key); })
          .selectAll("rect")
          // enter a second time = loop subgroup per subgroup to add all rectangles
          .data(function(d) { return d; })
          .enter().append("rect")
            .attr("x", function(d) { return x(d.data.group); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("height", function(d) { return y(d[0]) - y(d[1]); })
            .attr("width",x.bandwidth())
    })
}