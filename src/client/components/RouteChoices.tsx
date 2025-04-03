import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, List, ListItem, ListItemText, Grid, Button } from '@mui/material';

interface RouteData {
  id: number;
  origin: string;
  destination: string;
  travelTime: string;
}

const RouteChoices = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]); // For storing route data
  const [loadingRoutes, setLoadingRoutes] = useState<boolean>(false); // Loading state for routes
  const [error, setError] = useState<string | null>(null); // To track errors

  // Fetch route data
  const fetchRouteData = async () => {
    setLoadingRoutes(true);
    setError(null);

    try {
      const response = await axios.get('/api/maps');
      setRoutes(response.data);
    } catch (err) {
      setError('Error fetching route data. Please try again later.');
      console.error('Error fetching route data:', err);
    } finally {
      setLoadingRoutes(false);
    }
  };

  // Handle delete route request
  const deleteRoute = async (id: number) => {
    try {
      await axios.delete(`/api/maps/${id}`);
      // Remove the route from the state after successful deletion
      setRoutes(routes.filter(route => route.id !== id));
    } catch (err) {
      setError('Error deleting route. Please try again later.');
      console.error('Error deleting route:', err);
    }
  };

  // Fetch route data when the component is mounted
  useEffect(() => {
    fetchRouteData();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Route Information
      </Typography>

      {/* Error message */}
      {error && (
        <Box mt={2} color="red">
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      {/* Loading Spinner */}
      {loadingRoutes && (
        <Box mt={2} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      <Grid container spacing={3} mt={3}>
        {/* Routes Column */}
        <Grid item xs={12}>
          <Typography variant="h6">Available Routes:</Typography>
          {Array.isArray(routes) && routes.length > 0 && !loadingRoutes && (
            <List>
              {routes.map((route) => (
                <ListItem key={route.id}>
                  <ListItemText
                    primary={`Origin: ${route.origin}`}
                    secondary={`Destination: ${route.destination}, Travel Time: ${route.travelTime}`}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteRoute(route.id)}
                  >
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          )}

          {/* If no routes are found */}
          {Array.isArray(routes) && routes.length === 0 && !loadingRoutes && !error && (
            <Box mt={2}>
              <Typography>No routes found.</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RouteChoices;