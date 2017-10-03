// Project 1 Part 1 JavaScript
// Sawyer Billings and Grace Mallett

var width = 700;
var height = 500;
var padding = 90;
var barPadding = 10;
var dataset;
var xScale;
var yScale;

function main (dataset) {
  // Read in Breast Cancer Wisconsin dataset
  var thickness = [];
  d3.csv("breast-cancer-wisconsin.csv", function(data){
    dataset = data;
    data.map(function(d){
      thickness.push(parseInt(d.Thickness));
    }) 
  });
  alert("reading in data")

  // Define xScale
  xScale = d3.scaleLinear()
             .domain([0, d3.max(dataset, function(d) { return parseInt(d.Uniformity_Cell_Size); })])
             .range([padding, width]);

  // Define yScale 
  yScale = d3.scaleBand()
             .domain(thickness)
             .range([padding/2, height - padding]);

  // Define xAxis
  var xAxis = d3.axisBottom()
          .scale(xScale)
          .ticks(10);

  // Define yAxis
  var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10);

  // Make the SVG
  var svg = makeSVG();

  // Make and label the bar chart
  makeAndLabelBarChart(svg, dataset, xScale, yScale, xAxis, yAxis);
}


function makeAndLabelBarChart (svg, dataset, xScale, yScale, xAxis, yAxis) {
  // Draw each SVG rectangle representing each value in dataset
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", padding)
    .attr("width", function(d) {
      return xScale(parseInt(d.Uniformity_Cell_Size));
     })
    .attr("y", function(d) {
      return yScale(parseInt(d.Thickness));
     })
    .attr("height", yScale.bandwidth() - barPadding)
    .attr("fill", "blue")
    .on("mouseover", function(d) {

    //Get this bar's x/y values, then augment for the tooltip
    var xPosition = parseFloat(d3.select(this).attr("x")) / 2 + width / 2;
    var yPosition = parseFloat(d3.select(this).attr("y")) + yScale.bandwidth();

    //Update the tooltip position and value
    d3.select("#tooltip")
      .style("left", xPosition + "px")
      .style("top", yPosition + "px")           
      .select("#value")
      .text(d);

    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);

    })
    .on("mouseout", function() {

    //Hide the tooltip
    d3.select("#tooltip").classed("hidden", true);

    });

  // call the ascend function 
  document.getElementById("ascend").addEventListener("click", function(){
    sortBarsAscending(svg)
  })

  // call the descend function
  document.getElementById("descend").addEventListener("click", function(){
    sortBarsDescending(svg)
  })

  //Create X axis
  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + (height - padding) + ")")
  .call(xAxis);

  //Create Y axis
  svg.append("g")
  .attr("class", "y axis")
  .attr("transform", "translate(" + padding + ")")
  .call(yAxis);

  //Create labels
  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    // .text(function(d) {
    //   return "(" + d.Uniformity_Cell_Size + "," + d.Thickness + ")";
    // })
    .attr("x", function(d) {
      return xScale(d.Uniformity_Cell_Size);
    })
    .attr("y", function(d) {
      return yScale(d.Thickness);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "green");
}

function makeSVG () {
  var svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  return svg
}

// sort the bars in  ascending order
function sortBarsAscending (svg) {
  svg.selectAll("rect")
     .sort(function(a, b) {
       return d3.ascending(parseInt(a.Uniformity_Cell_Size), parseInt(b.Uniformity_Cell_Size));
      })
     .transition()
     .duration(1000)
     .attr("y", function(d, i) {
        return yScale(i);
     });
}

// sort the bars in descending order
function sortBarsDescending (svg) {
  svg.selectAll("rect")
     .sort(function(a, b) {
       return d3.descending(parseInt(a.Uniformity_Cell_Size), parseInt(b.Uniformity_Cell_Size));
      })
     .transition()
     .duration(1000)
     .attr("y", function(d, i) {
        return yScale(i);
     });
}

main()
