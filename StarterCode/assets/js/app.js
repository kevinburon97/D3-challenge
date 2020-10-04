
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 60,
  left: 40
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

  // Append a group to the SVG area and shift it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("assets/data/data.csv").then(function(data, err) {
    if (err) throw err;

    data.forEach(function(d) {
        d.smokes = +d.smokes;
        d.age = +d.age;
    })
    //Create xScale
    var xScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.smokes) -1, d3.max(data, (d) => d.smokes)])
    .range([0, chartWidth]);
    
    //Create yScale
    var yScale = d3.scaleLinear()
    .domain([d3.min(data, (d) => d.age) -1, d3.max(data, (d) => d.age)])
    .range([chartHeight,0]);
    

chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.smokes))
    .attr("cy", d => yScale(d.age))
    .attr("r",7);

var bottomaxis = d3.axisBottom(xScale)
var leftaxis = d3.axisLeft(yScale)

chartGroup.append("g")
.call(leftaxis)
chartGroup.append("g")
.call(bottomaxis).attr("transform", `translate(0,${chartHeight})`)
})
chartGroup.append('text')
    .attr("x", chartWidth/2)
    .attr("y", chartHeight+30)
    .attr("value", "smoke")
    
    .text("Smoke");

    chartGroup.append('text')
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight/2)
    .attr("y", -25)
    .attr("value", "smoke")
    
    .text("Smoke");