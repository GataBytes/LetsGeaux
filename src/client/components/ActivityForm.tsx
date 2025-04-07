<<<<<<< HEAD

import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
=======
// import React from 'react';
// import axios from 'axios';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { Container, Grid, Input, Button, FormHelperText, TextField } from '@mui/material';
>>>>>>> 640e0b53e4b3a2f35f26de2db6d15f53a1b2d061

// type FormFields = {
//   title: string;
//   description: string;
//   time: string;
//   date: string; // Date is a string in YYYY-MM-DD format
//   location: string;
//   image: string;
//   phoneNum: string;
//   address: string;
// };

// type ActivityFormProps = {
//   getAllActivities: () => void;
// };

// const ActivityForm: React.FC<ActivityFormProps> = ({ getAllActivities }) => {
//   const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormFields>({
//     defaultValues: {
//       title: '',
//       description: '',
//       time: '',
//       date: '',
//       location: '',
//       image: '',
//       phoneNum: '',
//       address: '',
//     },
//   });

//   const postActivity: SubmitHandler<FormFields> = async (formValues) => {
//     const { title, description, time, date, location, image, phoneNum, address } = formValues;

//     const activityData = {
//       name: title,
//       description,
//       time,
//       date,
//       location,
//       image,
//       phone: phoneNum,
//       address,
//     };

//     console.log('Posting activity:', activityData); // Log the data to see if it's correct

//     try {
//       const response = await axios.post('/api/activity', activityData);
//       console.log('Activity posted successfully:', response.data); // Log successful response
//       getAllActivities(); // Reload activities
//     } catch (error) {
//       console.error('Failed to post activity:', error); // Log any errors
//     }
//   };

//   return (
//     <Container>
//       <Grid container spacing={4}>
//         <form className="activity-form" onSubmit={handleSubmit(postActivity)}>
//           {/* Title */}
//           <TextField
//             {...register('title', { required: 'Event must have a title' })}
//             label="Title"
//             variant="outlined"
//             fullWidth
//             error={!!errors.title}
//             helperText={errors.title?.message}
//           />

//           {/* Description */}
//           <TextField
//             {...register('description')}
//             label="Description"
//             variant="outlined"
//             fullWidth
//             multiline
//             rows={3}
//           />

//           {/* Time */}
//           <TextField
//             {...register('time', { required: 'Must specify time' })}
//             label="Time"
//             variant="outlined"
//             fullWidth
//             error={!!errors.time}
//             helperText={errors.time?.message}
//           />

//           {/* Date */}
//           <TextField
//             {...register('date', { required: 'Must specify date' })}
//             label="Date"
//             variant="outlined"
//             fullWidth
//             type="date"
//             InputLabelProps={{ shrink: true }}
//             error={!!errors.date}
//             helperText={errors.date?.message}
//           />

//           {/* Location */}
//           <TextField
//             {...register('location')}
//             label="Location"
//             variant="outlined"
//             fullWidth
//           />

//           {/* Image URL */}
//           <TextField
//             {...register('image')}
//             label="Image URL"
//             variant="outlined"
//             fullWidth
//           />

//           {/* Phone Number */}
//           <TextField
//             {...register('phoneNum', {
//               required: 'Phone number is required',
//               pattern: {
//                 value: /^[0-9]{10}$/,
//                 message: 'Phone number must be 10 digits',
//               },
//             })}
//             label="Phone Number"
//             variant="outlined"
//             fullWidth
//             error={!!errors.phoneNum}
//             helperText={errors.phoneNum?.message}
//           />

//           {/* Address */}
//           <TextField
//             {...register('address')}
//             label="Address"
//             variant="outlined"
//             fullWidth
//           />

//           {/* Submit Button */}
//           <Button disabled={isSubmitting} type="submit" variant="contained" color="primary" fullWidth>
//             {isSubmitting ? 'Submitting...' : 'Submit'}
//           </Button>
//         </form>
//       </Grid>
//     </Container>
//   );
// };

// export default ActivityForm;
