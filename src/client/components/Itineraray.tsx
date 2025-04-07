import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Card, CardContent, CardActions } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { isBefore, isAfter, isSameDay } from 'date-fns';
import { eachDayOfInterval } from 'date-fns';
import axios from 'axios';
import { user } from '../../../types/models.ts';
import Activity from './NEWActivties.tsx'; 

interface ItineraryProps {
  user: user;
}

const Itinerary: React.FC<ItineraryProps> = ({ user }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]); 
  const [itineraryName, setItineraryName] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);
  const [error, setError] = useState<string>('');

  // Function to add activity to itinerary
  const addActivityToItinerary = async (itineraryId: string, activityData: any) => {
    try {
      const response = await axios.post(`/api/itinerary/${itineraryId}/activity`, activityData);
      console.log('Activity added:', response.data);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  // Handle date change and determine start and end dates
  const handleDateChange = (newDate: Date | null) => {
    if (!startDate) {
      setStartDate(newDate);
    } else if (!endDate) {
      if (isAfter(newDate, startDate)) {
        setEndDate(newDate);
      } else {
        setStartDate(newDate);
        setEndDate(null);
      }
    } else if (isSameDay(newDate, startDate) || isSameDay(newDate, endDate)) {
      setStartDate(null);
      setEndDate(null);
    } else {
      if (isBefore(newDate, startDate)) {
        setStartDate(newDate);
        setEndDate(null);
      } else if (isAfter(newDate, endDate!)) {
        setEndDate(newDate);
      }
    }
  };

  // Update selectedDates based on the startDate and endDate
  useEffect(() => {
    if (startDate && endDate) {
      const dates = eachDayOfInterval({ start: startDate, end: endDate });
      setSelectedDates(dates);
    }
  }, [startDate, endDate]);

  // Function to highlight the range of days
  const CustomPickersDay = (props: PickersDayProps<Date>) => {
    const { day, selected, ...rest } = props;
    const isInRange = startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);
    const isSelected = isSameDay(day, startDate) || isSameDay(day, endDate) || isInRange;

    return (
      <PickersDay
        {...rest}
        day={day}
        selected={isSelected}
        sx={{
          backgroundColor: isSelected ? 'primary.main' : 'transparent',
          '&:hover': {
            backgroundColor: 'primary.light',
          },
        }}
      />
    );
  };

  // Function to handle the itinerary form submission
  const handleSubmit = async () => {
    if (!itineraryName || selectedDates.length === 0) {
      setError('Please provide a name and select dates for the itinerary');
      return;
    }

    const itineraryData = {
      creatorId: user.id, 
      member_id: 2,  
      name: itineraryName,
      notes: itineraryNotes,
      begin: selectedDates[0].toISOString(),
      end: selectedDates[selectedDates.length - 1].toISOString(),
      upVotes: 0,
      downVotes: 0,
    };

    try {
      const response = await axios.post('/api/itinerary', itineraryData);
      setItineraries(prev => [...prev, response.data]);
      setItineraryName('');
      setItineraryNotes('');
      setError('');
    } catch (err) {
      setError('Error creating itinerary');
      console.error('Error creating itinerary:', err);
    }
  };

  // Fetch existing itineraries
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

  // Handle edit button click
  const handleEditClick = (itinerary: any) => {
    setEditingItinerary(itinerary);
    setItineraryName(itinerary.name);
    setItineraryNotes(itinerary.notes);

    // Set start and end dates based on itinerary's begin and end
    const start = new Date(itinerary.begin);
    const end = new Date(itinerary.end);
    setStartDate(start);
    setEndDate(end);
  };

  // Handle delete of an itinerary
  const handleDelete = async (itineraryId: number) => {
    try {
      await axios.delete(`/api/itinerary/${itineraryId}`);
      setItineraries(prev => prev.filter(itinerary => itinerary.id !== itineraryId));
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  };

  // Handle save changes on editing an itinerary
  const handleEditSubmit = async () => {
    if (!itineraryName || selectedDates.length === 0) {
      setError('Please provide a name and select dates for the itinerary');
      return;
    }

    const updatedItineraryData = {
      id: editingItinerary.id,
      creator_id: editingItinerary.creator_id,
      member_id: editingItinerary.member_id,
      name: itineraryName,
      notes: itineraryNotes,
      begin: selectedDates[0].toISOString(),
      end: selectedDates[selectedDates.length - 1].toISOString(),
      upVotes: editingItinerary.upVotes,
      downVotes: editingItinerary.downVotes,
    };

    try {
      const response = await axios.patch(`/api/itinerary/${editingItinerary.id}`, updatedItineraryData);
      setItineraries(prev => prev.map(itinerary => itinerary.id === editingItinerary.id ? response.data : itinerary));
      setEditingItinerary(null);
      setItineraryName('');
      setItineraryNotes('');
      setStartDate(null);
      setEndDate(null);
      setError('');
    } catch (err) {
      setError('Error updating itinerary');
      console.error('Error updating itinerary:', err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Typography variant="h4" gutterBottom>
          {editingItinerary ? 'Edit Itinerary' : 'Choose Dates for Your Trip'}
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <DateCalendar
            value={startDate || endDate}
            onChange={handleDateChange}
            views={['day']}
            slots={{
              day: CustomPickersDay,
            }}
          />
        </Box>

        {startDate && endDate && (
          <Typography variant="h6" align="center" color="primary" mt={2}>
            Selected Range: {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
          </Typography>
        )}

        <TextField
          label="Itinerary Name"
          fullWidth
          value={itineraryName}
          onChange={(e) => setItineraryName(e.target.value)}
          sx={{ marginBottom: 2 }}
          required
        />

        <TextField
          label="Itinerary Notes"
          fullWidth
          value={itineraryNotes}
          onChange={(e) => setItineraryNotes(e.target.value)}
          multiline
          rows={4}
          sx={{ marginBottom: 2 }}
        />

        <Box display="flex" justifyContent="center" my={3}>
          {editingItinerary ? (
            <Button variant="contained" color="primary" onClick={handleEditSubmit}>
              Save Changes
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Itinerary
            </Button>
          )}
        </Box>

        <Box mt={4}>
          <Typography variant="h5">Create Your Itinerary</Typography>
          {itineraries.map((itinerary, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{itinerary.name}</Typography>
                <Typography variant="body1">{itinerary.notes}</Typography>
                <Typography variant="body2">{`Begin: ${new Date(itinerary.begin).toLocaleString()}`}</Typography>
                <Typography variant="body2">{`End: ${new Date(itinerary.end).toLocaleString()}`}</Typography>
              </CardContent>
              <CardActions>
                <Button variant="contained" color="secondary" onClick={() => handleEditClick(itinerary)}>
                  Edit
                </Button>
                <Button variant="contained" color="error" onClick={() => handleDelete(itinerary.id)}>
                  Delete
                </Button>
              </CardActions>
              <Activity itineraryId={itinerary.id} addActivity={addActivityToItinerary} />
            </Card>
          ))}
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default Itinerary;
