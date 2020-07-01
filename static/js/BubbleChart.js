
var chartMargin = {
    top: 10,
    right: 10,
    bottom: 50,
    left: 50
};

var svgWidth = window.innerWidth; 
var svgHeight = window.innerHeight;


var chartWidth = svgWidth - chartMargin.left - chartMargin.right
var chartHeigth = svgHeight - chartMargin.top - chartMargin.bottom



var svg = d3.select("#Bubblechart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

//group our chart to the right
var chartGroup = svg.append("g")
            .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`)





//Access our DATA

d3.json("/diseases_count").then(function(diseases){
    var enfermedades = {
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

console.log(enfermedades)
console.log(diseases[0].TOTAL)


    



//Create our scales
var scaleX = d3.scaleLinear()
            .domain([0, diseases[0].TOTAL])
            .range([0, chartWidth]);


var scaleY = d3.scaleLinear()
            .domain([0,d3.max(enfermedades.intubados) + 1000])
            .range([chartHeigth, 0]);

        //Note: is a bad idea to use scale linear in a radius, it missrepresents data
var Circlemaxrange = chartWidth / 3
var scaleCircle = d3.scalePow().exponent(0.5)
            .domain([0, d3.max(enfermedades.muertos)])
            .range(0,Circlemaxrange);



enfermedades.intubados.forEach(x => console.log(scaleY(x)));

//Create our axes

var yAxis = d3.axisLeft(scaleY);
var xAxis = d3.axisBottom(scaleX);

chartGroup.append("g")
        .attr("transform", `translate(0,${chartHeigth})`)
        .call(xAxis);
chartGroup.append("g")
        .call(yAxis);

//Append circles
chartGroup.append("g")
        .selectAll("circle")
        .data(enfermedades)
        .enter()
        .append("circle")
        .attr("cx", (d) => scaleX(d.casos))
        .attr("cy", (d) => scaleY(d.intubados))
        .attr("r", (d) => scaleCircle(d.muertos))
        .attr("fill", "purple")



});

