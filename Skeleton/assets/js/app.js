// define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 700;

// define chart margins as an object
var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
  };

// define dimensions for chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


//select chart, append svg area to it, and set dimensions
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// append a group to the SVG area and translate it to the right and to the bottom in accordance to the chart margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// append a div to the body to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// load data from data.csv
var file = "data.csv";
d3.csv(file, function(error, successHandle) {
    if(err) throw err;

    successHandle.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    
    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Create axis functions
    var axisBottom = d3.axisBottom(xLinearScale);
    var axisLeft = d3.axisLeft(yLinearScale);

    // Scale the domain
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(successHandle, function(data) {
        return +data.poverty * 0.95;
    });

    xMax = d3.max(successHandle, function(data) {
        return +data.poverty * 1.05;
    });

    yMin = d3.min(successHandle, function(data) {
        return +data.healthcare * 0.98;
    });

    yMax = d3.max(successHandle, function(data) {
        return +data.healthcare *1.02;
    });
    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    
    // Initialize tooltip 
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var state = data.state;
            var pov = +data.poverty;
            var hc = +data.healthcare;
            return (
                state + '<br> Poverty: ' + pov + '% <br> Physically Active: ' + hc +'%'
            );
        });

    // Create tooltip
    chart.call(toolTip);

    chart.selectAll("circle")
        .data(successHandle)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.poverty)
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.healthcare)
        })
        .attr("r", "15")
        .attr("fill", "lightblue")
        // display tooltip on click
        .on("mouseenter", function(data) {
            toolTip.show(data);
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    // Appending a label to each data point
    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(successHandle)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare - 0.2);
            })
            .text(function(data) {
                return data.abbr
            });
    
    // Append an SVG group for the xaxis, then display x-axis 
    chart
        .append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(axisBottom);

    // Append a group for y-axis, then display it
    chart.append("g").call(axisLeft);

    // Append y-axis label
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Physically Active (%)")

    // Append x-axis labels
    chart
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("In Poverty (%)");
    });