// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv")
  .then(function(healthData) {
    
    // Parse data
    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
      });
    
    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData, d => d.poverty)+1])
      .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)+1])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axis to chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create circles
    chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "red")
    .attr("opacity", "1");

    // Add circle labels
    chartGroup.selectAll(".circle")
    .data(healthData)
    .enter()
    .append("text")
    .text(function(data) { return data.abbr; })
    .attr("x", function(data) {
        return xLinearScale(data.poverty);
    })
    .attr("y", function(data) {
        return yLinearScale(data.healthcare);
    })
    .attr("font-size", "10px")
    .attr("fill", "white")
    .style("text-anchor", "middle");


    /*.text((d) => (d.abbr[0] + "," + d.abbr[1]))
    .attr("x", (d) => (d.abbr[0] + 5))
    .attr("y", (d) => (h - d.abbr[1])); */

    // Create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
});