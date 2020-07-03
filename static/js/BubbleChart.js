//////////////// CALLLING THE DATA ///////////

// Define variables to store data and avoid multiple calls
var enfermedades = []
var edades = []
var generos = []

 //Call our datasets

function ages (){
        d3.json("/diseases_age").then(function(age){
                edades = age;
                ResponsiveBarChart(edades);
        });
};
ages();

function genders (){
        d3.json("/diseases_gender").then(function(gender){
                generos = gender;
                ResponsiveDonutChart(generos)
                });
};
genders();

function enfermedad() { 
        d3.json("/diseases_count").then(function(diseases){
                //Process the Data Again
                var filtro = {
                        condicion : diseases.filter((d) => d.DATO == "TODOS")
                                                .filter((d)=> d.GENERO == "TODOS")
                                                .filter((d)=> d.CONDICION !== "TODOS")
                                                .map((d) => d.CONDICION),
                        casos: diseases.filter((d) => d.DATO == "TODOS")
                                                .filter((d)=> d.GENERO == "TODOS")
                                                .filter((d)=> d.CONDICION !== "TODOS")
                                                .map((d) => d.TOTAL),
                        muertos: diseases.filter((d) => d.DATO == "DIFUNTOS")
                                                .filter((d)=> d.GENERO == "TODOS")
                                                .filter((d)=> d.CONDICION !== "TODOS")
                                                .map((d) => d.TOTAL),
                        intubados: diseases.filter((d) => d.DATO == "INTUBADOS")
                                                .filter((d)=> d.GENERO == "TODOS")
                                                .filter((d)=> d.CONDICION !== "TODOS")
                                                .map((d) => d.TOTAL)
                        };

                //Transform the filter into another table

                for (var i = 0; i < filtro.condicion.length; i++) {
                        var objeto = {
                                condicion: filtro.condicion[i],
                                casos: filtro.casos[i],
                                intubados: filtro.intubados[i],
                                difuntos: filtro.muertos[i],
                                colors: '#' + parseInt(Math.random() * 0xffffff).toString(16)           
                        }
                enfermedades.push(objeto)
                }
        
                ResponsiveBubbleChart(enfermedades)
        });  
        
 };
enfermedad();

var choosendataset = "TODOS"

