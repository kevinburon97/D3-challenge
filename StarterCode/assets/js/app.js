var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "smokes";
// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.97,
      d3.max(data, d => d[chosenXAxis]) * 1.03
    ])
    .range([0, width]);

  return xLinearScale;

}
// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.93,
      d3.max(data, d => d[chosenYAxis]) * 1.07
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxesx(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis var upon click on axis label
function renderAxesy(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating x circles group with a transition to new circles
function renderCirclesx(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating y circles group with a transition to new circles
function renderCirclesy(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "age") {
    label = "age:";
  }
  else if (chosenXAxis === "income") {
    label = "income:";
  }
  else {
    label = "poverty:";
  }

  var label2;

  if (chosenYAxis === "obesity") {
    label2 = "Obesity:";
  }
  else if (chosenYAxis === "healthcare") {
    label2 = "Healthcare:";
  }
  else {
    label2 = "Smokes:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0, -00])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}<br>${label2} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data, err) {
  if (err) throw err;

  // parse data
  data.forEach(function(data) {
    data.income = +data.income;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
  });

  // Y and X linearscale
  var xLinearScale = xScale(data, chosenXAxis);
  var yLinearScale = yScale(data, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("fill", "orange")
    .attr("opacity", ".4")
    ;

  // Create group for x-axis labels
  var labelsGroupx = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ageLabel = labelsGroupx.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") 
    .classed("active", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroupx.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income")
    .classed("inactive", true)
    .text("Income (Median)");
    var povertyLabel = labelsGroupx.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty") 
    .classed("inactive", true)
    .text(" In Poverty (%)");
  

  // Create group for y-axis labels
    var labelsGroupy = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("transform", `translate(-90, ${height/2})`);

    var smokesLabel = labelsGroupy.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .attr("value", "smokes") 
    .classed("active", true)
    .text("Smokes (%)");

    var obesityLabel = labelsGroupy.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("transform", "rotate(-90)")
    .attr("value", "obesity") 
    .classed("inactive", true)
    .text("Obese (%)");
    
    var healthLabel = labelsGroupy.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("transform", "rotate(-90)")
    .attr("value", "healthcare") 
    .classed("inactive", true)
    .text(" Lacks Healthcare(%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroupx.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxesx(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCirclesx(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
            ageLabel
            .classed("active", true)
            .classed("inactive", false);
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if(chosenXAxis === "income"){
            ageLabel
            .classed("active", false)
            .classed("inactive", true);
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
          .classed("active", false)
          .classed("inactive", true);
          incomeLabel
          .classed("active", false)
          .classed("inactive", true);
          povertyLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      }
    });

    // y axis labels event listener
  labelsGroupy.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // updates x scale for new data
      yLinearScale = yScale(data, chosenYAxis);

      // updates x axis with transition
      yAxis = renderAxesy(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = renderCirclesy(circlesGroup, yLinearScale, chosenYAxis);

     // updates tooltips with new info
     circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
// changes classes to change bold text
      if (chosenYAxis === "smokes") {
        smokesLabel
        .classed("active", true)
        .classed("inactive", false);
        healthLabel
        .classed("active", false)
        .classed("inactive", true);
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else if(chosenYAxis === "obesity"){
      smokesLabel
      .classed("active", false)
      .classed("inactive", true);
      obesityLabel
      .classed("active", true)
      .classed("inactive", false);
      healthLabel
      .classed("active", false)
      .classed("inactive", true);
    }
    else {
    smokesLabel
    .classed("active", false)
    .classed("inactive", true);
    obesityLabel
    .classed("active", false)
    .classed("inactive", true);
    healthLabel
    .classed("active", true)
    .classed("inactive", false);
}
}
});
  }).catch(function(error) {
  console.log(error);
});

