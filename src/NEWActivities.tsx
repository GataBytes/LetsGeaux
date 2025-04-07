
// import React, { useState, useEffect } from 'react';
// import { Container, Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
// import axios from 'axios';

// // Define the Activity and Itinerary type interfaces
// interface Activity {
//   id: string;
//   name: string;
//   description: string;
//   time: string;
//   date: string;
//   location: string;
//   image: string;
//   phone: string;
//   address: string;
//   itineraryId?: string;
// }

// interface Itinerary {
//   id: string;
//   name: string;
// }

// const ActivityComponent: React.FC = () => {
//   // State to store activities and itineraries
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [itineraries, setItineraries] = useState<Itinerary[]>([]);

//   // State for the form
//   const [formData, setFormData] = useState({
//     id: '',
//     name: '',
//     description: '',
//     time: '',
//     date: '',
//     location: '',
//     image: '',
//     phone: '',
//     address: '',
//   });

//   const [selectedItinerary, setSelectedItinerary] = useState<string>('');

//   // Get activities and itineraries from the server
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const activitiesResponse = await axios.get('/api/activity');
//         const itinerariesResponse = await axios.get('/api/itinerary');
//         setActivities(activitiesResponse.data);
//         setItineraries(itinerariesResponse.data);
//       } catch (err) {
//         console.error('Error fetching activities or itineraries:', err);
//       }
//     };
//     fetchData();
//   }, []);

//   // Handle form input changes
//   const handleChange = (e: React.ChangeEvent<{ name?: string; value: any }>) => {
//     const { name, value } = e.target;
//     if (name) {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   // POST a new activity
//   const postActivity = async () => {
//     try {
//       const response = await axios.post('/api/activity', formData);
//       setActivities([...activities, response.data]); // Add new activity to the list
//       resetForm(); // Reset form after adding
//     } catch (err) {
//       console.error('Error creating activity:', err);
//     }
//   };

//   // PATCH (update an activity)
//   const updateActivity = async () => {
//     try {
//       const updatedActivity = { ...formData };
//       const response = await axios.patch(`/api/activity/${formData.id}`, updatedActivity);
//       setActivities(activities.map((activity) =>
//         activity.id === formData.id ? response.data : activity
//       ));
//       resetForm(); // Reset form after update
//     } catch (err) {
//       console.error('Error updating activity:', err);
//     }
//   };

//   // DELETE an activity
//   const deleteActivity = async (id: string) => {
//     try {
//       await axios.delete(`/api/activity/${id}`);
//       setActivities(activities.filter((activity) => activity.id !== id));
//     } catch (err) {
//       console.error('Error deleting activity:', err);
//     }
//   };

//   // Assign activity to itinerary
//   const addToItinerary = async (activityId: string) => {
//     if (!selectedItinerary) {
//       alert('Please select an itinerary!');
//       return;
//     }

//     try {
//       const updatedActivity = { itineraryId: selectedItinerary };
//       const response = await axios.patch(`/api/activity/${activityId}`, updatedActivity);
//       setActivities(activities.map((activity) =>
//         activity.id === activityId ? response.data : activity
//       ));
//     } catch (err) {
//       console.error('Error adding activity to itinerary:', err);
//     }
//   };

//   // Reset the form after adding/updating an activity
//   const resetForm = () => {
//     setFormData({
//       id: '',
//       name: '',
//       description: '',
//       time: '',
//       date: '',
//       location: '',
//       image: '',
//       phone: '',
//       address: '',
//     });
//   };

//   // Fill form with activity details for updating
//   const handleUpdateClick = (activity: Activity) => {
//     setFormData({
//       id: activity.id,
//       name: activity.name,
//       description: activity.description,
//       time: activity.time,
//       date: activity.date,
//       location: activity.location,
//       image: activity.image,
//       phone: activity.phone,
//       address: activity.address,
//     });
//   };