//////////////// BUBBLE CHART /////////////////////
function ResponsiveBubbleChart(enfermedades) {

        //Make sure the svg is empty
        var svgArea = d3.select("#Bubblechart").select("svg");
                if (!svgArea.empty()) {
                svgArea.remove();
                }

        //Define margins and sizes
        var chartMargin = {
                top: 50,
                right: 70,
                bottom: 70,
                left: 70
                };

        
        var svgWidth = parseInt(d3.select('#Bubblechart').style('width'), 10)
        var svgHeight = 600


        var chartWidth = svgWidth - chartMargin.left - chartMargin.right
        var chartHeigth = svgHeight - chartMargin.top - chartMargin.bottom


        //Create our SVG

        var svg = d3.select("#Bubblechart")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)

        //group our chart to the right
        var chartGroup = svg.append("g")
                .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`)

        

        //Create our scales
        var scaleX = d3.scaleLinear()
                .domain([0, d3.max(enfermedades.map(d => d.casos))])
                .range([0, chartWidth]);


        var scaleY = d3.scaleLinear()
                .domain([0,d3.max(enfermedades.map(d => d.intubados)) + 1000])
                .range([chartHeigth, 0]);

                //Note: is a bad idea to use scale linear in a radius, it missrepresents data
        var Circlemaxrange = chartWidth / 15
        var scaleCircle = d3.scalePow()
                        .exponent(0.5)
                        .domain([0, d3.max(enfermedades.map(d => d.difuntos))])
                        .range([0,Circlemaxrange]);



        //Create our axes

        var yAxis = d3.axisLeft(scaleY);
        var xAxis = d3.axisBottom(scaleX);

        chartGroup.append("g")
                .attr("transform", `translate(0,${chartHeigth})`)
                .call(xAxis);
        chartGroup.append("g")
                .call(yAxis);

                

        //Now lets get start with tooltips
        //Create the tooltip
        var toolTip = d3.select("#Bubblechart")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip");

        //Create functions to show, hide and move the tooltip        
        var showTooltip = function(d) {
                toolTip
                        .transition()
                        .duration(200)
                toolTip
                        .style("opacity", 1)
                        .html(`Condicion: ${d.condicion} <br> Defunciones: ${d.difuntos}`)
                        .style("left", (d3.mouse(this)[0]+30) + "px")
                        .style("top", (d3.mouse(this)[1]+30) + "px")
        }
        var moveTooltip = function(d)  {
                toolTip
                        .style("left", (d3.mouse(this)[0]+30) + "px")
                        .style("top", (d3.mouse(this)[1]+30) + "px")

        }

        var hideTooltip = function(d){
                toolTip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)

        }

        var selectbubble = function(d){
                d3.selectAll(".bubbles")
                        .style("opacity", 0.5)
                        .attr("stroke-width", 0);
                
                var bubbletext = d3.select(".bubble-text");
                        if (!bubbletext.empty()) {
                        bubbletext.remove();
                        }

                d3.select(this)
                        .style("opacity", 1)
                        .attr("stroke", "black") 
                        .attr("stroke-width", 3);  
        
                
                chartGroup.append("text")
                        .attr("transform", `translate(${chartWidth/4}, ${chartHeigth + chartMargin.top - 50})`)
                        .attr("stroke", "black")
                        .attr("opacity", 0.5)
                        .attr("font-family", "Georgia")
                        .attr("font-size", chartHeigth/8)
                        .classed("bubble-text", true)
                        .text(`${d.condicion}`)

                choosendataset = d.condicion
                choosendataset = choosendataset.replace(/\s/g, "_")
                ResponsiveDonutChart(generos);
                ResponsiveBarChart(edades);


        }
                

        //Append circles with its tooltips
        chartGroup.selectAll("circle")
        .data(enfermedades)
        .enter()
        .append("circle")
        .classed("bubbles", true)
        .attr("cx", (d) => scaleX(d.casos))
        .attr("cy", (d) => scaleY(d.intubados))
        .attr("r", (d) => scaleCircle(d.difuntos))
        .attr("fill", (d)=> d.colors)
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .on("click", selectbubble);

        //Create and append x label
        chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2}, ${chartHeigth + chartMargin.top})`)
        .attr("stroke", "black")
        .text("Casos totales presentados")

        // append y label
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeigth /1.5))
        .attr("stroke", "black")
        .attr("dy", "1em")
        .classed("bubble-Y-label", true)
        .text(" Intubaciones totales");

}

