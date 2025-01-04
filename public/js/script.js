const socket = io();
let userMarker = null;
let currentRoute = null;
let routingControl = null; // Variable to hold the routing control

// Initialize the map
const map = L.map("map").setView([22.5726, 88.3639], 12); // Default center on Kolkata
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "openstreetmap",
}).addTo(map);

// Marker icon configuration
const redIcon = L.icon({
    iconUrl: "https://img.icons8.com/isometric/50/FA5252/marker.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41],
});

const markers = {};

// Fetch and display hospital data from the backend
async function loadHospitals() {
    try {
        const response = await fetch('http://localhost:3000/hospitals');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const hospitals = await response.json();
        if (!Array.isArray(hospitals)) {
            throw new Error('Invalid response format: Expected an array');
        }

        hospitals.forEach((hospital) => {
            if (hospital.latitude && hospital.longitude) {
                const hospitalMarker = L.marker([hospital.latitude, hospital.longitude], { icon: redIcon })
                    .addTo(map)
                    .bindPopup(`
                        <h3>${hospital.name}</h3>
                        <p>${hospital.address}</p>
                        <p>Phone: ${hospital.phone_number || hospital.phone}</p>
                        <p>Rating: ${hospital.rating}</p>
                    `);

                // Add a click event to show route to hospital
                hospitalMarker.on('click', () => {
                    if (userMarker) {
                        showRoute(userMarker.getLatLng(), hospitalMarker.getLatLng());
                    } else {
                        alert("Please enable location services.");
                    }
                });
            } else {
                console.warn(`Missing coordinates for hospital: ${hospital.name}`);
            }
        });
    } catch (error) {
        console.error('Error loading hospital data:', error);
    }
}

// Get and update user location
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });

            if (!userMarker) {
                userMarker = L.marker([latitude, longitude], { title: "You" }).addTo(map);
                map.setView([latitude, longitude], 14);
            } else {
                userMarker.setLatLng([latitude, longitude]);
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Listen for other users' locations
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

// Load hospital markers
loadHospitals();

// Function to show the route from user's location to a hospital
function showRoute(startLatLng, endLatLng) {
    // Remove any existing route
    if (routingControl) {
        routingControl.remove();
    }

    // Temporarily remove the user marker to prevent excess markers during routing
    if (userMarker) {
        userMarker.remove();
    }

    // Create a new route
    routingControl = L.Routing.control({
        waypoints: [
            startLatLng,
            endLatLng
        ],
        routeWhileDragging: true, // Allows dragging the route
        createMarker: function() { return null; } // Prevent additional markers along the route
    }).addTo(map);

    // Optionally, restore the user marker after the route is displayed
    routingControl.on('routesfound', () => {
        if (userMarker) {
            userMarker.addTo(map); // Re-add user marker after route is shown
        }
    });
}

// Modified section based on your provided logic for routing
if (userMarker) {
    if (currentRoute) {
        map.removeControl(currentRoute); // Remove any existing route before creating a new one
    }

    // Create a new route with the user marker as the start point
    currentRoute = L.Routing.control({
        waypoints: [
            L.latLng(userMarker.getLatLng()), // Starting point from the user marker
            L.latLng(landmark.latitude, landmark.longitude) // The hospital or landmark destination
        ],
        routeWhileDragging: true, // Allows route dragging
        createMarker: function() { return null; } // Disable route markers
    }).addTo(map);
}