//   return (
//     <Container>
//       {/* Form for creating/updating an activity */}
//       <Box mb={4}>
//         <Typography variant="h4" gutterBottom>
//           {formData.id ? 'Update Activity' : 'Create Activity'}
//         </Typography>
//         <form>
//           <TextField
//             label="Activity Name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Time"
//             name="time"
//             value={formData.time}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Date"
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Location"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Image URL"
//             name="image"
//             value={formData.image}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Address"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             fullWidth
//             margin="normal"
//           />
//           <Button
//             onClick={formData.id ? updateActivity : postActivity}
//             variant="contained"
//             color="primary"
//           >
//             {formData.id ? 'Update Activity' : 'Add Activity'}
//           </Button>
//         </form>
//       </Box>

//       {/* Itinerary selection for adding an activity */}
//       <Box mb={4}>
//         <Typography variant="h5" gutterBottom>
//           Select Itinerary to Add Activity
//         </Typography>
//         <Select
//           label="Select Itinerary"
//           value={selectedItinerary}
//           onChange={(e) => setSelectedItinerary(e.target.value as string)}
//           fullWidth
//           margin="normal"
//         >
//           <MenuItem value="">
//             <em>None</em>
//           </MenuItem>
//           {itineraries.map((itinerary) => (
//             <MenuItem key={itinerary.id} value={itinerary.id}>
//               {itinerary.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </Box>

//       {/* Display list of activities */}
//       <Box>
//         <Typography variant="h5" gutterBottom>
//           Activities List
//         </Typography>
//         <ul>
//           {activities.map((activity) => (
//             <Box key={activity.id} mb={2}>
//               <Typography variant="h6">{activity.name}</Typography>
//               <Typography>{activity.description}</Typography>
//               <Typography>{activity.time}</Typography>
//               <Typography>{activity.date}</Typography>
//               <Typography>{activity.location}</Typography>
//               <Typography>{activity.phone}</Typography>
//               <Typography>{activity.address}</Typography>
//               <Button
//                 onClick={() => handleUpdateClick(activity)}
//                 variant="outlined"
//               >
//                 Update
//               </Button>
//               <Button
//                 onClick={() => deleteActivity(activity.id)}
//                 variant="outlined"
//                 color="secondary"
//               >
//                 Delete
//               </Button>
//               <Button
//                 onClick={() => addToItinerary(activity.id)}
//                 variant="outlined"
//                 color="primary"
//               >
//                 Add to Itinerary
//               </Button>
//             </Box>
//           ))}
//         </ul>
//       </Box>
//     </Container>
//   );
// };

// export default ActivityComponent;





// // import React, { useState, useEffect } from 'react';
// // import { Container, Box, TextField, Button, Typography } from '@mui/material';
// // import axios from 'axios';

// // // Define the Activity type interface
// // interface Activity {
// //   id: string;
// //   name: string;
// //   description: string;
// //   time: string;
// //   date: string;
// //   location: string;
// //   image: string;
// //   phone: string;
// //   address: string;
// // }

// // const Activity: React.FC = () => {
// //   // State to store activities
// //   const [activities, setActivities] = useState<Activity[]>([]);

// //   // State for the form
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     description: '',
// //     time: '',
// //     date: '',
// //     location: '',
// //     image: '',
// //     phone: '',
// //     address: '',
// //   });

// //   // Get activities from the server
// //   useEffect(() => {
// //     const getActivities = async () => {
// //       try {
// //         const response = await axios.get('/api/activity');
// //         setActivities(response.data);
// //       } catch (err) {
// //         console.error('Error fetching activities:', err);
// //       }
// //     };
// //     getActivities();
// //   }, []);

// //   // Handle form input changes
// //   const handleChange = (e: React.ChangeEvent<{ name?: string; value: any }>) => {
// //     const { name, value } = e.target;
// //     if (name) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         [name]: value,
// //       }));
// //     }
// //   };

