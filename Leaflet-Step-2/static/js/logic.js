// Level 2: More Data (Optional)

// The USGS wants you to plot a second data set on your map to illustrate the relationship 
// between tectonic plates and seismic activity. 
// You will need to pull in a second data set and visualize it along side your original set of data. 
// Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.
// In this step we are going to..
// * Plot a second data set on our map.
// * Add a number of base maps to choose from as well as separate out our two different data sets into overlays 
// that can be turned on and off independently.
// * Add layer controls to our map.


// Storing the geojson data and the tectonic plates
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicplateData = "";

var tectonicPlates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// Adding tile layers
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

// Creating map Object
var myMap = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 4,
    layers: [satellite, grayscale, outdoors]
});

// Adding satellite tile layer to myMap
satellite.addTo(myMap)

// Adding streetmap tile layer to myMap
grayscale.addTo(myMap)

// Adding outdoors tile layer to myMap
outdoors.addTo(myMap)

// Defining the map object that will hold all three tile layers
var baseMaps = {
    Satellite: satellite,
    Grayscale: grayscale,
    Outdoors: outdoors
};

// Add a number of base maps to choose from as well as separate out our 
// two different data sets into overlays that can be turned on and off independently.

// Defining the overlays object to hold both data sets
var overlays = {
    "Tectonic Plates": tectonicPlates,
    Earthquakes: earthquakes
};

// Adding the control option to the map to allowed user to change between tile layers
L.control.layers(baseMaps, overlays).addTo(myMap);


// Data set 1: Storing the geojson data url for all earthquakes from the past 7 days
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grabbing the geoData with d3
d3.json(geoData).then(function (data) {
    // console.log(geoData);

    // Creating a function to determine the color of the marker based on the magnitude of the earthquake
    function choosemagColor(depth) {
        switch (true) {
            case depth > 5:
                return "rgb(234, 44, 44)";
            case depth > 4:
                return "rgb(234, 130, 44)";
            case depth > 3:
                return "rgb(238, 156, 0)";
            case depth > 2:
                return "rgb(238, 204, 0)";
            case depth > 1:
                return "rgb(212, 238, 0)";
            default:
                return "rgb(152, 238, 0)";
        }
    }

    // Creating a funtion to determine the radius of the marker
    function choosemagRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    // Creating a function to determine the style of the marker using the color & radius functions
    function stylemag(feature) {
        return {
            opacity: 1,
            fillColor: choosemagColor(feature.geometry.coordinates[2]),
            color: "Black",
            radius: choosemagRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5

        };
    }

    // Creating a layer of GeoJSON data to contain the array of the created features
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        // Adding marker style
        style: stylemag,

        // Binding on Popup to display informatiom
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
            );
        }
    }).addTo(earthquakes);

    // Adding the earthquake to myMap
    earthquakes.addTo(myMap);

    // Setting up the legend for the map
    var legend = L.control({
        position: "bottomright"

    });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var magLevels = [0, 1, 2, 3, 4, 5];
        var colors = [
            "rgb(152, 238, 0)",
            "rgb(212, 238, 0)",
            "rgb(238, 204, 0)",
            "rgb(238, 156, 0)",
            "rgb(234, 130, 44)",
            "rgb(234, 44, 44)"
        ];
        // Looping through the functions to generate a label
        for (var i = 0; i < magLevels.length; i++) {
            div.innerHTML += "<i style='background: "
                + colors[i]
                + "'></i> "
                + magLevels[i]
                + (magLevels[i + 1] ? "&ndash;" + magLevels[i + 1] + "<br>" : "+");
        }
        return div;
    };
    // adding legend to the map
    legend.addTo(myMap);

    // Data set 2: Storing the Tectonic plate data 
    var tectonicplateData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


    // Grabbing the tectonicplateData with d3
    d3.json(tectonicplateData, function (dataplate) {

        L.geoJSON(dataplate, {
            color: "orange",
            weight: 2
        }).addTo(tectonicPlates);

        // Adding tectonicplates to the map
        tectonicPlates.addTo(myMap);

    });

});