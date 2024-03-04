function drawCustomLine() {
  d3.selectAll("#customLine svg").remove();
  var data = [
    {
      timescale: "10-2018",
      P0268: 2.77,
      P0260: 3.98,
      P0298: 2.8,
    },
    {
      timescale: "09-2018",
      P0268: 2.55,
      P0298: 3.47,
      P0300: 2.01,
    },
    {
      timescale: "08-2018",
      P0268: 3.02,
      P0260: 3.23,
      P0298: 3.51,
    },
  ];
  var trendsText = {
    P0268: "T01",
    P0260: "T02",
    P0298: "T03",
    P0300: "T04",
  };
  var margin = { top: 15, right: 5, bottom: 30, left: 30 },
    width = $("#customLine").width() - margin.left - margin.right,
    height = $("#customLine").width() * 0.7 - margin.top - margin.bottom;
  var svg = d3
    .selectAll("#customLine")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand().rangeRound([0, width]).padding(1),
    y = d3.scaleLinear().rangeRound([height, 0]),
    z = d3.scaleOrdinal([
      "#525c72",
      "#21ce03",
      "#fe3302",
      "#fa46ff",
      "#876d0d",
    ]);

  function make_x_gridlines() {
    return d3.axisBottom(x).ticks(8);
  }

  function make_y_gridlines() {
    return d3.axisLeft(y).ticks(10);
  }

  var line = d3
    .line()
    .x(function (d) {
      return x(d.timescale);
    })
    .y(function (d) {
      return y(d.total);
    });

  z.domain(
    d3.keys(trendsText).filter(function (key) {
      return key !== "timescale";
    })
  );

  var trends = z.domain().map(function (name) {
    return {
      name: name,
      values: data.map(function (d) {
        return {
          timescale: d.timescale,
          total: d[name] ? +d[name] : 0,
        };
      }),
    };
  });

  x.domain(
    data.map(function (d) {
      return d.timescale;
    })
  );
  y.domain([
    0,
    d3.max(trends, function (c) {
      return d3.max(c.values, function (v) {
        return v.total;
      });
    }),
  ]);

  var legend = g
    .selectAll("g")
    .data(trends)
    .enter()
    .append("g")
    .attr("class", "legend");

  legend
    .append("rect")
    .attr("x", width - 40)
    .attr("y", function (d, i) {
      return height / 2 - (i + 1) * 20;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function (d) {
      return z(d.name);
    });

  legend
    .append("text")
    .attr("x", width - 25)
    .attr("y", function (d, i) {
      return height / 2 - (i + 1) * 20 + 10;
    })
    .text(function (d) {
      return trendsText[d.name];
    });

  var trend = g
    .selectAll(".trend")
    .data(trends)
    .enter()
    .append("g")
    .attr("class", "trend");

  trend
    .append("path")
    .attr("class", "line")
    .attr("d", function (d) {
      var availableValues = [];
      d.values.forEach((v, index) => {
        if (v.total !== 0) {
          availableValues.push(v);
        }
      });
      return line(availableValues);
    })
    .style("fill", "none")
    .style("stroke", function (d) {
      return z(d.name);
    });

  var points = g
    .selectAll(".points")
    .data(trends)
    .enter()
    .append("g")
    .attr("class", "points")
    .append("text");

  trend
    .style("fill", "#FFF")
    .style("stroke", function (d) {
      return z(d.name);
    })
    .selectAll("circle.line")
    .data(function (d) {
      var availableValues = [];
      d.values.forEach((v, index) => {
        if (v.total !== 0) {
          availableValues.push(v);
        }
      });
      return availableValues;
    })
    .enter()
    .append("circle")
    .attr("r", 5)
    .style("stroke-width", 3)
    .attr("cx", function (d) {
      return x(d.timescale);
    })
    .attr("cy", function (d) {
      return y(d.total);
    });

  g.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "center");

  g.append("g").attr("class", "axis axis-y").call(d3.axisLeft(y).ticks(10));

  var focus = g.append("g").attr("class", "focus").style("display", "none");

  focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#B74779")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", 3.3);

  svg
    .append("rect")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "overlay")
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("mousemove", mousemove);

  svg
    .append("g")
    .attr("class", "customLineGrid")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .style("stroke-dasharray", "3,3")
    .call(
      make_y_gridlines()
        .tickSize(-width + 50)
        .tickFormat("")
    );

  var timeScales = data.map(function (name) {
    return x(name.timescale);
  });

  function mouseover() {
    focus.style("display", null);
    d3.selectAll(".points text").style("display", null);
  }

  function mouseout() {
    focus.style("display", "none");
    d3.selectAll(".points text").style("display", "none");
  }

  function mousemove() {
    var i = d3.bisect(timeScales, d3.mouse(this)[0], 1);
    var di = data[i - 1];
    focus.attr("transform", "translate(" + x(di.timescale) + ",0)");
    d3.selectAll(".points text")
      .attr("x", function (d) {
        return x(di.timescale) + 15;
      })
      .attr("y", function (d) {
        return d.values[i - 1] && d.values[i - 1].total
          ? y(d.values[i - 1].total)
          : null;
      })
      .text(function (d) {
        return d.values[i - 1] && d.values[i - 1].total
          ? d.values[i - 1].total
          : "";
      })
      .style("fill", function (d) {
        return z(d.name);
      });
  }
}
drawCustomLine();

