import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import axios from "axios";
import { TextField, Button, Box, Typography, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import MapsModal from './MapsModal';
import { useItinerary } from "./ItineraryContext";

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
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Array<any>>([]); // Change to any for better handling of data
  const [openModal, setOpenModal] = useState<boolean>(false); // State to 
  const [routeInfo, setRouteinfo] = useState<number>(0)

  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const originMarker = useRef<google.maps.Marker | null>(null);
  const destinationMarker = useRef<google.maps.Marker | null>(null);
  const navigate = useNavigate();

  //const polylineRef = useRef<google.maps.Polyline | null>(null);
  const { itineraryId } = useItinerary();
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get('/api/itinerary');
        setItinerary(response.data); // Populate itinerary state
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };

    fetchItinerary();
  }, []);


  // const handleSelectItinerary = (itineraryId: number, routeInfo: number) => {
  //   console.log('handleSelectItinerary called with:', itineraryId, routeInfo); // Check if this is being logged

  //   axios.patch(`/api/maps/${routeInfo}`, { itineraryId })
  //     .then((response: any) => {
  //       console.log('Response from PATCH request:', response); // Check if this logs the response

  //       if (response.status === 200) {
  //         console.log('Itinerary added successfully:', response);
  //         navigate('/routechoices', { state: { itineraryId } });
  //         //setOpenModal(false);
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.error('Error during PATCH request:', error); // Catch and log errors
  //     });
  // };

  // Function to fetch directions and calculate the travel time
  const fetchDirections = async () => {
    if (!origin || !destination) {
      setError("Both origin and destination are required!");
      return;
    }

    try {
      const directionsRequest = {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      };

      if (directionsService.current && directionsRenderer.current) {
        directionsService.current.route(directionsRequest, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            directionsRenderer.current!.setDirections(result);
            setError(null);

            const leg = result.routes[0].legs[0];
            setTravelTime(leg.duration.text);
            placeMarkers(leg.start_location, leg.end_location);
          } else {
            setError("No route found.");
          }
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
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
        itineraryId,
      });
      setRouteinfo(response.data.routeInfo.id);

      if (response.status === 201) {
        console.log('Data saved successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error saving travel data:', error);
    }
    return false;
  };

  useEffect(() => {
    if (directionsRenderer.current) {
      directionsRenderer.current.setMap(mapRef.current);
    }

    return () => {
      // Clean up on unmount
      if (originMarker.current) originMarker.current.setMap(null);
      if (destinationMarker.current) destinationMarker.current.setMap(null);
      if (directionsRenderer.current) directionsRenderer.current.setMap(null);
      // If you're using a custom polyline, clean it too:
      // if (polylineRef.current) polylineRef.current.setMap(null);
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
  useEffect(() => {
    setOpenModal(true);
  }, []);
  return (
    <div>
      <MapsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSelect={(start, end) => {
          setOrigin(start);
          setDestination(end);
        }}
      />
      <Typography variant="h2" gutterBottom align='center'>
        Directions
      </Typography>

      {/* Input Fields */}
      <Box display="flex" flexDirection="column" gap={2} mb={2}>
        <TextField
          label="Enter the start address or attraction"
          variant="outlined"
          value={origin}

          onChange={(e) => setOrigin(e.target.value)}
          InputLabelProps={{
            sx: {
              top: -12,
              '&.Mui-focused': {
                color: 'black',
              },
            }
          }}
        />
        <TextField
          label="Enter destination address or attraction"
          variant="outlined"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          InputLabelProps={{
            sx: {
              top: -12,
              '&.Mui-focused': {
                color: 'black',
              },
            }
          }}
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
          variant="contained"
          color="secondary"
          onClick={async () => {
            const success = await saveTravel(origin, destination, travelTime || "");
            if (success) {
              navigate('/itinerary');
            }
          }}
        >
          Save Travel Time
        </Button>
      </Box>

      {/* Google Map */}
      <LoadScript
        googleMapsApiKey={"API KEY "}
        libraries={libraries}
      >
        <Box
          sx={{
            border: '4px solid black',
            borderRadius: 2,
            overflow: 'hidden',
            mt: 4,
          }}
        >


          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={onLoad}
          >
            {/* The markers will be placed automatically after directions are fetched */}
          </GoogleMap>
        </Box>
      </LoadScript>

    </div >
  );
};

export default Maps;