//////////////// BAR CHART /////////
function ResponsiveBarChart(edades) {

        //Make sure the svg is empty
        var svgArea = d3.select("#Bubble-BarChart").select("svg");
                if (!svgArea.empty()) {
                svgArea.remove();
                }

        //Define margins and sizes
        var chartMargin = {
                top: 10,
                right: 10,
                bottom: 50,
                left: 60
                };


        var svgWidth = parseInt(d3.select('#Bubble-BarChart').style('width'), 10)
        var svgHeight = 280

 
        var chartWidth = svgWidth - chartMargin.left - chartMargin.right
        var chartHeigth = svgHeight - chartMargin.top - chartMargin.bottom


        //Create our SVG
        var svg = d3.select("#Bubble-BarChart")
                .append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth)

        //group our chart to the right
        var chartGroup = svg.append("g")
                .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`)

        //Create our scales
        var scaleX = d3.scaleBand()
                .domain(edades.map(d => d.RANGO_DE_EDAD))
                .range([0, chartWidth])
                .padding(0.2);

        var scaleY = d3.scaleLinear()
                .domain([0,d3.max(edades.map(d => d[choosendataset]))])
                .range([chartHeigth, 0]);

        //Create our axes
        var yAxis = d3.axisLeft(scaleY);
        var xAxis = d3.axisBottom(scaleX);

        chartGroup.append("g")
                .attr("transform", `translate(0,${chartHeigth})`)
                .call(xAxis);
        chartGroup.append("g")
                .call(yAxis);

        //Now lets get started with tooltips
        //Create the tooltip
        var toolTip = d3.select("#Bubble-BarChart")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip");

        //Create functions to show, hide and move the tooltip        
        var showTooltip = function(d) {
                toolTip
                        .transition()
                        .duration(200)
                      
                toolTip
                        .style("opacity", 1)
                        .html(`${d[choosendataset]} casos`)
                        .style("left", (d3.mouse(this)[0]+30) + "px")
                        .style("top", (d3.mouse(this)[1]+30) + "px")

        }
        var moveTooltip = function(d)  {
                toolTip
                        .style("left", (d3.mouse(this)[0]+30) + "px")
                        .style("top", (d3.mouse(this)[1]+30) + "px")

        }
        
        var hideTooltip = function(d){
                toolTip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)
        }
 
        //Append circles with is tooltips
        chartGroup.selectAll("bar")
                .data(edades)
                .enter()
                .append("rect")
                .classed("bubble_bar", true)
                .attr("x", (d) => scaleX(d.RANGO_DE_EDAD))
                .attr("y", (d) => scaleY(d[choosendataset]))
                .attr("width", scaleX.bandwidth())
                .attr("height", (d) => chartHeigth - scaleY(d[choosendataset]))
                .attr("fill", "#00BFFF")
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip);
        
        //Create and append x label
        chartGroup.append("text")
                .attr("transform", `translate(${chartWidth/4}, ${chartHeigth + chartMargin.top +30})`)
                .text("Rango de edades")

        // append y label
        chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - chartMargin.left)
                .attr("x", 0 - (chartHeigth - 50))
                .attr("dy", "1em")
                .classed("bubble-Y-label", true)
                .text("Casos");        
        };


 ///////////// DONU CHART /////////////
function ResponsiveDonutChart(generos){
        //Make sure the svg is empty
        var svgArea = d3.select("#Bubble-DonutChart").select("svg");
                        if (!svgArea.empty()) {
                        svgArea.remove();
                        }

        //Define margins and sizes
        var chartMargin = {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
                };


        var svgWidth = parseInt(d3.select('#Bubble-DonutChart').style('width'), 10)
        var svgHeight = 280


        var chartWidth = svgWidth - chartMargin.left - chartMargin.right
        var chartHeigth = svgHeight - chartMargin.top - chartMargin.bottom

        
        var radius = Math.min(chartWidth, chartHeigth) / 2 - chartMargin.left - chartMargin.right
        var innerRadius = Math.min(chartWidth, chartHeigth) / 5
        //Create our SVG

        var svg = d3.select("#Bubble-DonutChart")
                .append("svg")
                .attr("height", svgHeight)
                .attr("width", svgWidth)

        //group our chart to the right
        var chartGroup = svg.append("g")
                .attr("transform", `translate(${chartWidth/2}, ${chartHeigth/2})`)

        
        var data = { 
                mujeres: generos.filter((d) => d.CONDICION == choosendataset)
                                .map( (d) => d.MUJER),
                hombres: generos.filter((d) => d.CONDICION == choosendataset)
                                .map((d) => d.HOMBRE)
                };


        //Create our scales
        var color = d3.scaleOrdinal()
                .domain(data)
                .range(["#FF69B4", "#1E90FF"])


        var pie = d3.pie()
                .value(d => d.value)
        
        var data_ready = pie(d3.entries(data))

        //Append circles with its tooltips
        chartGroup.selectAll("donut")
                .data(data_ready)
                .enter()
                .append("path")
                .classed("bubble_donut", true)
                .attr("d", d3.arc()
                        .innerRadius(innerRadius)
                        .outerRadius(radius))
                .attr("fill", (d) => color(d.data.key))
                .attr("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
        
    
        chartGroup.append("text")
                .attr("transform", `translate(${chartWidth/4}, ${chartHeigth/4})`)
                .text("Mujeres")

        chartGroup.append("text")
                .attr("transform", `translate(${- chartWidth/4 -60}, ${ - chartHeigth/4})`)
                .text("Hombres")
        

              

};  
        
//// RESIZE RUN       
d3.select(window).on("resize", function(){
        ResponsiveBubbleChart(enfermedades);
        ResponsiveDonutChart(generos);
        ResponsiveBarChart(edades);
        });