var jsonData = [
  { Year: 2011, Month: "Jan", Sales: 320 },
  { Year: 2011, Month: "Feb", Sales: 230 },
  { Year: 2011, Month: "Mar", Sales: 365 },
  { Year: 2011, Month: "Apr", Sales: 385 },
  { Year: 2011, Month: "May", Sales: 300 },
  { Year: 2012, Month: "Jan", Sales: 380 },
  { Year: 2012, Month: "Feb", Sales: 180 },
  { Year: 2012, Month: "Mar", Sales: 275 },
  { Year: 2012, Month: "Apr", Sales: 450 },
  { Year: 2012, Month: "May", Sales: 410 },
  { Year: 2013, Month: "Jan", Sales: 320 },
  { Year: 2013, Month: "Feb", Sales: 170 },
  { Year: 2013, Month: "Mar", Sales: 375 },
  { Year: 2013, Month: "Apr", Sales: 510 },
  { Year: 2013, Month: "May", Sales: 390 },
  { Year: 2014, Month: "Jan", Sales: 420 },
  { Year: 2014, Month: "Feb", Sales: 125 },
  { Year: 2014, Month: "Mar", Sales: 310 },
  { Year: 2014, Month: "Apr", Sales: 450 },
  { Year: 2014, Month: "May", Sales: 410 },
  { Year: 2015, Month: "Jan", Sales: 460 },
  { Year: 2015, Month: "Feb", Sales: 195 },
  { Year: 2015, Month: "Mar", Sales: 360 },
  { Year: 2015, Month: "Apr", Sales: 410 },
  { Year: 2015, Month: "May", Sales: 385 },
];

