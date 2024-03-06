function drawStackedBarChart(selector, legendselector, dataURL, maxData, defaultData) {
  const stackedBarChart = document.getElementById("stackedBarChart");
  const stackedBarChartlegend = document.getElementById("legend-stackedBarChart");
  stackedBarChart.innerHTML = "";
  stackedBarChartlegend.innerHTML = "";

  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = stackedBarChart.clientWidth - margin.left - margin.right,
    height = stackedBarChart.clientWidth - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3
    .select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  
  data = d3.csvParse(defaultData); {
    // List of subgroups = header of the csv files = soil condition here
    let subgroups = data.columns.slice(1);

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    let groups = d3
      .map(data, function (d) {
        return d.group;
      })
      .keys();

    // Add X axis
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    let y = d3.scaleLinear().domain([0, maxData]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
    let colors = ["#e41a1c", "#377eb8", "#4daf4a"];
    // color palette = one color per subgroup
    let color = d3.scaleOrdinal().domain(subgroups).range(colors);

    //stack the data? --> stack per subgroup
    let stackedData = d3.stack().keys(subgroups)(data);

    // Show the bars
    svg
      .append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", function (d) {
        return color(d.key);
      })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.data.group);
      })
      .attr("y", function (d) {
        return y(d[1]);
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth());
    let legendItemSize = 10;
    let legendSpacing = 2;
    let xOffset = 0;
    let yOffset = 0;
    console.log(data.columns);
    let legend = d3.select(legendselector).append("svg").selectAll(".legendItem").data(data.columns.slice(1, data.columns.length));

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
