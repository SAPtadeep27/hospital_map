# Hospital Map

## Overview

Hospital Map is a web application designed to help users locate nearby hospitals on an interactive map. The application uses geolocation services and mapping technologies to provide real-time hospital locations, making it easier for users to find healthcare facilities quickly.

## Features

- **Interactive Map Interface** - Browse a user-friendly map to find hospitals in your area.
- **Geolocation Support** - Automatically detects your location and centers the map accordingly.
- **Hospital Information** - Displays details about each hospital, including name, address, and contact information.
- **Search Functionality** - Users can search for hospitals in specific locations.
- **Responsive Design** - Works on both desktop and mobile devices.

## Technologies Used

### Frontend:
- HTML
- CSS
- JavaScript
- EJS (Embedded JavaScript Templates)

### Backend:
- Node.js
- Express.js

### APIs and Libraries:
- [Leaflet](https://leafletjs.com/) - A lightweight JavaScript library for interactive maps.
- [OpenStreetMap](https://www.openstreetmap.org/) - Provides free geographic data.

## Installation

To run the project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SAPtadeep27/hospital_map.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd hospital_map
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Start the Application:**
   ```bash
   npm start
   ```

   The application will run on `http://localhost:3000` by default.

## Usage

1. **Access the Application:**
   Open your browser and go to `http://localhost:3000` or visit the live version at [Hospital Map](https://hospital-map.onrender.com).

2. **Enable Geolocation:**
   Grant permission for the app to access your location for accurate results.

3. **Explore Hospitals:**
   - Use the interactive map to find hospitals.
   - Click on markers to view hospital details.
   - Search for hospitals by city or address.

## Project Structure

```
hospital_map/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── views/
│   ├── index.ejs
│   └── layout.ejs
├── app.js
├── package.json
└── README.md
```

- **`public/`**: Contains static assets like CSS, JavaScript, and images.
- **`views/`**: Holds EJS templates for rendering HTML pages.
- **`app.js`**: The main server file for handling requests.
- **`package.json`**: Manages dependencies and scripts.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

## Acknowledgments

- [Leaflet](https://leafletjs.com/) for the interactive map library.
- [OpenStreetMap](https://www.openstreetmap.org/) for providing open-source map data.

---

Thank you for using Hospital Map! Feel free to contribute and enhance the project.








 
