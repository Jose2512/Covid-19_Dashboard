var layers = {
    BUENA: new L.LayerGroup(),
    MEDIA: new L.LayerGroup(),
    CRITICA: new L.LayerGroup(),
    };

var myMap = L.map("heatmaphosp", {
    center: [19.4333068, -99.133328],
    zoom: 11,
    layers:[
        layers.BUENA,
        layers.MEDIA,
        layers.CRITICA
    ]
});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);


var overlays = {
    "Capacidad Buena": layers.BUENA,
    "Capacidad Media": layers.MEDIA,
    "Capacidad Crítca": layers.CRITICA
};

L.control.layers(null, overlays).addTo(myMap);

var info = L.control({
   position: "bottomright"
});

info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
};

info.addTo(myMap);

var icons = {
    BUENA: L.ExtraMarkers.icon({
        icon: "ion-plus",
        iconColor: "white",
        markerColor: "green",
        shape: "circle"
    }),
    MEDIA: L.ExtraMarkers.icon({
        icon: "ion-plus",
        iconColor: "white",
        markerColor: "yellow",
        shape: "circle"
    }),
    CRITICA: L.ExtraMarkers.icon({
      icon: "ion-plus",
      iconColor: "white",
      markerColor: "red",
      shape: "circle"
    })
};

d3.csv("./static/data/capacidad_hospitalaria.csv").then(function(data){
    

    var hospitalCount = {
        BUENA: 0,
        MEDIA: 0,
        CRITICA: 0
      };

      var hospitalStatusCode;

      data.forEach(d=>{

        if (d.Estatus_capacidad_hospitalaria == "Buena") {
            hospitalStatusCode = "BUENA";
        }
        // If a station has no bikes available, it's empty
        else if (d.Estatus_capacidad_hospitalaria == "Media") {
            hospitalStatusCode = "MEDIA";
        }
        // If a station is installed but isn't renting, it's out of order
        else if (d.Estatus_capacidad_hospitalaria == "Crítica") {
            hospitalStatusCode = "CRITICA";
        }
        else {
            hospitalStatusCode = "CRITICA";
        }
  
        // Update the station count
        hospitalCount[hospitalStatusCode]++;
        // Create a new marker with the appropriate icon and coordinates
        var newMarker = L.marker([d.Lat, d.Lon], {
          icon: icons[hospitalStatusCode]
        });
  
        // Add the new marker to the appropriate layer
        newMarker.addTo(layers[hospitalStatusCode]);
  
        // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        newMarker.bindPopup(d.Nombre_hospital + "<br> Situacion: " + d.Estatus_capacidad_hospitalaria);
      })



 
  
        


}); 
  
