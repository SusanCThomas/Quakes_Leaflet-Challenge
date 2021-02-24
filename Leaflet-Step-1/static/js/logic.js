// Level 1: Basic Visualization
// 1. **Get your data set**
// The USGS provides earthquake data in a number of different formats, updated every 5 minutes. 
// Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and pick a data set to visualize. 
// When you click on a data set, for example 'All Earthquakes from the Past 7 Days', 
// you will be given a JSON representation of that data. You will be using the URL of this JSON to pull in the data for our visualization.

// 2. **Import & Visualize the Data**
// Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes should appear larger and darker in color.
// Include popups that provide additional information about the earthquake when a marker is clicked.
// Create a legend that will provide context for your map data.
// Your visualization should look something like the map above.

// Creat map Object
var myMap = L.map("map", {
    center: [42.1888, -120.3458],
    zoom: 3,
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    // id: "mapbox/streets-v11",
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);