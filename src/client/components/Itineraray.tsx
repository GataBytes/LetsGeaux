import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Itinerary: React.FC = () => {
  const { state } = useLocation();  // Get location state passed from Calendar component
  const selectedDates = state?.selectedDates || [];  // Get selectedDates or default to an empty array
  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);

  const [itineraryName, setItineraryName] = useState('');
  const [itineraryNotes, setItineraryNotes] = useState('');
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedDates.length > 0 && !editingItinerary) {
      setItineraryName(`Trip from ${selectedDates[0].toLocaleDateString()} to ${selectedDates[selectedDates.length - 1].toLocaleDateString()}`);
    }

    // Populate fields if editing an itinerary
    if (editingItinerary) {
      setItineraryName(editingItinerary.name);
      setItineraryNotes(editingItinerary.notes);
    }
  }, [selectedDates, editingItinerary]);


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


  const handleEditSubmit = async () => {
    if (!itineraryName || !itineraryNotes) {
      setError('Please provide a name and notes for the itinerary');
      return;
    }

    const updatedItineraryData = {
      id: editingItinerary.id,
      creator_id: editingItinerary.creator_id,
      member_id: editingItinerary.member_id,
      name: itineraryName,
      notes: itineraryNotes,
      begin: editingItinerary.begin,
      end: editingItinerary.end,
      upVotes: editingItinerary.upVotes,
      downVotes: editingItinerary.downVotes,
    };

    try {
      const response = await axios.patch(`/api/itinerary/${editingItinerary.id}`, updatedItineraryData);
      console.log('Itinerary Updated:', response.data);
      setItineraries(prev => prev.map(itinerary => itinerary.id === editingItinerary.id ? response.data : itinerary));
      // Reset form and state after successful update
      setEditingItinerary(null);
      setItineraryName('');
      setItineraryNotes('');
    } catch (err) {
      console.error('Error updating itinerary:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingItinerary(null);  // Reset the editing state
    setItineraryName('');
    setItineraryNotes('');
  };

  const handleEditClick = (itinerary: any) => {
    setEditingItinerary(itinerary);
  };

  const handleSubmit = async () => {
    if (!itineraryName || selectedDates.length === 0) {
      setError('Please provide a name and select dates for the itinerary');
      return;
    }

    const itineraryData = {
      creator_id: 1,  
      member_id: 2,   
      name: itineraryName,
      notes: itineraryNotes,
      begin: selectedDates[0].toISOString(),  // Start date
      end: selectedDates[selectedDates.length - 1].toISOString(),  // End date
      upVotes: 0,
      downVotes: 0,
    };

    try {
      const response = await axios.post('/api/itinerary', itineraryData);
      console.log('Itinerary Created:', response.data);
      setItineraries(prev => [...prev, response.data]);
      setItineraryName('');
      setItineraryNotes('');
      setError('');
    } catch (err) {
      setError('Error creating itinerary');
      console.error('Error creating itinerary:', err);
    }
  };



  const handleDelete = async (itineraryId: number) => {
    try {
      // Send DELETE request to server
      await axios.delete(`/api/itinerary/${itineraryId}`);
      // Update the state to remove the deleted itinerary 
      setItineraries(prev => prev.filter(itinerary => itinerary.id !== itineraryId));
      console.log('Itinerary deleted');
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  };



  //handle share itinerary with group 
/*
  const handleShareGroup = async(itineraryId: number, groupId: number) =>{
await axios.post(`api/itinerary/${itineraryId}/share`, { groupId})
  
  }catch(err){
  console.error('Error sharing itinerary:', err)
  alert('Failed to share itinerary')
  }
*/

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {editingItinerary ? 'Edit Itinerary' : 'Create Your Itinerary'}
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

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

      <Box display="flex" flexDirection="column" mb={2}>
        <Typography variant="h6">Selected Dates:</Typography>
        <Box display="flex" flexWrap="wrap" justifyContent="center">
          {selectedDates.map((date: any, index: any) => (
            <Typography key={index} variant="body2" sx={{ margin: 1 }}>
              {date.toLocaleDateString()}
            </Typography>
          ))}
        </Box>
      </Box>

      <Box display="flex" gap={2}>
        {editingItinerary ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSubmit}
            >
              Save Changes
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Save Itinerary
          </Button>
        )}
      </Box>

      <Box mt={4}>
        <Typography variant="h5">Created Itineraries:</Typography>
        {itineraries.map((itinerary, index) => (
          <Box key={index} mb={2}>
            <Typography variant="h6">{itinerary.name}</Typography>
            <Typography variant="body1">{itinerary.notes}</Typography>
            <Typography variant="body2">{`Begin: ${new Date(itinerary.begin).toLocaleString()}`}</Typography>
            <Typography variant="body2">{`End: ${new Date(itinerary.end).toLocaleString()}`}</Typography>

            <Box display="flex" gap={2}>
              <Button variant="contained" color="secondary" onClick={() => handleEditClick(itinerary)}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={() => handleDelete(itinerary.id)}>
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Itinerary;

 



