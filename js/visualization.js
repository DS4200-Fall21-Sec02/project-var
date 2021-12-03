var activeTeams = new Set();

// Set the margins for the visualization
var margin = { top: 10, right: 30, bottom: 50, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

// Color scale for points on scatter plot
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

// Sets standing change (color of dots) to be a linear scale from red to green
var color = d3
  .scaleLinear()
  .domain([-11, 11])
  .range([perc2color(0), perc2color(100)]);

// Initiallizes our barchart SVG to left of scatter plot
var svg2 = d3
  .select("#scatter_plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right + 100)
  .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
  .attr("transform", "translate(" + margin.left * 2  + "," + margin.top + ")");

// Initiallizes our scatter plot SVG to center of top row
var svg1 = d3
  .select("#scatter_plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right + 100)
  .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
  .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")");

// Initiallizes our barchart SVG to right of scatter plot
var svg3 = d3
  .select("#scatter_plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right + 100)
  .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
  .attr("transform", "translate(" + margin.left * 2 + "," + margin.top + ")");

  // use data from team stats
  d3.csv("data/VAR_Team_Stats_Updated.csv").then((data) => {

  //Code for Scatterplot 1
  {
    var xKey1 = "Net goal score";
    var yKey1 = "Net subjective score";

    // Create scale for X axis
    var x1 = d3
      .scaleLinear()
      .domain([-8, 8])
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
          .attr("y", height / 2 + 25)
          .style("font-size", "18px")
          .attr("fill", "currentColor")
          .attr("text-anchor", "middle")
          .text(yKey1)
      );

    // Create scale for Y axis
    var y1 = d3
      .scaleLinear()
      .domain([-9, 9])
      .range([height, margin.top]);

    // Add Y axis
    svg1
      .append("g")
      .attr("transform", "translate(" + width / 2 + ", 0)")
      .call(d3.axisLeft(y1))
      .call((g) =>
        g
          .append("text")
          .attr("x", -height / 2 - 67)
          .attr("y", -width / 2 - 30)
          .style("font-size", "18px")
          .attr('transform', 'rotate(-90)')
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(xKey1)
      );

    // Adds tooltip to scatter plot
    let tooltip = d3.select("#scatter_plot")
                  .append("div") // add a div
                  .style("opacity", 0) // make the div transparant
                  .attr("class", "tooltip"); // class the div as tooltip
                                             // this is important so you can set styling
                                             // to make the div "flot" on top of the chart

    // Adds text on mouseover
    const mouseover = function(event, d) {
      tooltip.html("Team: " + d.Team + "<br> 2019 Finish: " + d.NineteenFin + "<br> 2020 Finish: " + d.TwentyFin) // set html of tooltip div
             .style("opacity", 1); // make tooltip visible
    }

    const mousemove = function(event, d) {
      // set top left of tooltip position
      tooltip.style("left", (event.x)+"px")
              .style("top", (event.y + 500) +"px"); // add an offset so it appears above the mouse
    }

    // blank tooltip when mouse not on point
    const mouseleave = function(event, d) {
      tooltip.style("opacity", 0); // make tooltip transparant again
    }

    // define brush
    var brush1 = d3.brush()
      .extent( [ [0,0], [width,height] ] )
      .on("start brush", updateChart1)

    // add brush to svg
    svg1.call(brush1);



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
      .attr("pointer-events", "all")
      .on("mouseover", mouseover) // add event listeners
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);


    }

    // standings change between two seasons for color
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
.on('mouseover', function () {
  d3.select(this).attr("stroke", "black")
  .attr("stroke-width", 3);
  selectedTeam.add(this.__data__.Team)
  svg3.selectAll("rect").classed("selected", function(d){
    return selectedTeam.has(d.Team)})
  })
  .on('mouseout', function () {
    svg3.selectAll("rect").classed("unselected", function(d){
      return selectedTeam.has(d.Team)})
      selectedTeam.clear();
      d3.select(this).attr("stroke", "white").attr("stroke-width", 0);
    });

    svg3.selectAll('rect')
    .on('mouseover', function () {
      d3.select(this).attr("stroke", "black")
      .attr("stroke-width", 3);
      selectedTeam.add(this.__data__.Team)
      svg2.selectAll("rect").classed("selected", function(d){
        return selectedTeam.has(d.Team)})
      })
      .on('mouseout', function () {
        svg2.selectAll("rect").classed("unselected", function(d){
          return selectedTeam.has(d.Team)})
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
          activeTeams = selectedTeams;
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
        .on('mouseover', function () {
          d3.select(this).attr("stroke", "black")
          .attr("stroke-width", 3);
          selectedTeam.add(this.__data__.Team)
          svg3.selectAll("rect").classed("selected", function(d){
            return selectedTeam.has(d.Team)})
          })
          .on('mouseout', function () {
            svg3.selectAll("rect").classed("unselected", function(d){
              return selectedTeam.has(d.Team)})
              selectedTeam.clear();
              d3.select(this).attr("stroke", "white").attr("stroke-width", 0);
            });

            svg3.selectAll('rect')
            .on('mouseover', function () {
              d3.select(this).attr("stroke", "black")
              .attr("stroke-width", 3);
              selectedTeam.add(this.__data__.Team)
              svg2.selectAll("rect").classed("selected", function(d){
                return selectedTeam.has(d.Team)})
              })
              .on('mouseout', function () {
                svg2.selectAll("rect").classed("unselected", function(d){
                  return selectedTeam.has(d.Team)})
                  selectedTeam.clear();
                  d3.select(this).attr("stroke", "white").attr("stroke-width", 0);
                });

              })



              //Creating the SVG for Graph 4
              var svg4 = d3
              .select("#bar_chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom + 100)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              //Creating the SVG for Graph 5
              var svg5 = d3
              .select("#bar_chart")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom + 100)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


              //Getting Data from VAR Incidents from the 2019-2020 Season
              d3.csv("data/VAR_Incidents_19_20.csv").then((data) => {

                setInterval(function() {
                  currentData = data.filter(function(d){ return [...activeTeams].indexOf(d.Team) >= 0 })
                  svg4.selectAll('*').remove()
                  svg5.selectAll('*').remove()
                  //Create First Chart For Home Decisions
                  createDecisionBarChart('H');

                  //Create Second Chart For Away Decisions
                  createDecisionBarChart('A');

                }, 1)

                //A function which takes in the the Ground (Home or Away) and generates a BarChart Accordingly
                function createDecisionBarChart(ground) {


                  //Find All Decisions By Ground 'H' or 'A' for Home or Away
                  //This list will be used to find the count of each decision type in this season
                  var decisionsList = currentData.filter(function(d) { return d.VARused === 'FOR' }).filter(function(d) { return d.Site === ground }).map(function(d) { return d.DecisionType;})

                  //console.log('a', decisionsList)
                  //Initialize each decision count as 0
                  var pkAwarded = 0;
                  var pkRetaken = 0;
                  var pkCancelled = 0;
                  var goalRuledOut = 0;
                  var goalAllowed = 0;
                  var redCard = 0;
                  var yellowCard = 0;
                  var redCardCancelled = 0;


                  //Parse the list and count each occurence of each decision type
                  decisionsList.forEach(function (item) {
                    if(item === "PK Awarded") {
                      pkAwarded++;
                    }
                    else if(item === "PK Retaken") {
                      pkRetaken++;

                    }
                    else if(item === "PK Cancelled") {
                      pkCancelled++;

                    }
                    else if(item === "Goal ruled out") {
                      goalRuledOut++;

                    }
                    else if(item === "Goal allowed") {
                      goalAllowed++;

                    }
                    else if(item === "Red Card") {
                      redCard++;

                    }

                    else if(item === "Red Card cancelled") {
                      redCardCancelled++;

                    }

                    else{

                      yellowCard++;
                    }
                  });

                  //Create a new List which displays the specie count of each decision
                  var decisionCount = [pkAwarded, pkRetaken, pkCancelled, goalRuledOut, goalAllowed, redCard, yellowCard, redCardCancelled]

                  //The data which will be plotted can be then defined below as:
                  var decisionsData = [
                    {"Decision" : "PK Awarded",
                    "DecisionCount" : decisionCount[0]},
                    {"Decision" : "PK Retaken",
                    "DecisionCount" : decisionCount[1]},
                    {"Decision" : "PK Cancelled",
                    "DecisionCount" : decisionCount[2]},
                    {"Decision" : "Goal ruled out",
                    "DecisionCount" : decisionCount[3]},
                    {"Decision" : "Goal allowed",
                    "DecisionCount" : decisionCount[4]},
                    {"Decision" : "Red Card",
                    "DecisionCount" : decisionCount[5]},
                    {"Decision" : "Yellow Card",
                    "DecisionCount" : decisionCount[6]},
                    {"Decision" : "Red Card cancelled",
                    "DecisionCount" : decisionCount[7]}
                  ]

                  //  console.log(decisionsData)

                  if(ground == 'H') {

                    //1. Set x,y Scales for the bar chart
                    let x = d3.scaleBand().range([0, width]).padding(0.13),
                    y = d3.scaleLinear().range([height, 0]);


                    //Create Domain for X and Y axis

                    x.domain(decisionsData.map(function(d) {return d.Decision; }));
                    y.domain([0, 50]);


                    //Create the Bar Chart with decisionsData defined
                    var decisionsBarChart1 = svg4.selectAll(".bar")
                    .data(decisionsData)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.Decision) })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.DecisionCount); })
                    .attr("height", function(d) { return height - y(d.DecisionCount)})
                    //Code from https://stackoverflow.com/questions/37585131/how-to-set-color-gradient-in-barchart-using-d3-js
                    .attr("fill", 'green')

                    //Append the x-axis to the SVG
                    svg4.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

                    //Append the y-axis to the SVG
                    svg4.append("g")
                    .call(d3.axisLeft(y));


                    svg4.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", width - 75)
                    .attr("y", height + 100)
                    .text("Decisions made in favour of Home Teams");

                    //adding the y label
                    svg4.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", 10)
                    .attr("x", -100)
                    .attr("dy", "-2.8em")
                    .attr("transform", "rotate(-90)")
                    .text("Count of Each Decision Type");

                  }

                  else {

                    //1. Set x,y Scales for the bar chart
                    let x = d3.scaleBand().range([0, width]).padding(0.13),
                    y = d3.scaleLinear().range([height, 0]);


                    //Create Domain for X and Y axis

                    x.domain(decisionsData.map(function(d) {return d.Decision; }));
                    y.domain([0, 50]);
                    //Create the Bar Chart with decisionsData defined
                    var decisionsBarChart1 = svg5.selectAll(".bar")
                    .data(decisionsData)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.Decision) })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.DecisionCount); })
                    .attr("height", function(d) { return height - y(d.DecisionCount)})
                    //Code from https://stackoverflow.com/questions/37585131/how-to-set-color-gradient-in-barchart-using-d3-js
                    .attr("fill", 'red')

                    //Append the x-axis to the SVG
                    svg5.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end");

                    //Append the y-axis to the SVG
                    svg5.append("g")
                    .call(d3.axisLeft(y));


                    svg5.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "end")
                    .attr("x", width - 75)
                    .attr("y", height + 100)
                    .text("Decisions made in favour of Away Teams");

                    //adding the y label
                    svg5.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "end")
                    .attr("y", 10)
                    .attr("x", -100)
                    .attr("dy", "-2.8em")
                    .attr("transform", "rotate(-90)")
                    .text("Count of Each Decision Type");

                  }
                }
              });