function drawCustomBar() {
  d3.selectAll("#customBar svg").remove();
  var margin = { top: 10, right: 0, bottom: 30, left: 30 },
    width = $("#customBar").width() - margin.left - margin.right,
    height = $("#customBar").width() * 0.7 - margin.top - margin.bottom;
  var averages = [];
  var customBarData = getCustomBarData(jsonData);

  var xCustomBar = d3.scaleLinear().range([0, width]);

  var yCustomBar = d3.scaleLinear().range([height, 0]);

  var line = d3
    .line()
    .defined(function (d) {
      return d;
    })
    .x(function (d) {
      return xCustomBar(d.x);
    })
    .y(function (d) {
      return yCustomBar(d.y);
    });

  var area = d3
    .area()
    .defined(line.defined())
    .x(line.x())
    .y1(line.y())
    .y0(yCustomBar(0));

  var div = d3
    .select("#customBar")
    .append("div")
    .attr("class", "customBarTooltip")
    .style("opacity", 0);

  var svg = d3
    .select("#customBar")
    .append("svg")
    .datum(customBarData)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("path").attr("class", "customBarArea").attr("d", area);

  svg
    .append("path")
    .attr("class", "customBarLine")
    .attr("d", line)
    .attr("stroke-width", 10)
    .attr("stroke", "#ccc");

  var yScale = d3.scaleLinear().domain([0, 600]).range([height, 0]);
  var yAxis = svg
    .append("g")
    .attr("class", "y axis1")
    .call(d3.axisLeft(yScale).ticks(6));

  var xScale1 = d3.scaleLinear().range([0, width]);
  var xAxis1 = svg
    .append("g")
    .attr("class", "x axis2")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale1).tickFormat(""));

  var circles = svg
    .selectAll("circle")
    .data(customBarData)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return d ? d.x * width : null;
    })
    .attr("cy", function (d) {
      return d ? height - d.y * height : null;
    })
    .attr("r", function (d) {
      return d ? 5 : 0;
    })
    .style("fill", "green")
    .on("mouseover", function (d) {
      div.transition().duration(300).style("opacity", 0.9);
      div
        .html(parseInt(d.y * 600))
        .style("left", d3.event.offsetX + 20 + "px")
        .style("top", d3.event.offsetY + 50 + "px");
    })
    .on("mouseout", function (d) {
      div.transition().duration(500).style("opacity", 0);
    });
  for (var i = 0; i < 5; i++) {
    svg
      .append("text")
      .text(11)
      .style("font-size", 12)
      .attr("x", (width * i) / 5 + width / 50)
      .attr("y", height + 25);
  }
  var months = ["Jan", "Feb", "Mar", "Apr", "May"];
  for (var i = 0; i < 5; i++) {
    svg
      .append("text")
      .text(15)
      .style("font-size", 12)
      .attr("x", (width * i) / 5 + (width * 7) / 50)
      .attr("y", height + 25);

    if (i > 0) {
      svg
        .append("line")
        .attr("x1", (width * i) / 5)
        .attr("x2", (width * i) / 5)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);
    }
    svg
      .append("line")
      .attr("x1", (width * i) / 5)
      .attr("x2", (width * (i + 1)) / 5)
      .attr("y1", averages[i])
      .attr("y2", averages[i])
      .attr("stroke", "grey")
      .attr("stroke-width", 2);
    svg
      .append("text")
      .attr("class", "customBarMonth")
      .attr("transform", "translate(" + (width / 12 + (width * i) / 5) + ",0)")
      .text(months[i]);
  }

  function getCustomBarData(jsonData) {
    var data = [];
    var twoData = [[], [], [], [], []];
    for (var i = 0; i < jsonData.length; i++) {
      switch (jsonData[i].Month) {
        case "Jan":
          twoData[0].push(jsonData[i].Sales);
          break;
        case "Feb":
          twoData[1].push(jsonData[i].Sales);
          break;
        case "Mar":
          twoData[2].push(jsonData[i].Sales);
          break;
        case "Apr":
          twoData[3].push(jsonData[i].Sales);
          break;
        case "May":
          twoData[4].push(jsonData[i].Sales);
          break;
      }
    }
    for (var i = 0; i < 5; i++) {
      twoData[i].push(null);
    }
    data.push(null);
    var val = 1 / ((jsonData.length - 1) * 2);
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 6; j++) {
        if (twoData[i][j]) {
          data.push({ x: val, y: twoData[i][j] / 600 });
          val += 1 / (jsonData.length + 0.5);
        } else {
          data.push(null);
          val += 1 / ((jsonData.length + 1) * 10);
        }
      }
    }
    for (var i = 0; i < 5; i++) {
      averages[i] = height - (twoData[i].reduce(sum, 0) * height) / 3000;
    }
    return data;
  }
  function sum(a, b) {
    return a + b;
  }
}

drawCustomBar();

