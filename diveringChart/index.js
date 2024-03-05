var margin = { top: 40, right: 50, bottom: 60, left: 50 };

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body svg svg")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cfg = {
  labelMargin: 5,
  xAxisMargin: 10,
  legendRightMargin: 0
};

var x = d3.scaleLinear().range([0, width]);

var colour = d3.scaleQuantize().domain([-1,1])
      .range([d3.rgb("#FFC17A"), d3.rgb('#DE9FFF')]);

var y = d3.scaleBand()
  .range([height, 0])
  .padding(0.1);

function parse(d) {
  d.rank = +d.rank;
  d.annual_growth = +d.annual_growth;
  return d;
}

var legend = svg.append("g").attr("class", "legend");
legend.append("text")
  .attr("x", width - cfg.legendRightMargin)
  .attr("text-anchor", "end")
  .text("European Countries by");
legend.append("text")
  .attr("x", width - cfg.legendRightMargin)
  .attr("y", 20)
  .attr("text-anchor", "end")
  .style("opacity", 0.5)
  .text("2016 Population Growth Rate (%)");

d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/f2722587b40117534177efd29372f6d4/raw/1d1f33058c5e51ac20427361b5a8ee7901faf343/popgrowth.csv",
  parse,
  function(error, data) {
    if (error) throw error;

    y.domain(data.map(function(d) {return d.country;}));
    x.domain(d3.extent(data, function(d) {return d.annual_growth;}));

    var max = d3.max(data, function(d) {return d.annual_growth;});
    colour.domain([-max, max]);

    var xAxis = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (height + cfg.xAxisMargin) + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));

    var bars = svg.append("g").attr("class", "bars");
    bars.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "annual-growth")
      .attr("x", function(d) {return x(Math.min(0, d.annual_growth));})
      .attr("y", function(d) {return y(d.country);})
      .attr("height", y.bandwidth())
      .attr("width", function(d) {return Math.abs(x(d.annual_growth) - x(0));})
      .style("fill", function(d) {return colour(d.annual_growth);});
    
    var yAxis = svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .append("line")
      .attr("y1", 0)
      .attr("y2", height);
    
    var labels = svg.append("g").attr("class", "labels");
    labels.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", x(0))
      .attr("y", function(d) {return y(d.country);})
      .attr("dx", function(d) {return d.annual_growth < 0 ? cfg.labelMargin : -cfg.labelMargin;})
      .attr("dy", y.bandwidth())
      .attr("text-anchor", function(d) {return d.annual_growth < 0 ? "start" : "end";})
      .text(function(d) {return d.country;})
      .style("fill", function(d) { if (d.country == "European Union") { return "blue"; }});
    
  }
);