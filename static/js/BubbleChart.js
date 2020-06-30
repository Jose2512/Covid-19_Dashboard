var chartMargin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,

}

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;


var chartWidth = svgWidth - chartMargin.left - chartMargin.right
var chartHeigth = svgHeight - chartMargin.top - chartMargin.bottom


var svg = d3.select("#Bubblechart")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewbox", [0,0, chartWidth, chartHeigth])


var chartGroup = svg.append("g")
            .attr("transform", `translate(${chartMargin.left},${chartMargin.top})`)