function drawDotBar() {
  d3.selectAll("#dotBar svg").remove();
  var data = [
    {
      date: "Thur (10/2)",
      points: [0, 0, 1, 0, 0, 0, 1, 2, 1],
    },
    {
      date: "Fri (10/3)",
      points: [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      date: "Sat (10/4)",
      points: [2, 0],
    },
    {
      date: "Sun (10/5)",
      points: [0, 1, 2],
    },
    {
      date: "Mon (10/6)",
      points: [
        0, 0, 0, 1, 0, 0, 2, 1, 1, 0, 0, 1, 1, 2, 0, 0, 1, 0, 0, 0, 2, 0, 0,
      ],
    },
    {
      date: "Tue (10/7)",
      points: [0, 1, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    },
    {
      date: "Wed (10/8)",
      points: [2, 0, 1, 0, 0, 0, 1, 2, 1],
    },
  ];
  var width = $("#dotBar").width(),
    height = 350;
  var svg = d3
    .select("#dotBar")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  var g = svg.append("g").attr("transform", "translate(0,0)");
  var graphHeight = height - 50;
  var dHeight = graphHeight / 19;

  for (var i = 0; i < data.length; i++) {
    g.selectAll(".points")
      .data(data[i].points)
      .enter()
      .append("rect")
      .attr("x", function (d, j) {
        if (graphHeight - j * dHeight * 2 > 0) {
          return (width * i) / data.length;
        }
        if (graphHeight - (j - 10) * dHeight * 2 > 0) {
          return (width * i) / data.length + width / 30 + 5;
        }
        if (graphHeight - (j - 20) * dHeight * 2 > 0) {
          return (width * i) / data.length + width / 15 + 10;
        }
      })
      .attr("y", function (d, j) {
        if (graphHeight - j * dHeight * 2 > 0) {
          return height - j * dHeight * 2 - 60;
        }
        if (graphHeight - (j - 10) * dHeight * 2 > 0) {
          return height - (j - 10) * dHeight * 2 - 60;
        }
        if (graphHeight - (j - 20) * dHeight * 2 > 0) {
          return height - (j - 20) * dHeight * 2 - 60;
        }
      })
      .attr("width", width / 30)
      .attr("height", dHeight + 5)
      .style("fill", function (d) {
        if (d === 0) {
          return "green";
        } else if (d === 1) {
          return "white";
        } else if (d === 2) {
          return "red";
        }
      })
      .style("stroke", function (d) {
        if (d === 0) {
          return "green";
        } else if (d === 1) {
          return "green";
        } else if (d === 2) {
          return "red";
        }
      })
      .style("stroke-width", 2);
  }

  g.selectAll(".date")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function (d, i) {
      return (width * i) / data.length;
    })
    .attr("y", function (d, i) {
      return height;
    })
    .style("font-size", 12)
    .text(function (d) {
      return d.date;
    });

  g.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", height - 30)
    .attr("y2", height - 30)
    .style("stroke-width", 1)
    .style("stroke", "#aaa");
}
drawDotBar();

function dsPieChart() {
  var dataset = [
    { category: "Sam", measure: 0.3 },
    { category: "Peter", measure: 0.25 },
    { category: "John", measure: 0.15 },
    { category: "Rick", measure: 0.05 },
    { category: "Lenny", measure: 0.18 },
    { category: "Paul", measure: 0.04 },
    { category: "Steve", measure: 0.03 },
  ];
  var width = 400,
    height = 400,
    outerRadius = Math.min(width, height) / 2,
    innerRadius = outerRadius * 0.999,
    // for animation
    innerRadiusFinal = outerRadius * 0.5,
    innerRadiusFinal3 = outerRadius * 0.45,
    color = d3.scale.category20(); //builtin range of colors
  var vis = d3
    .select("#pieChart")
    .append("svg:svg") //create the SVG element inside the <body>
    .data([dataset]) //associate our data with the document
    .attr("width", width) //set the width and height of our visualization (these will be attributes of the <svg> tag
    .attr("height", height)
    .append("svg:g") //make a group to hold our pie chart
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")"); //move the center of the pie chart from 0, 0 to radius, radius
  var arc = d3.svg
    .arc() //this will create <path> elements for us using arc data
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  // for animation
  var arcFinal = d3.svg
    .arc()
    .innerRadius(innerRadiusFinal)
    .outerRadius(outerRadius);
  var arcFinal3 = d3.svg
    .arc()
    .innerRadius(innerRadiusFinal3)
    .outerRadius(outerRadius);

  var pie = d3.layout
    .pie() //this will create arc data for us given a list of values
    .value(function (d) {
      return d.measure;
    }); //we must tell it out to access the value of each element in our data array

  var arcs = vis
    .selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
    .data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
    .enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
    .append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
    .attr("class", "slice") //allow us to style things in the slices (like text)
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", up);
  arcs
    .append("svg:path")
    .attr("fill", function (d, i) {
      return color(i);
    }) //set the color for each slice to be chosen from the color function defined above
    .attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function
    .append("svg:title") //mouseover title showing the figures
    .text(function (d) {
      return d.data.category + ": " + formatAsPercentage(d.data.measure);
    });

  d3.selectAll("g.slice")
    .selectAll("path")
    .transition()
    .duration(750)
    .delay(10)
    .attr("d", arcFinal);

  // Add a label to the larger arcs, translated to the arc centroid and rotated.
  // source: http://bl.ocks.org/1305337#index.html
  arcs
    .filter(function (d) {
      return d.endAngle - d.startAngle > 0.2;
    })
    .append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", function (d) {
      return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
    })
    //.text(function(d) { return formatAsPercentage(d.value); })
    .text(function (d) {
      return d.data.category;
    });

  // Computes the label angle of an arc, converting from radians to degrees.
  function angle(d) {
    var a = ((d.startAngle + d.endAngle) * 90) / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  // Pie chart title
  vis
    .append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text("Revenue Share 2012")
    .attr("class", "title");

  function mouseover() {
    d3.select(this)
      .select("path")
      .transition()
      .duration(750)
      //.attr("stroke","red")
      //.attr("stroke-width", 1.5)
      .attr("d", arcFinal3);
  }

  function mouseout() {
    d3.select(this)
      .select("path")
      .transition()
      .duration(750)
      //.attr("stroke","blue")
      //.attr("stroke-width", 1.5)
      .attr("d", arcFinal);
  }

  function up(d, i) {
    /* update bar chart when user selects piece of the pie chart */
    //updateBarChart(dataset[i].category);
    updateBarChart(d.data.category, color(i));
    updateLineChart(d.data.category, color(i));
  }
}

dsPieChart();