// //   // POST a new activity
// //   const postActivity = async () => {
// //     try {
// //       const response = await axios.post('/api/activity', formData);
// //       setActivities([...activities, response.data]); // Add new activity to the list
// //       resetForm(); // Reset form after adding
// //     } catch (err) {
// //       console.error('Error creating activity:', err);
// //     }
// //   };

// //   // PATCH (update an activity)
// //   const updateActivity = async (id: string) => {
// //     try {
// //       const updatedActivity = { ...formData };
// //       const response = await axios.patch(`/api/activity/${id}`, updatedActivity);
// //       setActivities(activities.map((activity) =>
// //         activity.id === id ? response.data : activity
// //       ));
// //       resetForm(); // Reset form after update
// //     } catch (err) {
// //       console.error('Error updating activity:', err);
// //     }
// //   };

// //   // DELETE an activity
// //   const deleteActivity = async (id: string) => {
// //     try {
// //       await axios.delete(`/api/activity/${id}`);
// //       setActivities(activities.filter((activity) => activity.id !== id));
// //     } catch (err) {
// //       console.error('Error deleting activity:', err);
// //     }
// //   };

// //   // Reset the form after adding/updating an activity
// //   const resetForm = () => {
// //     setFormData({
// //       name: '',
// //       description: '',
// //       time: '',
// //       date: '',
// //       location: '',
// //       image: '',
// //       phone: '',
// //       address: '',
// //     });
// //   };

// //   return (
// //     <Container>
// //       {/* Form for creating/updating an activity */}
// //       <Box mb={4}>
// //         <Typography variant="h4" gutterBottom>
// //           Create or Update an Activity
// //         </Typography>
// //         <form>
// //           <TextField
// //             label="Activity Name"
// //             name="name"
// //             value={formData.name}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Description"
// //             name="description"
// //             value={formData.description}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Time"
// //             name="time"
// //             value={formData.time}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Date"
// //             type="date"
// //             name="date"
// //             value={formData.date}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Location"
// //             name="location"
// //             value={formData.location}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Image URL"
// //             name="image"
// //             value={formData.image}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Phone"
// //             name="phone"
// //             value={formData.phone}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Address"
// //             name="address"
// //             value={formData.address}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <Button onClick={postActivity} variant="contained" color="primary">
// //             Add Activity
// //           </Button>
// //         </form>
// //       </Box>

// //       {/* Display list of activities */}
// //       <Box>
// //         <Typography variant="h5" gutterBottom>
// //           Activities List
// //         </Typography>
// //         <ul>
// //           {activities.map((activity) => (
// //             <Box key={activity.id} mb={2}>
// //               <Typography variant="h6">{activity.name}</Typography>
// //               <Typography>{activity.description}</Typography>
// //               <Typography>{activity.time}</Typography>
// //               <Typography>{activity.date}</Typography>
// //               <Typography>{activity.location}</Typography>
// //               <Typography>{activity.phone}</Typography>
// //               <Typography>{activity.address}</Typography>
// //               <Button
// //                 onClick={() => updateActivity(activity.id)}
// //                 variant="outlined"
// //               >
// //                 Update
// //               </Button>
// //               <Button
// //                 onClick={() => deleteActivity(activity.id)}
// //                 variant="outlined"
// //                 color="secondary"
// //               >
// //                 Delete
// //               </Button>
// //             </Box>
// //           ))}
// //         </ul>
// //       </Box>
// //     </Container>
// //   );
// // };

// // export default Activity;






// // import React, { useState, useEffect } from 'react';
// // import { Container, Box, TextField, Button, Typography, Snackbar, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// // import axios from 'axios';

// // // Define the Activity type interface
// // interface Activity {
// //   id: string;
// //   name: string;
// //   description: string;
// //   time: string;
// //   date: string;
// //   location: string;
// //   image: string;
// //   phone: string;
// //   address: string;
// //   itineraryId: string;
// // }

// // // Define the Itinerary type interface
// // interface Itinerary {
// //   id: string;
// //   name: string;
// // }

