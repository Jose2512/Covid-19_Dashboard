
// data must be in a format with age, male, and female in each object
var exampleData = d3.json('../assets/data/genero_casos.json').then(function(data){
    pyramidBuilder(data, '#charMW', {height: 400, width: 500});
})

var exampleData = d3.json('../assets/data/genero_difuntos.json').then(function(data){
    pyramidBuilder(data, '#charMW_dec', {height: 400, width: 500});
})  

