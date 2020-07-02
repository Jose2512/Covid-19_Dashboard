//new
var svgWidth = 800;
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
var linegraph   ="no"

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

function renderCircles(circlesGroup, newXScale, chosenXAxis,vl_color) {

  if (vl_color == "pink") {
  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newXScale(d[chosenXAxis]))
    .attr("fill", vl_color)
    //.attr("opacity", ".") 
  } else {

    circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newXScale(d[chosenXAxis]))
    .attr("fill", vl_color)
    .attr("opacity", ".6") 


  }


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

// pick the circle color for each option


function  select_color(value) {
  switch(value) {
    case "CASOS_HOMBRES":
      vl_color = "blue";
      break;
    
     case "CASOS_MUJERES":
      vl_color = "#f781bf";
     
      break;
    default:
      vl_color = "black";
  }
  return vl_color
}


// creates the line
function line_mot(chartGroup,ingData, xLinearScale,yLinearScale,chosenYAxis) //,bottomAxis,leftAxis)

//chosenYAxis
// .attr("cy", d => newXScale(d[chosenXAxis]))
 {

console.log("enter motion",chosenYAxis)
 
// Line generators for each line
    var line1 = d3.line()
    .x(d => xLinearScale(d.FECHA))
    .y(d => yLinearScale(d[chosenYAxis]));



  // Append a path for line1
  var lpath =  chartGroup.append("path")
    .data([ingData])
    .attr("d", line1)
    //.attr("class", "line01")
    .attr("id","line01")
    .attr("stroke" , "black")
    .attr("stroke-width" , 2)
    .attr("opacity", ".7")
    .attr("stroke-dasharray", ("3, 3"));
    console.log("line3")

var totalLength = lpath.node().getTotalLength();

lpath.attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
		.duration(10000)
		.ease(d3.easeLinear)  // check more options https://bl.ocks.org/d3noob/39e8263efd3db34c3bde486f9067a961
		.attr("stroke-dashoffset", 0);

    return lpath

}


function labelx_group(chartGroup) {

  // Create group for two x-axis labels
  var labelsGroup = chartGroup.append("g")
    //  .attr("transform", `translate(${width/1.7 }, ${height  +20 })`);

    labelsGroup .append('rect')
     // .attr('class', "line green")
      .attr("id" ,"r1")
      .style("fill","blue")
      .attr("opacity", ".7")
      .attr('x', 3) //(w / 2) - (margin.middle * 3))
      .attr('y', 9)
      .attr('width', 12)
      .attr('height', 12); 



  var hLabel = labelsGroup.append("text")
    .attr("x", 18)
    .attr("y", 20)
    .attr("value", "CASOS_HOMBRES") // value to grab for event listener
    .classed("active", true)
    .text("Hombres");

    labelsGroup .append('rect')
   
     .attr("id" ,"r1")
     .style("fill","pink")
     .attr('x', 90) //(w / 2) - (margin.middle * 3))
     .attr('y', 9)
     .attr('width', 12)
     .attr('height', 12); 


  var mLabel = labelsGroup.append("text")
    .attr("x", 105)
    .attr("y", 20)
    .attr("value", "CASOS_MUJERES") // value to grab for event listener
    .classed("inactive", true)
    .text("Mujeres");


 
    labelsGroup .append('rect')
 
     .attr("id" ,"r1")
     .style("fill","black")
     .attr("opacity", ".7")
     .attr('x', 170) //(w / 2) - (margin.middle * 3))
     .attr('y', 9)
     .attr('width', 12)
     .attr('height', 12); 


    var totLabel = labelsGroup.append("text")
    .attr("x",185)
    .attr("y", 20)
    .attr("value", "CASOS_TOTALES") // value to grab for event listener
    .classed("inactive", true)
    .text("Acumulado");

/*
    labelsGroup .append('rect')
 
     .attr("id" ,"r1")
     .style("fill","red")
     .attr("opacity", ".7")
     .attr('x', 3)//(w / 2) - (margin.middle * 3))
     .attr('y', 380)
     .attr('width', 12)
     .attr('height', 12); 


    var graphLabel = labelsGroup.append("text")
    .attr("x",30)
    .attr("y", 390)
    //.attr("value", "yes") // value to grab for event listener
    .classed("inactive", true)
    .text("Total Casos");

*/


  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height /1.5))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Casos por dia");




return labelsGroup

} // labelx_group






// Retrieve data from the CSV file and execute everything below
d3.json("/case_date").then(function(ingData, err) {
  if (err) throw err;

  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y-%m-%d");
  // parse data
  ingData.forEach(function(data) {
    data.CASOS_HOMBRES = +data.CASOS_HOMBRES;
    data.CASOS_MUJERES = +data.CASOS_MUJERES;
    data.CASOS_TOTALES =+data.CASOS_TOTALES;
    data.FECHA = parseTime(data.FECHA);

  });

  // xLinearScale function above csv import
 // var xLinearScale = xScale(ingData, chosenXAxis);


var xTimeScale = xtScale(ingData, chosenXAxis)
var xLinearScale = xTimeScale

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(ingData, d => d.CASOS_TOTALES)])
    .range([height, 0]);
    

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y-%m-%d"));
  var leftAxis = d3.axisLeft(yLinearScale);


  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

   

    var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(ingData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.CASOS_TOTALES )) //casos totales
    .attr("r", 4)
    .attr("fill", "black")
    .attr("opacity", ".7");

   // create the x labels
  var labelsGroup = labelx_group(chartGroup)



  // updateToolTip function above csv import
 
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);
  vl_graph = "1"

// draw the line
 //var lpath = line_mot(chartGroup,ingData, xLinearScale,yLinearScale,chosenYAxis)
 
 var old_value = chosenYAxis
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      
      var new_value = value
      
      console.log("old value", old_value)
      console.log("new value", new_value)
      old_value = new_value
      console.log("old value===", old_value)

      if (value !== chosenYAxis) {



       // remove the line graph
       chartGroup.select("#line01").remove()
       // d3.select("#p2").style("color", "green");

      
         d3.selectAll(".tooltip")
        .style("visibility", "hidden")

        // replaces chosenXAxis with value  
        chosenYAxis = value;
       

        var  vl_color =  select_color(value);
  
    

        // functions here found above csv import
        // updates x scale for new data
       

        yLinearScale = yScale(ingData, chosenYAxis);


        // updates x axis with transition


        yAxis = yrenderAxes(yLinearScale, yAxis);





        // updates circles with new x values
      
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis,vl_color);


        // updates tooltips with new info
        //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        
        
        var lpath = line_mot(chartGroup,ingData, xLinearScale,yLinearScale,chosenYAxis)
    


      }  //end if
    });  // listener  labels group  */




}).catch(function(error) {
  console.log(error);
}); 
