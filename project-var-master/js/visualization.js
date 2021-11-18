// Set the margins for the visualization
var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

  function perc2color(perc) {
    var r, g, b = 0;
    if(perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    }
    else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  } 

var color = d3
  .scaleLinear()
  .domain([-11, 11])
  .range([perc2color(0), perc2color(100)]);



// For each visualization, append an SVG to the HTML div
//   with id = "dataviz_brushScatter"
var svg1 = d3
  .select("#scatter_plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var svg2 = d3
  .select("#bar_chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var svg3 = d3
  .select("#bar_chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 100)
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
      .domain([-8, 8])
        //d3.extent(data.map((val) => val[xKey1])))
      .range([0, width]);
    
    // Add X axis 
    svg1
      .append("g")
      .attr("transform", "translate(0," + (height / 2 + margin.top / 2) + ")")
      .call(d3.axisBottom(x1))
      .call((g) =>
        g
          .append("text")
          .attr("x", width / 2)
          .attr("y", height / 2 + 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "middle")
          .text(yKey1)
      );

    // Create scale for Y axis 
    var y1 = d3
      .scaleLinear()
      .domain([-9, 9])
        //d3.extent(data.map((val) => val[yKey1])))
      .range([height, margin.top]);
    
    // Add Y axis 
    svg1
      .append("g")
      .attr("transform", "translate(" + width / 2 + ", 0)")
      .call(d3.axisLeft(y1))
      .call((g) =>
        g
          .append("text")
          .attr("x", -height / 2 - 40)
          .attr("y", -width / 2 - 10)
          .attr('transform', 'rotate(-90)')
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(xKey1)
      );

    // Add points to the chart 
    var myCircle1 = svg1
      .append("g")
      .selectAll("circle")
      .data(data.filter(function(d){return (d.NineteenFin != -1) && (d.TwentyFin != -1)}))
      .enter()
      .append("circle")
      .attr("id", (d) => d.team)
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

    svg1.append("text")
          .attr("x", (width / 2))             
          .attr("y", margin.top / 2)
          .attr("text-anchor", "middle")  
          .style("font-size", "18px") 
          .style("text-decoration", "underline")  
          .text("Net Subjective Score & Goal Score on Standings");

    // define brush
    var brush1 = d3.brush() 
    .extent( [ [0,0], [width,height] ] )
    .on("start brush", updateChart1)
       
    // add brush to svg
    svg1.call(brush1)
  }


    function get_diff(team) {
      return team["NineteenFin"] - team["TwentyFin"];
    }


      const x2 = d3.scaleBand()
      .range([ 0, width])
      .domain(data.map(d => d.Team))
      .padding(0.5);
      svg2.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x2))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    
      const x3 = d3.scaleBand()
      .range([ 0, width])
      .domain(data.map(d => d.Team))
      .padding(0.5);
      svg3.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x3))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    
      const y2 = d3.scaleLinear()
      .domain([0, 30])
      .range([ height, 0]);
      svg2.append("g")
      .call(d3.axisLeft(y2));
    
      const y3 = d3.scaleLinear()
      .domain([0, 30])
      .range([ height, 0]);
      svg3.append("g")
      .call(d3.axisLeft(y3));
    
      var colors = d3.scaleOrdinal()
        .domain(['AFC Bournemouth','Arsenal','Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea','Crystal Palace','Everton','Fulham', 'Leeds','Leicester City','Liverpool','Manchester City',
      'Manchester United','Newcastle', 'Norwich City', 'Sheffield United', 'Southampton','Tottenham Hotspur','Watford','West Brom', 'West Ham','Wolves'])
        .range(['#ba0f13', '#EF0107', '#670E36', '#FFCD00', '#6C1D45', '#034694', '#A7A5A6', '#003399', '#000000', '#AC944D', '#003090', '#C8102E', '#6CABDD',
      '#DA291C','#241F20', '#00A650', '#EE2737', '#D71920','#132257','#FBEE23','#122F67', '#7A263A','#FDB913'])
    
      var myBars1 = svg2.selectAll("bar_chart")
          .data(data)
          .enter()
          .append("rect")
            .attr("x", d => x2(d.Team))
            .attr("y", d => y2(d.Totalfor))
            .attr("width", x2.bandwidth())
            .attr("height", d => height  - y2(d.Totalfor))
            .attr("fill", function(d, i) { return colors(d.Team) })
    
        //adding the x label
        svg2.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 100)
        .attr("y", height + 100)
        .text("Premier League Teams");
    
        //adding the y label
        svg2.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 10)
        .attr("x", -100)
        .attr("dy", "-2.8em")
        .attr("transform", "rotate(-90)")
        .text("Number of VAR Decissions For");
    
        var myBars2 = svg3.selectAll("bar_chart")
            .data(data)
            .enter()
            .append("rect")
              .attr("x", d => x3(d.Team))
              .attr("y", d => y3(d.Totalagainst))
              .attr("width", x3.bandwidth())
              .attr("height", d => height  - y3(d.Totalagainst))
              .attr("fill", function(d, i) { return colors(d.Team) })
    
          //adding the x label
          svg3.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width - 100)
          .attr("y", height + 110)
          .text("Premier League Teams");
    
          //adding the y label
          svg3.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", 10)
          .attr("x", -100)
          .attr("dy", "-2.8em")
          .attr("transform", "rotate(-90)")
          .text("Number of VAR Decissions Against");
    
          var selectedTeam = new Set();
          svg2.selectAll('rect')
          .on('mousemove', function () {
            d3.select(this).attr("stroke", "black")
                            .attr("stroke-width", 2);
            selectedTeam.add(this.__data__.Team)
            svg3.selectAll("rect").classed("selected", function(d){
            return selectedTeam.has(d.Team)})
          })
          .on('mouseout', function () {
            selectedTeam.clear();
            d3.select(this).attr("stroke", "white").attr("stroke-width", 0);
          });
    
          svg3.selectAll('rect')
          .on('mousemove', function () {
            d3.select(this).attr("stroke", "black")
                            .attr("stroke-width", 2);
            selectedTeam.add(this.__data__.Team)
            svg2.selectAll("rect").classed("selected", function(d){
            return selectedTeam.has(d.Team)})
          })
          .on('mouseout', function () {
            selectedTeam.clear();
            d3.select(this).attr("stroke", "white").attr("stroke-width", 0);
          });
    
