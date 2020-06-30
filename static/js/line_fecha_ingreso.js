function onMouseOver(d, i) {
  d3.select(this).attr('class', 'highlight');

}

function initt() {

// Step 1: Set up our chart
//= ================================
var svgWidth = 800;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 30,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================

var svg = d3.select("#mainLinechart").append("svg")

  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the donuts.csv file
// =================================
d3.csv("../assets/data/casos_fecha_ingreso2.csv").then(function(covdata) {
  // Step 4: Parse the data
  // Format the data and convert to numerical and date values
  // =================================
  // Create a function to parse date and time
  var parseTime = d3.timeParse("%Y-%m-%d");

  // Format the data
  covdata.forEach(function(data) {
    data.FECHAINGRESO = parseTime(data.FECHAINGRESO);
    data.CASOSHOMBRES = +data.CASOSHOMBRES;
    data.CASOSMUJERES = +data.CASOSMUJERES;
    data.CASOSTOTALES = +data.CASOSTOTALES;
  });

  // Step 5: Create the scales for the chart
  // =================================
  var xTimeScale = d3.scaleTime()
    .domain(d3.extent(covdata, d => d.FECHAINGRESO))
    .range([0, width]);


  




  var yLinearScale = d3.scaleLinear().range([height, 0]);

  // Step 6: Set up the y-axis domain
  // ==============================================
  // @NEW! determine the max y value
  // find the max of the CASOSHOMBRES data
  var CASOSHOMBRESMax = d3.max(covdata, d => d.CASOSHOMBRES);

  // find the max of the CASOSMUJERES data
  var CASOSMUJERESMax = d3.max(covdata, d => d.CASOSMUJERES);

  // find the max of the CASOSTOTALES data
  var CASOSTOTALESMax = d3.max(covdata, d => d.CASOSTOTALES);

  /*
  var yMax;
  if (CASOSHOMBRESMax > CASOSMUJERESMax) {
    yMax = CASOSHOMBRESMax;
  }
  else {
    yMax = CASOSTOTALESMax;
  }

  */
 yMax = CASOSTOTALESMax;

  // var yMax = CASOSHOMBRESMax > CASOSMUJERESMax ? CASOSHOMBRESMax : CASOSMUJERESMax;

  // Use the yMax value to set the yLinearScale domain
  yLinearScale.domain([0, yMax]);

  

  // Step 7: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y-%m-%d"));
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 8: Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  var yAxis = chartGroup.append("g").call(leftAxis);

  //var yAxis =  chartGroup.append("g")
             //   .classed("y-axis", true)


  // Step 9: Set up two line generators and append two SVG paths
  // ==============================================

  // Line generator for CASOSHOMBRES data
  var line1 = d3.line()
    .x(d => xTimeScale(d.FECHAINGRESO))
    .y(d => yLinearScale(d.CASOSHOMBRES));
    var cas_tot_h = d3.line().y(d => yLinearScale(d.CASOSTOTALES));


  // Line generator for CASOSMUJERES data
  var line2 = d3.line()
    .x(d => xTimeScale(d.FECHAINGRESO))
    .y(d => yLinearScale(d.CASOSMUJERES));



  // Line generator for CASOSTOTALES data
  var line3 = d3.line()
  .x(d => xTimeScale(d.FECHAINGRESO))
  .y(d => yLinearScale(d.CASOSTOTALES));
 

 // Append a path for line1
 var l1=  chartGroup
    .data([covdata])
    .append("path")
    .attr("class", "line01")
    .attr("id" ,"l1")
   
    .attr("d", line1)
    .classed("line green", true);

  // Append a path for line2
  var l2= chartGroup
    .data([covdata])
    .append("path")
    .attr("class", "line02")
    .attr("id" ,"l2")
    .attr("d", line2)
    .classed("line orange", true) 

 

  // Append a path for line3
  var l3= chartGroup
  .data([covdata])
  .append("path")
  .attr("class", "line03")
  .attr("id" ,"l3")
  .attr("d", line3)
  .classed("line blue", true); 




  // Create axes labels
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 7)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "axisText")
   .text("Ingresos por Dia    ");

  chartGroup.append("text")
             
  .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
  .attr("class", "axisText")
  .text("");

// Create group for 3 options  
var xlabelsGroup = chartGroup.append("g")
    .attr('class', 'legend');

xlabelsGroup .append('rect')
        .attr('class', "line green")
        .attr("id" ,"r1")
        .attr('x', 10) //(w / 2) - (margin.middle * 3))
        .attr('y', 12)
        .attr('width', 12)
        .attr('height', 12); 



var xHomLabel = xlabelsGroup.append("text")

.attr("x", 24)
.attr("y", 24)
.attr("value", "hom") // value to grab for event listener
.classed("active", true)
.text("Hombres "); 


xlabelsGroup .append('rect')
        .attr('class', 'line orange')
        .attr("id" ,"r2")
        .attr('x', 95) //(w / 2) - (margin.middle * 3))
        .attr('y', 12)
        .attr('width', 12)
        .attr('height', 12); 

var xMujLabel = xlabelsGroup.append("text")
.attr("x", 110)
.attr("y", 24)
.attr("value", "muj") // value to grab for event listener
.classed("active", true)
.text("Mujeres");


xlabelsGroup .append('rect')
        .attr('class', 'line blue')
        .attr('x', 190) //(w / 2) - (margin.middle * 3))
        .attr('y', 12)
        .attr('width', 12)
        .attr('height', 12); 


var xMujLabel = xlabelsGroup.append("text")
.attr("x", 210)
.attr("y", 24)
.attr("value", "tot") // value to grab for event listener
.classed("active", true)
.on("mouseover", onMouseOver) //Add listener for the mouseover event
//.on("mouseout", onMouseOut)   //Add listener for the mouseout event
.text("Total");  




var xMujLabel = xlabelsGroup.append("text")
.attr("x", 1)
.attr("y", 380)
.attr("value", "ini") // value to grab for event listener
.classed("active", true)
.text("Inicio"); 
  




// x axis labels event listener
xlabelsGroup.selectAll("text")
.on("click", function() {

// get value of selection
var value = d3.select(this).attr("value");
console.log ("X Chosen Value",value )



    
  if (value == "homx") {
   
    //Initially set the lines to not show	
    d3.selectAll(".line").style("opacity","0"); 
    d3.selectAll(".line01").style("opacity","1"); 
  
  // Give these new data to update line
 l1
      .transition()
      .duration(500)
      .attr("d", line1) 

      var opt ="1"

  //    circle_toolt(chartGroup, value,covdata,xTimeScale,yLinearScale,opt )
      

    } else if (value == "mujx") {

      
    //Initially set the lines to not show	
    d3.selectAll(".line").style("opacity","0"); 
    d3.selectAll(".line02").style("opacity","1"); 
  
  // Give these new data to update line
  l1
      .transition()
      .duration(500)
      .attr("d", line2)
      var opt ="2"


    }else if (value == "tot") {

      console.log ("Hombre",value )
   //Initially set the lines to not show	
  //d3.selectAll(".line").style("opacity","0");  
   d3.selectAll("#r1").style("opacity","0");
   d3.selectAll("#r2").style("opacity","0");
   d3.selectAll(".line02").style("opacity","0");
   d3.selectAll(".line03").style("opacity","1"); 
   var opt ="3"

 
 // Give these new data to update line
 l1
     .transition()
     .duration(500)
     .attr("d", line3)

   } 
   
 
   else if (value == "ini") { 
    console.log ("other",value )
    
    l1
      .transition()
      .duration(500)
      .attr("d", line1);

      d3.selectAll(".line").style("opacity","1"); 

    
    } // choosing options

    







// tool tips


if (opt=="1") {

var chosenYAxis="CASOSHOMBRES"
console.log("Hombres enra")
// append circles

var circlesGroup = chartGroup.selectAll("circle")
.data(covdata)
.enter()
.append("circle")
.attr("cx", d => xTimeScale(d.FECHAINGRESO))
.attr("cy",d =>yLinearScale(d[chosenYAxis]))

.attr("r", "5")
.attr("fill", "gold")
.attr("stroke-width", "1")
.attr("stroke", "black");


console.log("Hombres sale")

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
    toolTip.html( `<strong>Fech: ${dateFormatter(d.FECHAINGRESO)}` + `<hr> Pacientes: ${d.CASOSHOMBRES}`)
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



} else if (opt=="2") {
 
  console.log("d.CASOSMUJERES")
  var chosenYAxis ="CASOSMUJERES"


var circlesGroup = chartGroup.selectAll("circle")
.data(covdata)
.enter()
.append("circle")
.attr("cx", d => xTimeScale(d.FECHAINGRESO))
.attr("cy",d => yLinearScale(d.CASOSMUJERES))

.attr("r", "4")
.attr("fill", "gold")
.attr("stroke-width", "1")
.attr("stroke", "black");

/*
var chosenYAxis="CASOSTOTALES"
circlesGroup.transition()
.duration(1000)
//.attr("cx", d => xTimeScale(d.FECHAINGRESO))
.attr("cy",d =>yLinearScale(d[chosenYAxis]))
console.log (" cy paint")

*/


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
    toolTip.html( `<strong>Fech: ${dateFormatter(d.FECHAINGRESO)}` + `<hr> Pacientes: ${d.CASOSMUJERES}`)
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






}else if (opt=="3") {

  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(covdata)
  .enter()
  .append("circle")
  .attr("cx", d => xTimeScale(d.FECHAINGRESO))
  .attr("cy",d => yLinearScale(d.CASOSTOTALES))

  .attr("r", "4")
  .attr("fill", "gold")
  .attr("stroke-width", "1")
  .attr("stroke", "black");



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
    toolTip.html( `<strong>Fech: ${dateFormatter(d.FECHAINGRESO)}` + `<hr> Pacientes: ${d.CASOSTOTALES}`)
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

  } //opt 3


}); 


}).catch(function(error) {  console.log(error);});  //end import csv


} // end init




 initt()

  




