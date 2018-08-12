// define svg area dimensions 
var svgWidth = 990;
var svgHeight = 500;

// define chart margins as object 
var margin = {
    top: 20, 
    right: 40, 
    bottom: 100, 
    left: 180
};

// // define dimensions for chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//select chart, append svg area to it, and set dimensions
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";//*



// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
}

// function used for updating y-scale var upon click on axis label //*
function yScale(data, chosenYAxis){
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, newYScale, xAxis, yAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    var leftsAxis = d3.axisLeft(newYScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    
    yAxis.transition()
      .duration(1000)
      .cal(leftsAxis);
  
    return xAxis, yAxis; //*
  }

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var xlabel = "Poverty (%) : ";
    }
    if (chosenYAxis === "healthcare"){
      var ylabel = "Lacks HC (%) : "
    }
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -70])
      .style("font-family", "arial")
      .style("font-size", "16px")
      .html(function(d) {
        return (`${d.state}<br><br>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }



// Retrieve data from the CSV file and execute everything below
var file = "https://raw.githubusercontent.com/the-Coding-Boot-Camp-at-UT/UTAUS201804DATA2-Class-Repository-DATA/master/16-D3/HOMEWORK/Instructions/data/data.csv?token=AiazW_tvL4OQXH4aQqMTQFuhCXl3zJZ1ks5bePdVwA%3D%3D"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
  throw error;
}

function successHandle(data) {

  // parse data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5");


  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var in_povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") 
    .style("font-family", "arial")
    .style("font-weight", "bold")
    .classed("active", true)
    .text("In Poverty (%)");

  var albumsLabel = labelsGroup.append("text")
    .attr("x", 0)    
    .attr("y", 40)
    .attr("value", "poverty")
    .classed("inactive", true)
    .text("");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", - 250)
    .attr("dy", "1em")
    .style("font-family", "arial")
    .style("font-weight", "bold")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          in_povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          in_povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
}

