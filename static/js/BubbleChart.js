function makeResponsive() {

        //Make sure the svg is empty
        var svgArea = d3.select("#Bubblechart").select("svg");
                if (!svgArea.empty()) {
                svgArea.remove();
                }

        //Define margins and sizes
        var chartMargin = {
        top: 10,
        right: 10,
        bottom: 50,
        left: 50
        };

        
        var svgWidth = window.innerWidth
        var svgHeight = window.innerHeight


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


        //Access our DATA
        d3.json("/diseases_count").then(function(diseases){
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


                var enfermedades = []
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

                console.log(enfermedades)
                var muertos = enfermedades.map(d => d.difuntos)
                console.log(muertos)


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


                //Test our scales
                console.log(scaleX(100))
                console.log(scaleY(100))
                console.log(scaleCircle(100))


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
                console.log("hola")
                var hideTooltip = function(d){
                        toolTip
                                .transition()
                                .duration(200)
                                .style("opacity", 0)
                }
                

               //Append circles with is tooltips
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
               .on("mouseleave", hideTooltip);

                
                
        });


};

makeResponsive();

d3.select(window).on("resize", makeResponsive);


