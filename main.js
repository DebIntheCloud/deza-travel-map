// Initialize the map
var map = L.map('mapid').setView([42.5699, -8.1529], 13);  // Deza County coordinates

// Add tile layer (the actual map tiles)
// Reemplaza 'YOUR_API_KEY' con tu API Key de Mapbox
// L.tileLayer('https://api.mapbox.com/styles/v1/debinthecloud/cm8nnfmgy001m01snd2n13rzw/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGViaW50aGVjbG91ZCIsImEiOiJjbThubXo3OHMwMmhjMnFwenZhZjBjeGJjIn0.ChufihB7e2hnT9dB1nn1cQ', {
//     //attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
// }).addTo(map);


// Add a marker (shows deza boundaries)
var marker = L.marker([42.5699, -8.1529]).addTo(map);

// Add a popup to the marker
marker.bindPopup("<b>Deza County</b><br>Welcome to Deza County!").openPopup();

// Load and display the GeoJSON file
fetch('Deza.geojson')  // Make sure Deza.geojson is in the same folder.
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                color: "white",  // You can customize the color.
                weight: 2,
                fillColor: "lightgreen",  // Fill color for the areas
                fillOpacity: 0
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>${feature.properties.name || "Unnamed"}</b>`); // Creates a popup showing that name when you click the feature. Gets the name of the feature (if available). unnamed Displays this if there's no name in the data.
            }
        }).addTo(map);
    })
    .catch(error => {
        console.error("Error loading GeoJSON:", error);
        alert("Failed to load map data. Please refresh.");
    });

// PARTIALS LOADING
document.addEventListener("DOMContentLoaded", () => {
    ["header", "footer"].forEach(partial => {
        fetch(`/partials/${partial}.html`)
            .then(response => response.text())
            .then(data => document.querySelector(partial).innerHTML = data)
            .catch(error => console.error(`Error loading ${partial}:`, error));
    });
});

// SEARCH BAR FUNCTIONALITY

const searchInput = document.getElementById("searchInput"); // Assumes there is an input with id 'search'
 if (searchInput) {
        let timeout;
        searchInput.addEventListener("input", () => { // Runs when the user enters a location.
            clearTimeout(timeout);  // Clear the previous timeout
            timeout = setTimeout(() => { // creates a delay before executing the code inside the function () { ... }.


                const query = searchInput.value;
                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_API_KEY}`) // Mapbox Geocoding API
                    .then(response => response.json())
                    .then(data => {
                        if (data.features.length) { // Alerts the user if no results are found.
                            alert("Location not found");
                            return;
                        }
                        const [lon, lat] = data.features[0].geometry.coordinates;
                        const newMarker = L.marker([lat, lon]).addTo(map);
                        map.setView([lat, lon], 13);
                        newMarker.bindPopup(`<b>${data.features[0].place_name}</b>`).openPopup();
                    })
                    .catch(error => console.error("Error in search:", error));
        }, 500); // Part of the debouce feature, it Waits for 500ms after the user stops typing
    });
} else {
    console.error("Error: searchInput element not foudn in DOM!");
}



//SIDEBAR FILTERING
// Defines an object called categories, which contains multiple key-value pairs.
const categories = {
    art: { title: "Filter by Culture", options: ["Crafts & Design", "Museums", "Cultural Centers"] },
    accommodation: { title: "Filter by Accommodation", options: ["Apartments", "Bed & Breakfast", "Hotels"] },
    transport: { title: "Filter by Transport", options: ["Bus Tours", "Ferries", "Gas Station", "E-Charging"] },
    recreation: { title: "Filter by Recreation", options: ["Bird Watching", "Boat Tours", "City Walk"] },
    dining: { title: "Filter by Dining", options: ["Cafes", "Diners", "Farm-to-Table"] }
};

// This selects all buttons with the class "icon-btn". Loops through each button and assigns a click event listener to it.
document.querySelectorAll(".icon-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        // These lines grab the sidebar elements from the HTML using their ids.
        const category = this.getAttribute("data-category");
        document.getElementById("sidebar-title").textContent = categories[category].title;
        // Build checkboxes dynamically for each category
        const sidebarContent = document.getElementById("sidebar-content");
        sidebarContent.innerHTML = categories[category].options.map(option => 
            `<li>
                <input type="checkbox" id="${option}" class="filter-checkbox" data-category="${category}" value="${option}" />
                <label for="${option}">${option}</label>
            </li>`
        ).join("");

        document.getElementById("sidebar-title").textContent = categories[category].title;
        document.getElementById("sidebar-content").innerHTML = categories[category].options.map(option => `<li>${option}</li>`).join("");
        document.getElementById("sidebar").classList.add("open");
    });
});

// Handle checkbox filtering
document.getElementById("sidebar-content").addEventListener("change", (e) => {
    if (e.target.classList.contains("filter-checkbox")) {
        const category = e.target.getAttribute("data-category");
        const option = e.target.value;
        
        if (e.target.checked) {
            // Perform the action to show the option on the map (e.g., highlighting or adding markers)
            console.log(`Showing: ${option} in ${category}`);
        } else {
            // Perform the action to remove the option from the map
            console.log(`Hiding: ${option} in ${category}`);
        }
    }
});

// Close sidebar
document.getElementById("close-btn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.remove("open");
});