// // const Activity: React.FC = () => {
// //   // State to store activities, itineraries, and form data
// //   const [activities, setActivities] = useState<Activity[]>([]);
// //   const [itineraries, setItineraries] = useState<Itinerary[]>([]);
// //   const [formData, setFormData] = useState({
// //     id: '',
// //     name: '',
// //     description: '',
// //     time: '',
// //     date: '',
// //     location: '',
// //     image: '',
// //     phone: '',
// //     address: '',
// //     itineraryId: '', // Initially blank for creating new activity
// //   });
// //   const [error, setError] = useState<string | null>(null); // Error state for Snackbar

// //   // Fetch activities and itineraries on load
// //   useEffect(() => {
// //     const getActivities = async () => {
// //       try {
// //         const activityResponse = await axios.get('/api/activity');
// //         setActivities(activityResponse.data);

// //         const itineraryResponse = await axios.get('/api/itinerary'); // Get itineraries from the backend
// //         setItineraries(itineraryResponse.data);
// //       } catch (err) {
// //         console.error('Error fetching data:', err);
// //       }
// //     };
// //     getActivities();
// //   }, []);

// //   // Handle form input changes
// //   const handleChange = (e: React.ChangeEvent<{ name?: string; value: any }>) => {
// //     const { name, value } = e.target;
// //     if (name) {
// //       setFormData((prev) => ({
// //         ...prev,
// //         [name]: value,
// //       }));
// //     }
// //   };

// //   // Handle form submission for creating or updating
// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault(); // Prevent default form submission
// //     if (formData.id) {
// //       updateActivity();
// //     } else {
// //       postActivity();
// //     }
// //   };

// //   // POST a new activity
// //   const postActivity = async () => {
// //     try {
// //       const response = await axios.post('/api/activity', formData);
// //       setActivities([...activities, response.data]); // Add new activity to the list
// //       resetForm(); // Reset form after adding
// //     } catch (err) {
// //       console.error('Error creating activity:', err);
// //       setError('Error creating activity'); // Set error message
// //     }
// //   };

// //   // PATCH (update an activity)
// //   const updateActivity = async () => {
// //     try {
// //       const updatedActivity = { ...formData };
// //       const response = await axios.patch(`/api/activity/${formData.id}`, updatedActivity);
// //       setActivities(activities.map((activity) =>
// //         activity.id === formData.id ? response.data : activity
// //       ));
// //       resetForm(); // Reset form after update
// //     } catch (err) {
// //       console.error('Error updating activity:', err);
// //       setError('Error updating activity'); // Set error message
// //     }
// //   };

// //   // Add activity to itinerary
// //   const addToItinerary = async (activityId: string, itineraryId: string) => {
// //     try {
// //       const updatedActivity = { itineraryId };
// //       const response = await axios.patch(`/api/activity/${activityId}`, updatedActivity);
// //       setActivities(activities.map((activity) =>
// //         activity.id === activityId ? response.data : activity
// //       ));
// //     } catch (err) {
// //       console.error('Error adding activity to itinerary:', err);
// //       setError('Error adding activity to itinerary');
// //     }
// //   };

// //   // DELETE an activity
// //   const deleteActivity = async (id: string) => {
// //     try {
// //       await axios.delete(`/api/activity/${id}`);
// //       setActivities(activities.filter((activity) => activity.id !== id));
// //     } catch (err) {
// //       console.error('Error deleting activity:', err);
// //       setError('Error deleting activity'); // Set error message
// //     }
// //   };

// //   // Reset the form after adding/updating an activity
// //   const resetForm = () => {
// //     setFormData({
// //       id: '',
// //       name: '',
// //       description: '',
// //       time: '',
// //       date: '',
// //       location: '',
// //       image: '',
// //       phone: '',
// //       address: '',
// //       itineraryId: '', // Reset itineraryId
// //     });
// //   };

