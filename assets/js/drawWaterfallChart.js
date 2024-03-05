function makeData(data) {
  const newData = [];
  data.reduce((prev, cur, idx) => {
    let newObj;
    if (idx > 0) newObj = { name: cur.name, count: Math.abs(cur.value - prev.value), end: Math.max(cur.value, prev.value) };
    else newObj = { name: prev.name, count: prev.value, end: prev.value };
    newData.push(newObj);
    return cur;
  }, data[0]);
  return newData;
}

function calculateAbsDelta(arr1, arr2) {
  if (arr1.length != arr2.length) {
    throw new Error("Data must be matched");
  }
  const deltaArray = arr1.map((item, index) => ({
    name: item.name,
    value: arr2[index].value - item.value,
  }));
  let DeltaData = [];
  DeltaData = deltaArray.map((item, index) => (
    {
    name: item.name,
    count: item.value,
    end: (item.value > 0) ? item.value:0
  }));
  console.log(DeltaData);

  return DeltaData;

}

function HorizontalWaterfallChart(attachTo, data, maxData, svgOption = { svgHeight: 500, svgWidth: 500 }, title) {
  maxData += 10;
  let { svgHeight, svgWidth } = svgOption;
  let numTicks = 5;
  let recWidth = d3.min([50, svgHeight / data.length]); // Minimum width of the rect 50px;
  let barPadding = 10;
  let leftMargin = 60;

  let lineHeight = data.length * recWidth;
  // Append the chart and pad it a bit
  let chart = d3.select(attachTo).append("svg").attr("class", "chart").attr("width", svgWidth).attr("height", svgHeight);

  let colorScale = d3.scale.category10();

  // Set the x-axis scale
  let x = d3.scale
    .linear()
    .domain([0, maxData])
    .range(["0px", `${svgOption.svgWidth * 0.8}px`]);
  // X-axis Label
  chart
    .append("g")
    .attr("transform", "translate(" + svgWidth * 0.6 + ",15)")
    .attr("class", "gAxisLabel")
    .append("text")
    .text(title);
  // The main graph area
  chart = chart
    .append("g")
    .attr("transform", "translate(" + leftMargin + ",30)")
    .attr("class", "gMainGraphArea");

  // Set the y-axis scale
  chart
    .append("g")
    .attr("transform", "translate(" + leftMargin + ",15)")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "rectWF")
    .attr("x", function (d, i) {
      return x(d.end - d.count);
    })
    .attr("y", function (d, i) {
      return i * recWidth;
    })
    .style("fill", function (d, i) {
      return colorScale(i);
    })
    .attr("height", recWidth)
    .attr("width", 0)
    .on("mouseover", function () {
      d3.selectAll(".rectWF").style("opacity", 0.2);
      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function () {
      d3.selectAll(".rectWF").style("opacity", 1);
    })
    .transition()
    .duration(1000)
    .attr("width", function (d, i) {
      return x(d.count);
    });

  // Set the values on the bars

  chart
    .append("g")
    .attr("transform", "translate(" + leftMargin + ",15)")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar")
    .attr("x", function (d, i) {
      return x(d.end - d.count);
    })
    .attr("y", function (d, i) {
      return i * recWidth + recWidth * 0.5;
    })
    .attr("dx", "5") // padding-right
    .attr("dy", "0") // vertical-align: middle
    .attr("text-anchor", "start") // text-align: right
    .attr("fill", "black")
    .text(function (d, i) {
      return d.count;
    });

  // Set the vertical lines for axis
  chart
    .append("g")
    .attr("transform", "translate(" + leftMargin + ",15)")
    .selectAll("line")
    .data(x.ticks(numTicks))
    .enter()
    .append("line")
    .attr("x1", x)
    .attr("x2", x)
    .attr("y1", 0)
    .attr("y2", 0)
    .transition()
    .duration(1500)
    .attr("y2", lineHeight)
    .style("stroke", "#ccc");

  // Set the numbering on the lines for axis
  chart
    .append("g")
    .attr("transform", "translate(" + leftMargin + ",15)")
    .selectAll(".rule")
    .data(x.ticks(numTicks))
    .enter()
    .append("text")
    .attr("class", "rule")
    .attr("x", x)
    .attr("y", 0)
    .attr("dy", -3)
    .attr("text-anchor", "middle")
    .text(String);

  let ll = chart.append("g").attr("class", "gAxis");

  // Set the base line at the left-most corner
  ll.append("line")
    .attr("x1", leftMargin)
    .attr("x2", leftMargin)
    .attr("y1", 15)
    .attr("y2", 15 + lineHeight)
    .style("stroke", "#000");

  ll.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("x", leftMargin - 10)
    .attr("y", function (d, i) {
      return i * recWidth + recWidth * 0.8;
    })
    .attr("dx", -5) // padding-right
    .attr("dy", "0") // vertical-align: middle
    .attr("text-anchor", "end") // text-align: right
    .text(function (d, i) {
      return d.name;
    });
}