// Function to filter items based on selected checkboxes
function filterItems() {
    // Get all selected checkboxes
    const selectedFilters = {};
    document.querySelectorAll('#sidebar input[type="checkbox"]:checked').forEach(input => {
        const category = input.name;
        const option = input.value;
        if (!selectedFilters[category]) selectedFilters[category] = [];
        selectedFilters[category].push(option);
    });

    // Here you can implement the logic to filter the map markers based on selectedFilters
    console.log(selectedFilters); // Show selected filters in the console for testing
}

// Event listener to track checkbox changes
document.querySelectorAll('#sidebar input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', filterItems);
});

// Instructions slides with text + image
const slides = [
    { 
        title: "WELCOME TO THE MAP OF DEZA COUNTY",
        text: "Discover the sights, activities, and restaurants that appeal to you and create a personalized route with just a few clicks on our interactive map.", 
        image: "images/map.jpg" 
    },
    { 
        title: "CREATE A ROUTE",
        text: "Add a stop using the input field in the upper left corner. Try adding another stop to create a route. You can always drag and drop stops to customize your route.", 
        image: "images/mapa search.jpg" 
    },
    { 
        title: "HOW TO USE THE FILTERS",
        text: "Click an icon in the upper right corner to choose what looks good. You can always edit them later. The map will show filtered activities within 10 km (6 miles) of your route.", 
        image: "images/mapa filter.jpg" 
    },
    { 
        title: "ADD ACTIVITIES TO YOUR ROUTE",
        text: "If you find something exciting, click and add the activity to your trip. This will update your existing route to include the activity you just added.", 
        image: "images/slide4.jpg" 
    },
    { 
        title: "SHARE AND EDIT WITH OTHERS",
        text: "Click the share itinerary button to create a unique link to share with your travel companions. They can then edit the itinerary and send you an updated one.", 
        image: "images/slide5.jpg" 
    }
];

// Track current step
let currentStep = 0;
const instructionText = document.getElementById('instruction-text');
const instructionImage = document.getElementById('instruction-image');
const instructionTitle = document.getElementById('instruction-title'); // Make sure to add this image in HTML
const infoModal = document.getElementById('info-modal');
const nextBtn = document.getElementById('next-btn');
const exitBtn = document.getElementById('exit-btn');

function showInstruction() {
    instructionText.textContent = slides[currentStep].text;
    instructionImage.src = slides[currentStep].image;
    instructionTitle.textContent = slides[currentStep].title;  // Updates the image for each slide

    nextBtn.style.display = currentStep === slides.length - 1 ? 'none' : 'block';
    exitBtn.style.display = currentStep === slides.length - 1 ? 'block' : 'none';
}

// Open modal
document.getElementById('info-btn').addEventListener('click', () => {
    infoModal.style.display = 'flex';
    showInstruction();
});

// Next button - go to the next slide
if (nextBtn) nextBtn.addEventListener('click', () => {
    if (currentStep < slides.length - 1) {
        currentStep++;
        showInstruction();
    }
});

// Exit button - close modal and reset
if (exitBtn) exitBtn.addEventListener('click', () => {
    infoModal.style.display = 'none';
    currentStep = 0;
    showInstruction();
});

// Example marker data with category tags
const markers = [
    { id: 1, title: "Museum A", category: "art", subcategory: "Museums", lat: 42.0, lng: -8.0 },
    { id: 2, title: "Hotel B", category: "accommodation", subcategory: "Hotels", lat: 42.1, lng: -8.1 },
    { id: 3, title: "Cafe C", category: "dining", subcategory: "Cafes", lat: 42.2, lng: -8.2 },
    // Add more markers here
];

// Function to filter the markers based on selected filters
function filterMarkers() {
    const selectedFilters = {};
    document.querySelectorAll('#sidebar input[type="checkbox"]:checked').forEach(input => {
        const category = input.name;
        const option = input.value;
        if (!selectedFilters[category]) selectedFilters[category] = [];
        selectedFilters[category].push(option);
    });

    // Filter the markers based on the selected filters
    const filteredMarkers = markers.filter(marker => {
        const selectedSubcategories = selectedFilters[marker.category];
        return selectedSubcategories && selectedSubcategories.includes(marker.subcategory);
    });

    // Now display the filtered markers on the map (you'll need to handle this part)
    console.log(filteredMarkers); // Display the filtered markers
}

// Example using Leaflet (assuming you're using it for the map)
function displayMarkers(filteredMarkers) {
    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add the filtered markers to the map
    filteredMarkers.forEach(marker => {
        L.marker([marker.lat, marker.lng]).addTo(map)
            .bindPopup(marker.title);
    });
}

function filterItems() {
    // Get all selected checkboxes
    const selectedFilters = {};
    document.querySelectorAll('#sidebar input[type="checkbox"]:checked').forEach(input => {
        const category = input.name;
        const option = input.value;
        if (!selectedFilters[category]) selectedFilters[category] = [];
        selectedFilters[category].push(option);
    });

    // Filter markers based on selected filters
    const filteredMarkers = markers.filter(marker => {
        const selectedSubcategories = selectedFilters[marker.category];
        return selectedSubcategories && selectedSubcategories.includes(marker.subcategory);
    });

    // Display filtered markers
    displayMarkers(filteredMarkers);
}



