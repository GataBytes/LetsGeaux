import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import { TextField, Button, Box, Typography } from '@mui/material'; // MUI imports

// Container style for the map
const containerStyle = {
  width: "100%",
  height: "500px",
};

// Default map center (New Orleans)
const center = {
  lat: 29.9511,  // New Orleans latitude
  lng: -90.0715, // New Orleans longitude
};

const libraries: any = ['geometry', 'marker']; 

const Maps = () => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);  // State to hold the travel time

  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const originMarker = useRef<google.maps.Marker | null>(null);  
  const destinationMarker = useRef<google.maps.Marker | null>(null);  
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Function to fetch directions and calculate the travel time
  const fetchDirections = async () => {
    if (!origin || !destination) {
      setError("Both origin and destination are required!");
      return;
    }

    try {
      const response = await axios.get("/api/maps/directions", {
        params: { origin, destination },
      });

      const { polyline } = response.data;

      if (polyline) {
        const path = google.maps.geometry.encoding.decodePath(polyline);

        // Create a Polyline object
        if (polylineRef.current) {
          polylineRef.current.setPath(path);
        } else {
          polylineRef.current = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          polylineRef.current.setMap(mapRef.current);
        }

        // Show the route using DirectionsRenderer
        const directionsRequest = {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        };

        if (directionsService.current && directionsRenderer.current) {
          directionsService.current.route(directionsRequest, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.current.setDirections(result);
              setError(null);

              // Extract travel time from directions result
              const time = result.routes[0].legs[0].duration.text;
              setTravelTime(time); // Update the state with the travel time

              const originLatLng = result.routes[0].legs[0].start_location;
              const destinationLatLng = result.routes[0].legs[0].end_location;
              placeMarkers(originLatLng, destinationLatLng);
            } else {
              setError("No route found.");
            }
          });
        }
      }
    } catch (error) {
      setError("Error fetching directions. Please try again later.");
    }
  };

  // Handle map load and initialize DirectionsService and DirectionsRenderer
  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    directionsService.current = new google.maps.DirectionsService();
    directionsRenderer.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
    });
  };

  const saveTravel = async (origin: string, destination: string, travelTime: string) => {
    try {
      const response = await axios.post('/api/maps', {
        origin,
        destination,
        travelTime,
      });
  
      if (response.status === 201) {
        console.log('Data saved successfully!');
      } 
    } catch (error) {
      console.error('Error saving travel data:', error);
    }
  };

  useEffect(() => {
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(mapRef.current);
    }

    return () => {
      // Clean up markers and polyline on component unmount
      if (originMarker.current) originMarker.current.setMap(null);
      if (destinationMarker.current) destinationMarker.current.setMap(null);
      if (polylineRef.current) polylineRef.current.setMap(null);
    };
  }, []);

  // Place the markers for origin and destination
  const placeMarkers = (originLatLng: google.maps.LatLng, destinationLatLng: google.maps.LatLng) => {
    if (mapRef.current) {
      // Remove previous markers if any
      if (originMarker.current) originMarker.current.setMap(null);
      if (destinationMarker.current) destinationMarker.current.setMap(null);

      // Create new markers using the standard Marker API for origin
      originMarker.current = new google.maps.Marker({
        position: originLatLng,
        map: mapRef.current,
        title: "Origin",
      });

      // Create new markers using the standard Marker API for destination
      destinationMarker.current = new google.maps.Marker({
        position: destinationLatLng,
        map: mapRef.current,
        title: "Destination",
      });
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Google Maps Directions
      </Typography>

      {/* Input Fields */}
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <TextField
          label="Enter origin"
          variant="outlined"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <TextField
          label="Enter destination"
          variant="outlined"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={fetchDirections}
        >
          View Route
        </Button>
      </Box>

      {/* Error Message */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Display the travel time */}
      {travelTime && <Typography variant="h6">Estimated Driving: {travelTime}</Typography>}

      <Box mt={2}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => saveTravel(origin, destination, travelTime || "")}
        >
          Save Travel Time
        </Button>
      </Box>

      {/* Google Map */}
      <LoadScript
        googleMapsApiKey={'AIzaSyDbe88-k6VGoCVYDfdhGS4Zi2w7YwXiCGA'}
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
        >
          {/* The markers will be placed automatically after directions are fetched */}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Maps;