// brushing
function clear() {
  svg1.call(brush1.move, null);
}

//Is called when we brush on scatterplot #1
function updateChart1(brushEvent) {
  extent = brushEvent.selection;
  var selectedTeams = new Set();


  myCircle1.classed("selected", function(d){ 
    if(isBrushed(extent, x1(d["Net goal score"]), y1(d["Net subjective score"]))) {
      selectedTeams.add(d.Team)
      //console.log(d.Team)
      return true
    } 
  } )
  
  // A function that return TRUE or FALSE according if a dot is in the selection or not
  myBars1.classed("selected", function(d){ return selectedTeams.has(d.Team)})
  myBars2.classed("selected", function(d){ return selectedTeams.has(d.Team)})
}


function isBrushed(brush_coords, cx, cy) {
  if (brush_coords === null) return;

  var x0 = brush_coords[0][0],
    x1 = brush_coords[1][0],
    y0 = brush_coords[0][1],
    y1 = brush_coords[1][1];
  return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; // This return TRUE or FALSE depending on if the points is in the selected area
}

var selectedTeam = new Set();
      svg2.selectAll('rect')
      .on('mousemove', function () {
        d3.select(this).attr("stroke", "black")
                        .attr("stroke-width", 2);
        selectedTeam.add(this.__data__.Team)
        svg3.selectAll("rect").classed("selected", function(d){
        return selectedTeam.has(d.Team)})
      })
      .on('mouseout', function () {
        selectedTeam.clear();
        d3.select(this).attr("stroke", "white").attr("stroke-width", 0);
      });

      svg3.selectAll('rect')
      .on('mousemove', function () {
        d3.select(this).attr("stroke", "black")
                        .attr("stroke-width", 2);
        selectedTeam.add(this.__data__.Team)
        svg2.selectAll("rect").classed("selected", function(d){
        return selectedTeam.has(d.Team)})
      })
      .on('mouseout', function () {
        selectedTeam.clear();
        d3.select(this).attr("stroke", "white").attr("stroke-width", 0);
      });
    
  })