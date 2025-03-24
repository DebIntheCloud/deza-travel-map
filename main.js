// Initialize the map
var map = L.map('mapid').setView([42.5699, -8.1529], 13);  // Deza County coordinates

// Add tile layer (the actual map tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker
var marker = L.marker([42.5699, -8.1529]).addTo(map);

// Add a popup to the marker
marker.bindPopup("<b>Deza County</b><br>Welcome to Deza County!").openPopup();
