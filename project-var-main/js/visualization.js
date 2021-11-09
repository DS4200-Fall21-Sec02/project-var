// Set the margins for the visualization 
var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

var color = d3
  .scaleLinear()
  .domain([10, -11])
  .range(['rgb(200,0,0)', 'rgb(0,200,0)']);

// For each visualization, append an SVG to the HTML div
//   with id = "dataviz_brushScatter"
var svg1 = d3
  .select("#scatter_plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/VAR_Team_Stats_Updated.csv").then((data) => {

//Code for Scatterplot 1
{
  var xKey1 = "Net goal score";
  var yKey1 = "Net subjective score";

  // Create scale for X axis
  var x1 = d3
    .scaleLinear()
    .domain(d3.extent(data.map((val) => val[xKey1])))
    .range([0, width]);
  
  // Add X axis 
  svg1
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x1))
    .call((g) =>
      g
        .append("text")
        .attr("x", width)
        .attr("y", margin.bottom - 4)
        .attr("fill", "currentColor")
        .attr("text-anchor", "end")
        .text(xKey1)
    );

  // Create scale for Y axis 
  var y1 = d3
    .scaleLinear()
    .domain(d3.extent(data.map((val) => val[yKey1])))
    .range([height, 0]);
  
  // Add Y axis 
  svg1
    .append("g")
    .call(d3.axisLeft(y1))
    .call((g) =>
      g
        .append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yKey1)
    );

  // Add points to the chart 
  var myCircle1 = svg1
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", (d) => d.id)
    .attr("cx", function (d) {
      return x1(d[xKey1]);
    })
    .attr("cy", function (d) {
      return y1(d[yKey1]);
    })
    .attr("r", 8)
    .style("fill", function (d) {
      return color(get_diff(d));
    })

}

});

  function get_diff(team) {
    return team.NineteenFin - team.TwentyFin;
  }