// //   // Fill form with activity details for updating
// //   const handleUpdateClick = (activity: Activity) => {
// //     setFormData({
// //       id: activity.id,
// //       name: activity.name,
// //       description: activity.description,
// //       time: activity.time,
// //       date: activity.date,
// //       location: activity.location,
// //       image: activity.image,
// //       phone: activity.phone,
// //       address: activity.address,
// //       itineraryId: activity.itineraryId, // Populate itineraryId for updating
// //     });
// //   };

// //   // Close Snackbar
// //   const handleCloseSnackbar = () => {
// //     setError(null);
// //   };

// //   return (
// //     <Container>
// //       {/* Form for creating/updating an activity */}
// //       <Box mb={4}>
// //         <Typography variant="h4" gutterBottom>
// //           {formData.id ? 'Update Activity' : 'Create Activity'}
// //         </Typography>
// //         <form onSubmit={handleSubmit}>
// //           <TextField
// //             label="Activity Name"
// //             name="name"
// //             value={formData.name}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Description"
// //             name="description"
// //             value={formData.description}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Time"
// //             name="time"
// //             value={formData.time}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Date"
// //             type="date"
// //             name="date"
// //             value={formData.date}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Location"
// //             name="location"
// //             value={formData.location}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Image URL"
// //             name="image"
// //             value={formData.image}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Phone"
// //             name="phone"
// //             value={formData.phone}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />
// //           <TextField
// //             label="Address"
// //             name="address"
// //             value={formData.address}
// //             onChange={handleChange}
// //             fullWidth
// //             margin="normal"
// //           />

// //           {/* Itinerary dropdown (only for updating an activity) */}
// //           {formData.id && (
// //             <FormControl fullWidth margin="normal">
// //               <InputLabel>Itinerary</InputLabel>
// //               <Select
// //                 name="itineraryId"
// //                 value={formData.itineraryId}
// //                 onChange={handleChange}
// //                 label="Itinerary"
// //               >
// //                 {itineraries.map((itinerary) => (
// //                   <MenuItem key={itinerary.id} value={itinerary.id}>
// //                     {itinerary.name}
// //                   </MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //           )}

// //           <Button
// //             type="submit"
// //             variant="contained"
// //             color="primary"
// //           >
// //             {formData.id ? 'Update Activity' : 'Add Activity'}
// //           </Button>
// //         </form>
// //       </Box>

// //       {/* Display list of activities */}
// //       <Box>
// //         <Typography variant="h5" gutterBottom>
// //           Activities List
// //         </Typography>
// //         {Array.isArray(activities) && activities.map((activity) => (
// //           <Box key={activity.id} mb={2}>
// //             <Typography variant="h6">{activity.name}</Typography>
// //             <Typography>{activity.description}</Typography>
// //             <Typography>{activity.time}</Typography>
// //             <Typography>{activity.date}</Typography>
// //             <Typography>{activity.location}</Typography>
// //             <Typography>{activity.phone}</Typography>
// //             <Typography>{activity.address}</Typography>
// //             <Typography>{activity.itineraryId}</Typography> {/* Display itineraryId */}
// //             <Button
// //               onClick={() => handleUpdateClick(activity)}
// //               variant="outlined"
// //             >
// //               Update
// //             </Button>
// //             {/* Add to Itinerary Button */}
// //             <Button
// //               onClick={() => addToItinerary(activity.id, formData.itineraryId)}
// //               variant="outlined"
// //               color="primary"
// //             >
// //               Add to Itinerary
// //             </Button>
// //             <Button
// //               onClick={() => deleteActivity(activity.id)}
// //               variant="outlined"
// //               color="secondary"
// //             >
// //               Delete
// //             </Button>
// //           </Box>
// //         ))}
// //       </Box>

// //       {/* Error Snackbar */}
// //       {error && (
// //         <Snackbar
// //           open={true}
// //           message={error}
// //           onClose={handleCloseSnackbar}
// //           autoHideDuration={4000}
// //         />
// //       )}
// //     </Container>
// //   );
// // };

// // export default Activity;
