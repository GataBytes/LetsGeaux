import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Alert,
  IconButton,
  Collapse,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem
} from '@mui/material';

import axios from 'axios';
//tells Axios tO send cookies and HTTP authentication headers (like tokens or session cookies) with every request(cors)
axios.defaults.withCredentials = true;

import { user } from '../../../../types/models.ts';
import Activity from './NEWActivties.tsx';
import { useParams, useLocation } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { PiPencil } from "react-icons/pi";
import { PiTrash } from 'react-icons/pi';
import { PiPlusBold } from 'react-icons/pi';
import { useSnackbar } from 'notistack';

import Calendar from './Calendar';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);
//import { useItinerary } from '../ItineraryContext';

interface ItineraryProps {
  user: user;
}

const Itinerary: React.FC<ItineraryProps> = ({ user }) => {
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);
  const [error, setError] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const location = useLocation();
  const {
    partyId,
    partyName,
    itineraryName: passedName,
    selectedDates: passedDates
  } = location.state || {};
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  interface RouteData {
    id: number;
    origin: string;
    destination: string;
    travelTime: string;
    itineraryId: number
  }
  //const { setItineraryId, itineraryId } = useItinerary();

  // useEffect(() => {
  //   if (itineraryId === null) {
  //     console.log('ItineraryId is not loaded yet.');
  //   } else {
  //     console.log('ItineraryId loaded:', itineraryId);
  //   }
  // }, [itineraryId]);


  //delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(null);

  //send email state  
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [emailToInvite, setEmailToInvite] = useState('');
  const [selectedViewCode, setSelectedViewCode] = useState('');
  const [selectedItineraryName, setSelectedItineraryName] = useState('');


  const [routes, setRoutes] = useState<RouteData[]>([]);


  // Helper function to get range of Dayjs dates
  const getDateRange = (start: Dayjs, end: Dayjs): Date[] => {
    const result: Date[] = [];
    let current = start;
    while (current.isSameOrBefore(end, 'day')) {
      result.push(current.toDate()); // Keep selectedDates as Date[]
      current = current.add(1, 'day');
    }
    return result;
  };

  // for loading and restoring date when going back to calendar page after previously pickking days
  useEffect(() => {
    if (location.state) {
      if (location.state.begin && location.state.end) {
        const begin = dayjs(location.state.begin);
        const end = dayjs(location.state.end);
        setStartDate(begin);
        setEndDate(end);
        setSelectedDates(getDateRange(begin, end));
      } else if (location.state.selectedDates?.length > 0) {
        const converted = location.state.selectedDates.map((d: string) =>
          dayjs(d).toDate()
        );
        setSelectedDates(converted);
        setStartDate(dayjs(converted[0]));
        setEndDate(dayjs(converted[converted.length - 1]));
      }
    }
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      setSelectedDates(getDateRange(startDate, endDate));
    }
  }, [startDate, endDate]);
  //used then dates are updated
  useEffect(() => {
    if (passedName && !editingItinerary) {
      setItineraryName(passedName);
    }
  }, [passedName, editingItinerary]);



  //fetch all itineraries
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get('/api/itinerary');
        setItineraries(response.data);
      } catch (err) {
        console.error('Error fetching itineraries:', err);
      }
    };
    fetchItineraries();
  }, []);


  useEffect(() => {

    axios.get(`/api/maps`)
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => {
        console.error("Error fetching routes:", error);
      });

  }, []);

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
  // when edit is clicked form will update with existing information
  const handleEditClick = (itinerary: any) => {
    setEditingItinerary(itinerary);
    setItineraryName(itinerary.name);
    setItineraryNotes(itinerary.notes);

    const begin: Dayjs = dayjs(itinerary.begin);
    const end: Dayjs = dayjs(itinerary.end);

    setStartDate(begin);
    setEndDate(end);

    // Create a list of Date objects between start and end
    const range: Date[] = [];
    let current = begin;
    while (current.isSameOrBefore(end, 'day')) {
      range.push(current.toDate()); // convert Dayjs to Date for selectedDates
      current = current.add(1, 'day');
    }
    setSelectedDates(range);

    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // handle edits to itinerary
  const handleEditSubmit = async () => {
    if (!itineraryName || selectedDates.length === 0) {
      setError('Please provide a name and select dates');
      return;
    }
    const updated = {
      id: editingItinerary.id,
      creator_id: editingItinerary.creator_id,
      name: itineraryName,
      notes: itineraryNotes,
      begin: selectedDates[0].toISOString(),
      end: selectedDates[selectedDates.length - 1].toISOString(),
      upVotes: editingItinerary.upVotes,
      downVotes: editingItinerary.downVotes
    };
    try {
      const res = await axios.patch(
        `/api/itinerary/${editingItinerary.id}`,
        updated
      );
      setItineraries(prev =>
        prev.map(it => (it.id === editingItinerary.id ? res.data : it))
      );
      resetForm();
      enqueueSnackbar('Itinerary updated successfully!', {
        variant: 'success'
      });
    } catch (err) {
      setError('Error updating itinerary');
    }
  };

  //create new itinerary
  const handleSubmit = async () => {
    if (!itineraryName || selectedDates.length === 0) {
      setError('Please provide a name and select dates');
      return;
    }
    const newData = {
      creatorId: user.id,
      name: itineraryName,
      notes: itineraryNotes,
      begin: selectedDates[0].toISOString(),
      end: selectedDates[selectedDates.length - 1].toISOString(),
      upVotes: 0,
      downVotes: 0,
      ...(partyId && { partyId })
    };
    try {
      const response = await axios.post('/api/itinerary', newData);
      setItineraries(prev => [
        ...prev,
        {
          ...response.data,
          message: `Created! Code: ${response.data.viewCode}`
        }
      ]);
      resetForm();
      enqueueSnackbar('Itinerary created successfully!', {
        variant: 'success'
      });
    } catch (err) {
      setError('Error creating itinerary');
    }
  };
  //handles deleting itinerary
  const handleDelete = async () => {
    if (selectedItineraryId === null) return;

    try {
      await axios.delete(`/api/itinerary/${selectedItineraryId}`);
      setItineraries(prev => prev.filter(it => it.id !== selectedItineraryId));
      resetForm();
      setDeleteDialogOpen(false);
      setSelectedItineraryId(null);
      enqueueSnackbar('Itinerary deleted successfully!', {
        variant: 'success'
      });
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  };

  // clears form and reset after info has been saved or updated
  const resetForm = () => {
    setEditingItinerary(null);
    setItineraryName('');
    setItineraryNotes('');
    setStartDate(null);
    setEndDate(null);
    setSelectedDates([]);
    setShowCreateForm(false);
  };
  //function to add activities
  function addActivityToItinerary(
    itineraryId: string,
    activityData: any
  ): Promise<void> {
    throw new Error('Function not implemented.');
  }

  //emailviewcode
  const handleSendInvite = async () => {
    try {
      await axios.post('/api/itinerary/sendInvite', {
        email: emailToInvite,
        itineraryName: selectedItineraryName,
        viewCode: selectedViewCode,
      });
      enqueueSnackbar('Invite sent successfully!', { variant: 'success' });
      setInviteDialogOpen(false);
      setEmailToInvite('');
    } catch (error) {
      console.error('Error sending invite:', error);
      enqueueSnackbar('Failed to send invite.', { variant: 'error' });
    }
  };



  return (
    <Container>
      {partyName && (
        <Typography align='center' color='secondary'>
          Party: {partyName}
        </Typography>
      )}
      {error && <Typography color='error'>{error}</Typography>}

      <Tooltip title={showCreateForm ? 'Hide Form' : 'Add New Itinerary'}>
        <IconButton
          onClick={() => setShowCreateForm(prev => !prev)}
          sx={{
            mb: 2,
            backgroundColor: '#C2A4F8',
            color: 'black',
            '&:hover': { backgroundColor: '#8257E5' }
          }}
        >
          <PiPlusBold />
        </IconButton>
      </Tooltip>

      <Collapse in={showCreateForm}>
        <Box
          sx={{
            backgroundColor: '#C2A4F8',
            padding: 2,
            borderRadius: 2,
            mb: 4
          }}
        >
          <Calendar
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setSelectedDates={setSelectedDates}
          />

          <Typography variant='h6' mb={2} sx={{ textAlign: 'center' }}>
            {editingItinerary ? 'Edit Itinerary' : 'Create a New Itinerary'}
          </Typography>
          <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
            <TextField
              label='Your Itinerary'
              fullWidth
              value={itineraryName}
              onChange={e => setItineraryName(e.target.value)}
              sx={{ mb: 2 }}
              required
              InputLabelProps={{
                sx: {
                  top: -9,
                  color: 'black',
                  '&.Mui-focused': {
                    color: 'black'
                  },
                }
              }}
            />
            <TextField
              label='Itinerary Notes'
              fullWidth
              value={itineraryNotes}
              onChange={e => setItineraryNotes(e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 2 }}
              InputLabelProps={{
                sx: {
                  top: -9, color: 'black',
                  '&.Mui-focused': {
                    color: 'black'
                  },
                }
              }}
            />
          </Box>
          <Box display='flex' justifyContent='center' mt={2}>
            <Button
              variant='contained'
              color='primary'
              onClick={editingItinerary ? handleEditSubmit : handleSubmit}
            >
              {editingItinerary ? 'Save Changes' : 'Add Itinerary'}
            </Button>
            {editingItinerary && (
              <Button onClick={resetForm} sx={{ ml: 2, color: 'black' }}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Collapse>
      {itineraries.length === 0 && !showCreateForm && (
        <Box mt={4}>
          <Typography variant='h6' align='center' color='primary'>
            Start planning your trip!
          </Typography>
          <Calendar
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setSelectedDates={setSelectedDates}
          />
          <Box display='flex' justifyContent='center' mt={2}>
            <Button variant='contained' onClick={() => setShowCreateForm(true)}>
              Continue
            </Button>
          </Box>
        </Box>
      )}
      <Typography variant='h3' sx={{ mt: 3, mb: 2, textAlign: 'center' }}>
        Itineraries
      </Typography>
      <Box
      // my={2}
      // sx={{
      //   backgroundColor: '#C2A4F8',
      //   padding: '16px',
      //   borderRadius: '8px',
      //   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      // }}
      >
        {itineraries.map((itinerary, index) => (
          <Card
            key={index}
            sx={{
              position: 'relative',
              mb: 2,
              backgroundColor: '#C2A4F8',
              borderRadius: '24px',
              padding: 2,
              boxShadow: 'none',
              border: '4px solid black',
              fontWeight: 700
            }}
          >

            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h3'>{itinerary.name}</Typography>
                {itinerary.partyName && (
                  <Typography variant='caption'
                    color='secondary'
                    sx={{
                      mt: 1,
                      display: 'inline-block',
                      backgroundColor: '#fff085',
                      color: 'black',
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      // border: '4px solid black',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}>
                    Party: {itinerary.partyName}
                  </Typography>
                )}

                <Typography variant='body1'>{itinerary.notes}</Typography>
                <Typography variant='body1'>
                  Begin:{' '}
                  {dayjs(itinerary.begin).format('dddd, MMMM D, YYYY h:mm A')}
                </Typography>
                <Typography variant='body1'>
                  End: {dayjs(itinerary.end).format('dddd, MMMM D, YYYY h:mm A')}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    mt: 2
                  }}
                >
                  <Typography
                    variant='caption'
                    color='secondary'
                    sx={{
                      display: 'inline-block',
                      backgroundColor: '#fff085',
                      color: 'black',
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      //border: '4px solid black',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    View Code: {itinerary.viewCode}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{
                      display: 'inline-block',
                      backgroundColor: 'primary.main',
                      color: 'black',
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',

                    }}
                    onClick={() => {
                      setSelectedViewCode(itinerary.viewCode);
                      setSelectedItineraryName(itinerary.name);
                      setInviteDialogOpen(true);
                    }}
                  >


                    Share Itinerary
                  </Button>
                </Box>
                {itinerary.message && (
                  <Alert severity='success'>{itinerary.message}</Alert>
                )}
              </Box>
            </CardContent>
            <CardActions sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <IconButton
                onClick={() => handleEditClick(itinerary)}
                sx={{ position: 'absolute', bottom: 8, right: 40, color: 'black' }}
              >
                <PiPencil />
              </IconButton>
              {user.id === itinerary.creatorId && (
                <IconButton
                  onClick={() => {
                    setSelectedItineraryId(itinerary.id);
                    setDeleteDialogOpen(true);
                  }}
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    color: 'black'
                  }}
                >
                  <PiTrash />
                </IconButton>
              )}
              {/* {console.log('routes', routes)}
              {console.log('itinID', itineraryId)}
              {console.log('itin.id', itinerary.id)} */}

              {/* rendering Routes  */}
              <Box width="100%" display="flex" justifyContent="center" mt={4}>
                <Box textAlign="center">
                  <Typography variant="h3">
                    Routes Between Activities:
                  </Typography>
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width="100%"
                sx={{ mt: 4 }}
              >
                <Box width="100%" maxWidth={400}>
                  {routes
                    .filter((route) => route.itineraryId === itinerary.id)
                    .map((route, index) => (
                      <Card
                        key={index}
                        sx={{
                          position: 'relative',
                          mb: 2,
                          backgroundColor: '#C2A4F8',
                          borderRadius: '24px',
                          padding: 2,
                          boxShadow: 'none',
                          border: '4px solid black',
                          fontWeight: 700,
                        }}
                      >
                        <Box textAlign="left">
                          <Typography variant="body1">Origin: {route.origin}</Typography>
                          <Typography variant="body1">Destination: {route.destination}</Typography>
                          <Typography variant="body1">Travel Time: {route.travelTime}</Typography>
                          <IconButton sx={{
                            color: 'black',
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                          }} onClick={() => deleteRoute(route.id)}>
                            <PiTrash />
                          </IconButton>
                        </Box>
                      </Card>
                    ))}
                </Box>
              </Box>

              {user && (
                <Activity
                  itineraryId={itinerary.id}
                  addActivity={addActivityToItinerary}
                  itineraryCreatorId={itinerary.creatorId}
                  user={user}
                  itineraryBegin={dayjs(itinerary.begin).format('YYYY-MM-DD')}
                  itineraryEnd={dayjs(itinerary.end).format('YYYY-MM-DD')}
                // itineraryBegin={''}
                // itineraryEnd={''}
                />
              )}
            </CardActions>
          </Card>
        ))}

      </Box>


      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >

        <DialogTitle>Delete Itinerary?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this itinerary?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: 'black' }}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} sx={{ color: 'black' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)}>
        <DialogTitle>Send Itinerary Invite</DialogTitle>
        <DialogContent>
          <TextField
            label="Recipient's Email"
            value={emailToInvite}
            InputLabelProps={{
              sx: {
                top: -8,
                color: 'black',
                '&.Mui-focused': {
                  color: 'black',
                },
              }

            }}
            onChange={(e) => setEmailToInvite(e.target.value)}
            fullWidth
            margin="normal"
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)} sx={{ color: 'black' }}>Cancel

          </Button>
          <Button
            onClick={handleSendInvite}
            variant="contained"
            color="primary"
            disabled={!emailToInvite}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Itinerary;
