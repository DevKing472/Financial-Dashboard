function drawBarChart() {
  const barChart = document.getElementById('barChart');
  barChart.innerHTML = "";

  const barMargin = { top: 10, right: 30, bottom: 20, left: 50 },
    barWidth = barChart.clientWidth - barMargin.left - barMargin.right,
    barHeight = barChart.clientWidth- barMargin.top - barMargin.bottom;
  
  // append the svg object to the body of the page
  const batSVG = d3
    .select("#barChart")
    .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");
  
  // Parse the Data
  d3.csv(
    "/assets/rec_pay.csv",
    function (data) {
      // List of subgroups = header of the csv files = soil condition here
      const subgroups = data.columns.slice(1);
      console.log(subgroups);
  
      // List of groups = species here = value of the first column called group -> I show them on the X axis
      const groups = d3
        .map(data, function (d) {
          return d.group;
        })
        .keys();
  
      // Add X axis
      const x = d3.scaleBand().domain(groups).range([0, barWidth]).padding([0.2]);
      batSVG
        .append("g")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(x).tickSize(0));
  
      // Add Y axis
      const y = d3.scaleLinear().domain([0, 40]).range([barHeight, 0]);
      batSVG.append("g").call(d3.axisLeft(y));
  
      // Another scale for subgroup position?
      const xSubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05]);
  
      // color palette = one color per subgroup
      const color = d3
        .scaleOrdinal()
        .domain(subgroups)
        .range(["#e41a1c", "#377eb8", "#4daf4a"]);
  
      // Show the bars
      batSVG
        .append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          return "translate(" + x(d.group) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
          return subgroups.map(function (key) {
            return { key: key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return xSubgroup(d.key);
        })
        .attr("y", function (d) {
          return y(d.value);
        })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function (d) {
          return barHeight - y(d.value);
        })
        .attr("fill", function (d) {
          return color(d.key);
        });
    }
  );
}