const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  
const fetch = require('node-fetch');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: ['https://device-track.onrender.com', 'http://localhost:3000'],
     methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://mahadiqbalaiml27:9Gx_qVZ-tpEaHUu@healthcaresystem.ilezc.mongodb.net/healthcaresystem?retryWrites=true&w=majority&appName=Healthcaresystem')
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));


// Define Schema and Model
const hospitalSchema = new mongoose.Schema({}, { strict: false });
const Hospital = mongoose.model('Hospital', hospitalSchema, 'hospitals');

// Geocode function

// Function to get latitude and longitude using Google Maps API
async function geocodeAddress(address) {
    try {
        const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { latitude: location.lat, longitude: location.lng };
        } else {
            console.warn(`Geocoding failed for address: ${address}`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        return null;
    }
}

// Fetch hospitals and update missing coordinates
app.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find({});

        const hospitalsWithCoords = await Promise.all(
            hospitals.map(async (hospital) => {
                if (!hospital.latitude || !hospital.longitude) {
                    console.log(`Fetching coordinates for hospital: ${hospital.name}`);
                    const coords = await geocodeAddress(hospital.address);
                    if (coords) {
                        hospital.latitude = coords.latitude;
                        hospital.longitude = coords.longitude;
                        // Save updated coordinates to database
                        await Hospital.updateOne({ _id: hospital._id }, { latitude: coords.latitude, longitude: coords.longitude });
                    }
                }
                return hospital;
            })
        );

        res.json(hospitalsWithCoords);
    } catch (error) {
        console.error('Error in /hospitals endpoint:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});


// Endpoint to fetch hospital data
app.get('/hospitals', async (req, res) => {
    try {
        const hospitals = await Hospital.find({});
        console.log('Fetched hospitals:', hospitals); // Log to debug
        
        const hospitalsWithCoords = await Promise.all(
            hospitals.map(async (hospital) => {
                if (!hospital.latitude || !hospital.longitude) {
                    const coords = await geocodeAddress(hospital.address);
                    if (coords) {
                        hospital.latitude = coords.latitude;
                        hospital.longitude = coords.longitude;
                    }
                }
                return hospital;
            })
        );
        
        res.json(hospitalsWithCoords);
    } catch (error) {
        console.error('Error in /hospitals endpoint:', error); // Log error
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});


// Set up CORS for HTTP routes
app.use(cors({
    origin: ['https://hospital-map.onrender.com/', 'http://localhost:3000'],
methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Set custom headers for Permissions-Policy
app.use((req, res, next) => {
  res.setHeader("Permissions-Policy", "geolocation=(self ['https://hospital-map.onrender.com/', 'http://localhost:3000'])");
  next();
});

io.on('connection', function (socket) {
  socket.on("send-location", function (data) {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  });
});

// Serve the frontend
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
