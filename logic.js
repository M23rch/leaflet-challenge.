// We create the tile layer that will be the background of our map.
// console.log("Step 1 working");

// Create the map
let map = L.map('map').setView([37.7749, -122.4194], 5); // Center on the US

// Add TileLayer (base map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// GeoJSON Data URL for earthquake data
let earthquakeDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Function to determine marker size based on magnitude
function getRadius(magnitude) {
  return magnitude ? magnitude * 4 : 1; // Scale factor
}

// Function to determine marker color based on depth
function getColor(depth) {
  return depth > 90 ? '#ff3333' :
         depth > 70 ? '#ff9933' :
         depth > 50 ? '#ffff33' :
         depth > 30 ? '#99ff33' :
                      '#33ff33';
}

// Fetch GeoJSON earthquake data using D3
d3.json(earthquakeDataUrl).then(data => {
  // Add GeoJSON layer
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      let magnitude = feature.properties.mag;
      let depth = feature.geometry.coordinates[2];

      return L.circleMarker(latlng, {
        radius: getRadius(magnitude),
        fillColor: getColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      let { mag, place } = feature.properties;
      let depth = feature.geometry.coordinates[2];

      layer.bindPopup(`
        <h3>${place}</h3>
        <p><strong>Magnitude:</strong> ${mag}</p>
        <p><strong>Depth:</strong> ${depth} km</p>
      `);
    }
  }).addTo(map);

  // Add a legend
  let legend = L.control({ 
    position: "bottomright" 
  });

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'legend');

    let grades = [-10, 30, 50, 70, 90];
    let colors = [
      "#33ff33", 
      "#99ff33", 
      "#ffff33", 
      "#ff9933", 
      "#ff3333"
    ];

    div.innerHTML = "<h4>Depth (km)</h4>";
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " 
          + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(map);
}).catch(error => console.error("Error loading GeoJSON data:", error));







