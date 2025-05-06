  import React, { useState, useEffect } from 'react';
  import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
    Card,
    CardActions,
    CardContent,
    Autocomplete,
    Tooltip,
    IconButton,
    Fab
  } from '@mui/material';
  import axios from 'axios';
  import { user } from '../../../../types/models';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
  import { DatePicker } from '@mui/x-date-pickers/DatePicker';
  import { TimePicker } from '@mui/x-date-pickers/TimePicker';
  import dayjs from 'dayjs';
  import { useSnackbar } from 'notistack';
  import { PiTrash } from 'react-icons/pi';
  import { PiPlusBold } from 'react-icons/pi';
  import { PiPencil } from 'react-icons/pi';
  

  interface Activity {
    id: string;
    name: string;
    description: string;
    time: string;
    date: string;
    location: string;
    image: string;
    phone: string;
    address: string;
    itineraryId: string;
    creatorId?: string;
  }

  interface Props {
    itineraryId: number;
    itineraryCreatorId: number;
    user: user;
    addActivity: (itineraryId: string, activityData: any) => Promise<void>;
    itineraryBegin: string;
    itineraryEnd: string;
  }

  const Activity: React.FC<Props> = ({
    itineraryId,
    itineraryCreatorId,
    addActivity,
    user,
    itineraryBegin,
    itineraryEnd
  }) => {

    const [activities, setActivities] = useState<Activity[]>([]);
    const [formData, setFormData] = useState({
      id: '',
      name: '',
      description: '',
      time: '',
      date: '',
      location: '',
      image: '',
      phone: '',
      address: '',
      itineraryId: itineraryId
    });
    const [open, setOpen] = useState(false); // Modal open state
    const [error, setError] = useState<string | null>(null); //Error
    // const [message, setMessage] = useState<string>(''); // Success message
    //delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null); // stores the activity to delete

    //state to hold description autocomplete 
      const [descriptionOptions, setDescriptionOptions] = useState<string[]>([]);
      //state to hold activity name autocomplete 
    
      const [nameOptions, setNameOptions] = useState<string[]>([]);
    
      //define place type
      interface PlaceOption {
        //
        label: string;
        place_id: string;
      }
      //state to store all autocomplete options
      const [placeOptions, setPlaceOptions] = useState<PlaceOption[]>([]);




    //copies activity and sorted activity by time and date
    const sortedActivities = [...activities].sort((a, b) => {
      const dateTimeA = dayjs(
        `${a.date} ${a.time}`,
        'MMMM D, YYYY h:mm A'
      ).toDate();
      const dateTimeB = dayjs(
        `${b.date} ${b.time}`,
        'MMMM D, YYYY h:mm A'
      ).toDate();
      return dateTimeA.getTime() - dateTimeB.getTime();
    });
    const { enqueueSnackbar } = useSnackbar();

    // Fetch activities when the component mounts
    useEffect(() => {
      const getActivities = async () => {
        try {
          const response = await axios.get(`/api/activity/${itineraryId}`);
          console.log('Fetched activities:', response.data);
          if (response.data && Array.isArray(response.data)) {
            setActivities(response.data);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (err) {
          console.error('Error fetching activities:', err);
          setError('Error fetching activities.');
        }
      };
      getActivities();
    }, [itineraryId]);

    //form handler to update state when user types into input fields
    const handleChange = (
      e: React.ChangeEvent<{ name?: string; value: any }>
    ) => {
      const { name, value } = e.target;
      if (name) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    };
    // create new activities
    const postActivity = async () => {
      try {
        const response = await axios.post('/api/activity', formData);
        setActivities(prevActivities => [...prevActivities, response.data]);
        resetForm();
        setOpen(false);
        enqueueSnackbar('Activity added successfully!', { variant: 'success' });
      } catch (err: any) {
        console.error(
          'Error creating activity:',
          err.response?.data || err.message
        );
        setError('Error creating activity.');
      }
    };

    //edit activities
    const updateActivity = async () => {
      try {
        const updatedActivity = { ...formData };
        const response = await axios.patch(
          `/api/activity/${formData.id}`,
          updatedActivity
        );
        setActivities(prevActivities =>
          prevActivities.map(activity =>
            activity.id === formData.id ? response.data : activity
          )
        );
        resetForm();
        setOpen(false); // Close modal after updating activity
        enqueueSnackbar('Activity updated successfully!', { variant: 'success' });
      } catch (err) {
        console.error('Error updating activity:', err);
        setError('Error updating activity.');
      }
    };

    //reset/clear form
    const resetForm = () => {
      setFormData({
        id: '',
        name: '',
        description: '',
        time: '',
        date: '',
        location: '',
        image: '',
        phone: '',
        address: '',
        itineraryId: itineraryId
      });
    };

    //function when update button is clicked
    const handleUpdateClick = (activity: Activity) => {
      setFormData({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        time: activity.time,
        date: activity.date,
        location: activity.location,
        image: activity.image,
        phone: activity.phone,
        address: activity.address,
        itineraryId: +activity.itineraryId
      });
      setOpen(true); // Open modal to edit activity
    };

    const handleOpen = () => {
      resetForm();
      setOpen(true); // Open modal to create new activity
    };

    const handleClose = () => {
      setOpen(false); // Close modal
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.id) {
        updateActivity(); // Update activity if it has an id
      } else {
        postActivity(); // Otherwise, create a new activity
      }
    };
    // called when trash can is clicked
    const handleOpenDeleteDialog = (activity: Activity) => {
      setActivityToDelete(activity);
      setDeleteDialogOpen(true);
    };
    //closes and clears activity
    const handleCloseDeleteDialog = () => {
      setDeleteDialogOpen(false);
      setActivityToDelete(null);
    };
    //removes deleted activity
    const handleConfirmDelete = async () => {
      if (!activityToDelete) return;

      try {
        await axios.delete(`/api/activity/${activityToDelete.id}`);
        setActivities(prev => prev.filter(a => a.id !== activityToDelete.id));
        enqueueSnackbar('Activity deleted successfully!', { variant: 'success' });
      } catch (err) {
        console.error('Error deleting activity:', err);
        setError('Error deleting activity.');
      } finally {
        handleCloseDeleteDialog();
      }
    };
  

    //fetch autocomplete places
    const fetchPlaces = async (input: string) => {
      //stops function if input is empty
      if (!input) return;
      //console.log('Fetching autocomplete for:', input);
      try {
        //fetch request from back end
        const response = await axios.get('/api/activity/google-place-autocomplete', {
          //passes inut query param
          params: { input }
        });
    //extracts response body from response object 
        const data = response.data;
    //will make sure data.predictions is an array 
        if (!Array.isArray(data.predictions)) {
          return;
        }
    // map through data.predictions 
        const results = data.predictions.map((p: any) => ({
          label: p.description, // each description
          place_id: p.place_id // and uniqu indentifier for more details
        }));
    //upadates component state
        setPlaceOptions(results);
      } catch (err) {
        console.error('Error fetching places:', err);
      }
    };
    
    
    //fetch autocomplete for details

    const fetchPlaceDetails = async (placeId: string) => {
      try {
        const res = await axios.get('/api/activity/google-place-details', {
                  //passes placeId query param

          params: { placeId }
        });
        
        // holds the detailed data like name, address, phone, and photos
        const place = res.data;
        //upates  acivity form
        setFormData(prev => ({
          ...prev,
          location: place.name || prev.location,
          address: place.formatted_address || '',
          phone: place.formatted_phone_number || '',
          //create image url if photo is available 
          image: place.photos?.length
            ? `/api/activity/google-place-photo?photoRef=${place.photos[0].photo_reference}`
            : ''
        }));
      } catch (err) {
        console.error('Error fetching place details:', err);
      }
    };
    // used useEffect for one specific thing(descriptions)
    //ran once and mounted  

    useEffect(() => {
      const fetchDescriptions = async () => {
        try {
          // calls back end for list of descriptions
          const res = await axios.get('/api/activity/autocomplete-descriptions');
          //updates description options
          setDescriptionOptions(res.data);
        } catch (error) {
          console.error('Error fetching description options:', error);
        }
      };
      fetchDescriptions();
    }, []);

    // used useEffect for one specific thing(names)
    //ran once and mounted  
    useEffect(() => {
      const fetchNames = async () => {
        try {
          // call back end for list of names
          const res = await axios.get('/api/activity/autocomplete-names');
                  //updates names options

          setNameOptions(res.data); 
        } catch (error) {
          console.error('Error fetching name options:', error);
        }
      };
      fetchNames();
    }, []);
    //empty obect to store to store activities  grouped by date 
    //Record <- typescript type 
    //Activity <- array of activity for that date 
    const groupedByDate: Record<string, Activity[]> = {};
  //loop through sortedActivities
  for (const activity of sortedActivities) {
    //date = key of that object
    const date = activity.date;
    // if no date, empty array 
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    //if key, push activity into array for that date
    groupedByDate[date].push(activity);
  }

    

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container>
        
          {/* Conditional if Activities Exist */}
          {activities.length ? (
            <>
              <Box>
                <Typography variant='h5' gutterBottom>
                  Activities List
                </Typography>
                  {/* {sortedActivities.map(activity => ( */}
                  {Object.entries(groupedByDate).map(([date, activities]) => (
                    <Box key={date} mb={4}>
                      <Typography variant="h6" gutterBottom>
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {activities.map(activity => (
                          <Box key={activity.id}  sx={{
                            width: 300,
                            minHeight: 300,
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                          }}>
                                        
                            <Card
                              sx={{
                                backgroundColor: '#C2A4F8',
                                padding: '16px',
                                borderRadius: '24px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                position: 'relative'
                              }}
                            >
                              {activity.image && (
                                <Box
                                  component='img'
                                  src={activity.image}
                                  alt={activity.name}
                                  sx={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'cover',
                                    borderRadius: '16px',
                                    mb: 2
                                  }}
                                />
                              )}
                              
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant='h6'>{activity.name}</Typography>
                                <Typography>{activity.description}</Typography>
                                <Typography>{activity.time}</Typography>
                                <Typography>{activity.date}</Typography>
                                <Typography>{activity.location}</Typography>
                                <Typography>{activity.phone}</Typography>
                                <Typography>{activity.address}</Typography>
                              </CardContent>
                              <CardActions>
                                <Tooltip title='Edit Activity'>
                                  <IconButton
                                    onClick={() => handleUpdateClick(activity)}
                                    // color='secondary'
                                    sx={{ 
                                      position: 'absolute',
                                      bottom: 8,
                                      right: 40,
                                      color: 'black' 
                                    }}
                                  >
                                    <PiPencil/>
                                  </IconButton>
                                </Tooltip>
                                {user.id === itineraryCreatorId && (
                                  <Tooltip title='Delete Activity'>
                                    <IconButton
                                    onClick={() => handleOpenDeleteDialog(activity)}
                                    sx={{
                                      position: 'absolute',
                                      bottom: 8,
                                      right: 8,
                                      color: 'black'
                                    }}
                                  >
                                    <PiTrash />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </CardActions>
                            </Card>
                          </Box>
                          ))}
                      </Box>
                    </Box>
                  ))}
              </Box>
            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
              <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  <Typography>
                    Are you sure you want to delete{' '}
                    <strong>{activityToDelete?.name}</strong>?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteDialog} sx={{ color: 'black' }}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmDelete} sx={{ color: 'black' }}>
                    Delete
                  </Button>
              </DialogActions>
            </Dialog>
          </>
          ) : (
            <>
              <Typography variant='body1' sx={{ mt: 2}}>
                Click the + below to add activities to this itinerary.
              </Typography>
            </>
          )}
          <Box mb={4}>
            {/* Add Activity Button */}
            <Box mt={4} display='flex' justifyContent='center'>
              <Tooltip title='Add New Activity' arrow>
                <Fab
                  color='primary'
                  aria-label='add'
                  onClick={handleOpen}
                  sx={{
                    backgroundColor: '#C2A4F8',
                    '&:hover': { backgroundColor: '#8257E5' }
                  }}
                >
                  <PiPlusBold />
                </Fab>
              </Tooltip>
            </Box>
            {/* Modal for adding activity */}
            <Dialog
            open={open} 
            onClose={handleClose}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: '#C2A4F8'
                }
              }
            }}
            >
              <DialogTitle>
                {formData.id ? 'Update Activity' : 'Create Activity'}
              </DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit}>

                  <Autocomplete
                                //can type anythings
                    freeSolo
                    //list of suggestions 
                    options={nameOptions}
                    //binds current inut value
                    value={formData.name}
                    //updates formData.name
                    onInputChange={(event, newInputValue) => {
                      setFormData(prev => ({ ...prev, name: newInputValue }));
                    }}
                    //handles whenn suggestion is selected from dropdown
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        setFormData(prev => ({ ...prev, name: newValue }));
                      }
                    }}
                    //will render textfiend inside autocomplete
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Activity Name"
                        margin="normal"
                        fullWidth
                        required
                        slotProps={{
                          root: {
                            sx: {
                              '& .MuiInputLabel-root': {
                                top: 0,
                              },
                              '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                top: -9, // floating label
                              },
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: 'black',
                              },
                            },
                          },
                        }}
                      />
                    )}
                  />
                  {/* <TextField
                    label='Activity Name'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin='normal'
                    required
                    slotProps={{
                      root: {
                        sx: {
                          '& .MuiInputLabel-root': {
                            top: -9,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        },
                      },
                    }}
                  /> */}
                    <Autocomplete
                      freeSolo
                      options={descriptionOptions}
                      value={formData.description}
                      onInputChange={(event, newInputValue) => {
                        setFormData(prev => ({ ...prev, description: newInputValue }));
                      }}
                      onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                          setFormData(prev => ({ ...prev, description: newValue }));
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Description"
                          margin="normal"
                          fullWidth
                          required
                          slotProps={{
                            root: {
                              sx: {
                                '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                  top: -9, // floating label
                                },
                                '& .MuiInputLabel-root': {
                                  top: 0,
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'black',
                                  
                                },
                              },
                            },
                          }}
                        />
                      )}
                    />
                  {/* <TextField
                    label='Description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    fullWidth
                    margin='normal'
                    required
                    slotProps={{
                      root: {
                        sx: {
                          '& .MuiInputLabel-root': {
                            top: -9,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        },
                      },
                    }}
                  /> */}
                  <DatePicker
                    label='Activity Date'
                    value={
                      formData.date ? dayjs(formData.date, 'MMMM D, YYYY') : null
                    }
                    onChange={newDate => {
                      if (newDate) {
                        setFormData(prev => ({
                          ...prev,
                          date: newDate.format('MMMM D, YYYY')
                        }));
                      }
                    }}
                    minDate={dayjs(itineraryBegin)}
                    maxDate={dayjs(itineraryEnd)}
                    shouldDisableDate={(date) => {
                      const begin = dayjs(itineraryBegin);
                      const end = dayjs(itineraryEnd);
                    
                      return !date.isBetween(begin, end, 'day', '[]'); // include date range
                    }}
                    slotProps={{
                      actionBar: {
                        sx: {
                          '& .MuiButton-textPrimary': {
                            color: 'black'
                          }
                        }
                      },
                      textField: { 
                        fullWidth: true, 
                        margin: 'normal',
                        required: true,
                        InputLabelProps: {
                          sx: {
                            '&.Mui-focused': {
                              color: 'black'
                            },
                            top: -9
                          }
                        }
                      }
                    }}
                  />

                  <TimePicker
                    label='Activity Time'
                    value={
                      formData.time
                        ? dayjs(
                            `1970-01-01 ${formData.time}`,
                            'YYYY-MM-DD h:mm A'
                          )
                        : null
                    }
                    onChange={newTime => {
                      if (newTime) {
                        setFormData(prev => ({
                          ...prev,
                          time: newTime.format('h:mm A')
                        }));
                      }
                    }}
                    ampm
                    slotProps={{
                      actionBar: {
                        sx: {
                          '& .MuiButton-textPrimary': {
                            color: 'black'
                          }
                        }
                      },
                      textField: { 
                        fullWidth: true, 
                        margin: 'normal',
                        required: true,
                        InputLabelProps: {
                          sx: {
                            '&.Mui-focused': {
                              color: 'black'
                            },
                            top: -9,
                          }
                        }
                      }
                    }}
                  />
                  {/* auto complete for places */}
                  <Autocomplete
                    // allows any type of text
                    freeSolo
                    // list of google place returned from api call
                    options={placeOptions}
                    //tells mui how to display options
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      return option?.label ?? '';
                    }}
                    //will display selected value
                    value={
                      placeOptions.find(opt => opt.label === formData.location) || formData.location
                    }
                    //updates types and runs whenuser types in input box
                    onInputChange={(event, newInputValue) => {
                      //updates form state
                      setFormData(prev => ({ ...prev, location: newInputValue }));
                      //when more than 2 characters is typed, fetch suggestion
                      if (newInputValue.length > 2) fetchPlaces(newInputValue);
                    }}
                    onChange={(event, newValue) => {
                      //console.log('Selected autocomplete value:', newValue);
                      if (typeof newValue === 'string') {
                        setFormData(prev => ({ ...prev, location: newValue }));
                      } else if (newValue?.place_id) {
                        setFormData(prev => ({ ...prev, location: newValue.label })); 
                        fetchPlaceDetails(newValue.place_id); 
                      }
                    }}
                    
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Location'
                        fullWidth
                        margin='normal'
                        required
                        InputProps={{
                          ...params.InputProps,
                          // drop down arrow and clear icons
                          endAdornment: params.InputProps.endAdornment
                        }}
                        slotProps={{
                          root: {
                            sx: {
                              '& .MuiInputLabel-root.Mui-focused': {
                                color: 'black',
                              },
                              '& .MuiInputLabel-root.MuiInputLabel-shrink': {
                                top: -9, // floating label
                              },
                            }
                          }
                        }}
                      />
                    )}
                  />
                  {/* <TextField
                    label='Location'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    fullWidth
                    margin='normal'
                    required
                    slotProps={{
                      root: {
                        sx: {
                          '& .MuiInputLabel-root': {
                            top: -9,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        },
                      },
                    }}
                  /> */}
                  <TextField
                    label='Image URL (optional)'
                    name='image'
                    value={formData.image}
                    onChange={handleChange}
                    fullWidth
                    margin='normal'
                    slotProps={{
                      root: {
                        sx: {
                          '& .MuiInputLabel-root': {
                            top: -9,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        },
                      },
                    }}
                  />
                  <TextField
                    label='Phone (optional)'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    margin='normal'
                    slotProps={{
                      root: {
                        sx: {
                          '& .MuiInputLabel-root': {
                            top: -9,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        },
                      },
                    }}
                  />
                  <TextField
                    label='Address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                    margin='normal'
                    slotProps={{
                      root: {
                        sx: {
                          '& .MuiInputLabel-root': {
                            top: -9,
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                          },
                        },
                      },
                    }}
                  />
                  <DialogActions>
                    <Button
                      variant='contained'
                      onClick={handleClose}
                      color='primary'
                      sx={{ color: 'black' }}
                    >
                      Cancel
                    </Button>
                    <Button variant='contained' type='submit' color='primary' sx={{ color: 'black' }}>
                      {formData.id ? 'Update Activity' : 'Add Activity'}
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
          </Box>

          {error && (
            <Snackbar open autoHideDuration={3000}>
              <Alert severity='error'>{error}</Alert>
            </Snackbar>
          )}
        </Container>
      </LocalizationProvider>
    );
  };

  export default Activity;
