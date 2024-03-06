function drawBarChart(selector, legendselector, dataURL, maxData, defaultData = None) {
  const barChart = document.getElementById(selector.slice(1));
  const legend = document.getElementById(legendselector.slice(1));
  barChart.innerHTML = "";
  legend.innerHTML = ""

  const barMargin = { top: 10, right: 30, bottom: 20, left: 50 },
    barWidth = barChart.clientWidth - barMargin.left - barMargin.right,
    barHeight = barChart.clientWidth - barMargin.top - barMargin.bottom;

  // append the svg object to the body of the page
  const batSVG = d3
    .select(barChart)
    .append("svg")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .append("g")
    .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

  // Parse the Data

  //d3.csv(dataURL, function (data) {
  data = d3.csvParse(defaultData); {
    const subgroups = data.columns.slice(1);

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
    const y = d3.scaleLinear().domain([0, maxData]).range([barHeight, 0]);
    batSVG.append("g").call(d3.axisLeft(y));

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand().domain(subgroups).range([0, x.bandwidth()]).padding([0.05]);
    // color palette = one color per subgroup
    const colors = ["#e41a1c", "#377eb8", "#11e2b8"];
    const color = d3.scaleOrdinal().domain(subgroups).range(colors);

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

    let legendItemSize = 10;
    let legendSpacing = 2;
    let xOffset = 0;
    let yOffset = 0;
    let legend = d3
      .select(legendselector)
      .append("svg")
      .selectAll(".legendItem")
      .data(data.columns.slice(1, data.columns.length));

    //Create legend items
    legend
      .enter()
      .append("rect")
      .attr("class", "legendItem")
      .attr("width", legendItemSize)
      .attr("height", legendItemSize)
      .style("fill", (d, i) => colors[i])
      .attr("transform", (d, i) => {
        let x = xOffset;
        let y = yOffset + (legendItemSize + legendSpacing) * i;
        return `translate(${x}, ${y})`;
      });

    //Create legend labels
    legend
      .enter()
      .append("text")
      .attr("x", xOffset + legendItemSize + 5)
      .attr("y", (d, i) => yOffset + (legendItemSize + legendSpacing) * i + 12)
      .text((d) => d);
  }
}
