//new

var svgWidth = parseInt(d3.select('#mainLinechart').style('width'), 10);
var svgHeight = 450;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#mainLinechart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "svg_line");

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "FECHA";
var chosenYAxis = "CASOS_TOTALES";

// function used for updating x-scale var upon click on axis label
function xScale(ingData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(ingData, d => d[chosenXAxis]) * 0.8,
      d3.max(ingData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

//  yLinearScale = yScale(ingData, chosenYAxis);

function yScale(ingData, chosenYAxis) {
   // var chosenYAxis = "CASOS_TOTALES";


   if (chosenYAxis !=="CASOS_TOTALES") {
    // create scales
   var yLinearScale = d3.scaleLinear()
     .domain([d3.min(ingData, d => d[chosenYAxis]) * 0.8,
       d3.max(ingData, d => d[chosenYAxis]) 
     ])
      .range([height, 0]);

      
  
    } else {
        var yLinearScale = d3.scaleLinear()
     .domain([d3.min(ingData, d => d[chosenYAxis]) * 0.8,
       d3.max(ingData, d => d[chosenYAxis]) 
     ])
      .range([height, 0]);
      console.log("d3.min(ingData,",d3.min(ingData, d => d[chosenYAxis]))
      console.log("d3.min(ingData 2,",d3.max(ingData, d => d[chosenYAxis]))
      console.log("ysacle",chosenYAxis)

    }



    return yLinearScale;
  
  }






 

function xtScale(ingData, chosenXAxis) {

 var xTimeScale = d3.scaleTime()
 .domain(d3.extent(ingData, d => d[chosenXAxis]))
 .range([0, width]);

 return xTimeScale

}



//xAxis = renderAxes(xLinearScale, xAxis);
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}



// function used for updating xAxis var upon click on axis label
function yrenderAxes(newYScale, yAxis) {


   // var bottomAxis = d3.axisBottom(newXScale);
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  




// function used for updating circles group with a transition to
// new circles
//circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {


  console.log ("update tool",chosenYAxis)
  var label;

  if (chosenYAxis === "CASOS_MUJERES") {
    label = "CASOS_MUJERES:";
  }
  else {
    label = "CASOS_HOMBRES:";
  }

 
   // date formatter to display dates nicely
var dateFormatter = d3.timeFormat("%d-%b");

// Step 1: Append tooltip div
var toolTip = d3.select("body")
.append("div")
.classed("tooltip", true);


   // Step 2: Create "mouseover" event listener to display tooltip
   circlesGroup.on("mouseover", function(d) {
    //toolTip.style("display", "block")
    toolTip.transition()
    .duration(100)
    .style("opacity", 0.9);
     toolTip.html( `<strong>Fech: ${dateFormatter(d.FECHA)}` + `<hr> Pacientes: ${d[chosenYAxis]}`)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
  })
    // Step 3: Create "mouseout" event listener to hide tooltip
   .on("mouseout", function() {
     //toolTip.style("display", "none");

     toolTip.transition()
     .duration(100)
     .style("opacity", 0.9);

    }); // mouseover 
  


  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
function renderGraph(data,err){
  if (err) throw err;

  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y-%m-%d");
  // parse data
  ingData.forEach(function(data) {
    data.hair_length = +data.CASOS_HOMBRES;
    data.num_hits = +data.CASOS_MUJERES;
    data.num_albums =+data.CASOS_TOTALES;
    data.FECHA = parseTime(data.FECHA);
  });

  // xLinearScale function above csv import
 // var xLinearScale = xScale(ingData, chosenXAxis);

  console.log("chosenXAxis",chosenXAxis)

  var xTimeScale = xtScale(ingData, chosenXAxis)
  var xLinearScale = xTimeScale

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    //.domain([0, d3.max(ingData, d => d.num_hits)])
    .domain([0, d3.max(ingData, d => d.num_albums)])
    .range([height, 0]);
    

  // Create initial axis functions
  //var bottomAxis = d3.axisBottom(xLinearScale);
  var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y-%m-%d"));
  var leftAxis = d3.axisLeft(yLinearScale);


  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  //chartGroup.append("g")
   // .call(leftAxis);

    var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(ingData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.num_albums )) //casos totales
    .attr("r", 4)
    .attr("fill", "pink")
    //.attr("opacity", ".5");

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    //.attr("transform", `translate(${width / 2}, ${height + 20})`);
    .attr("transform", `translate(${width/1.5 }, ${height  +20 })`);

  var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "CASOS_HOMBRES") // value to grab for event listener
    .classed("active", true)
    .text("Hombres");

  var albumsLabel = labelsGroup.append("text")
    .attr("x", 90)
    .attr("y", 20)
    .attr("value", "CASOS_MUJERES") // value to grab for event listener
    .classed("inactive", true)
    .text("Mujeres");

    var albumsLabel = labelsGroup.append("text")
    .attr("x",170)
    .attr("y", 20)
    .attr("value", "CASOS_TOTALES") // value to grab for event listener
    .classed("inactive", true)
    .text("Total");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height /1.5))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("   Numero de Ingresos    ");

  // updateToolTip function above csv import
 
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {



         d3.selectAll(".tooltip")
     
        .style("visibility", "hidden")


        // replaces chosenXAxis with value
   
        chosenYAxis = value;
        console.log("about new option",chosenYAxis)

    

        // functions here found above csv import
        // updates x scale for new data
       

        yLinearScale = yScale(ingData, chosenYAxis);


        // updates x axis with transition

      //  xAxis = renderAxes(xLinearScale, xAxis);

        yAxis = yrenderAxes(yLinearScale, yAxis);

        // updates circles with new x values
      
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);


        // updates tooltips with new info
        //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        

        // changes classes to change bold text
        if (chosenYAxis === "CASOS_HOMBRES") {
            console.log("Active",chosenYAxis)
          albumsLabel
            .classed("active", true)
            .classed("inactive", false);
          hairLengthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          hairLengthLabel
            .classed("active", true)
            .classed("inactive", false);
        }



      }  //end if
    ;  // listener  labels group  */

}).catch(function(error) {
  console.log(error);
}); 
}

