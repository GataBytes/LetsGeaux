import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';

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
}

interface Props {
  itineraryId: string;
  addActivity: (itineraryId: string, activityData: any) => Promise<void>;

}

const Activity: React.FC<Props> = ({ itineraryId }) => {
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
    itineraryId: itineraryId,
  });
  const [open, setOpen] = useState(false);  // Modal open state

  // Fetch activities when the component mounts
  useEffect(() => {
    const getActivities = async () => {
      try {
        const response = await axios.get(`/api/activity/${itineraryId}`);
        setActivities(response.data);
      } catch (err) {
        console.error('Error fetching activities:', err);
      }
    };
    getActivities();
  }, [itineraryId]);

  const handleChange = (e: React.ChangeEvent<{ name?: string; value: any }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const postActivity = async () => {
    try {
      const response = await axios.post('/api/activity', formData);
      setActivities([...activities, response.data]);
      resetForm();
      setOpen(false);  // Close modal after adding activity
    } catch (err) {
      console.error('Error creating activity:', err);
    }
  };

  const updateActivity = async () => {
    try {
      const updatedActivity = { ...formData };
      const response = await axios.patch(`/api/activity/${formData.id}`, updatedActivity);
      setActivities(activities.map((activity) =>
        activity.id === formData.id ? response.data : activity
      ));
      resetForm();
      setOpen(false);  // Close modal after updating activity
    } catch (err) {
      console.error('Error updating activity:', err);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      await axios.delete(`/api/activity/${id}`);
      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

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
      itineraryId: itineraryId,
    });
  };

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
      itineraryId: activity.itineraryId,
    });
    setOpen(true);  // Open modal to edit activity
  };

  const handleOpen = () => {
    resetForm();
    setOpen(true);  // Open modal to create new activity
  };

  const handleClose = () => {
    setOpen(false);  // Close modal
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      updateActivity();  // Update activity if it has an id
    } else {
      postActivity();  // Otherwise, create a new activity
    }
  };

  return (
    <Container>
      <Box mb={4}>
        {/* <Typography variant="h4" gutterBottom>
          Activities
        </Typography> */}
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Activity
        </Button>

        {/* Modal for adding/editing activity */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{formData.id ? 'Update Activity' : 'Create Activity'}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Activity Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Image URL"
                name="image"
                value={formData.image}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  {formData.id ? 'Update Activity' : 'Add Activity'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Activities List
        </Typography>
        {activities.map((activity) => (
          <Box key={activity.id} mb={2}>
            <Typography variant="h6">{activity.name}</Typography>
            <Typography>{activity.description}</Typography>
            <Typography>{activity.time}</Typography>
            <Typography>{activity.date}</Typography>
            <Typography>{activity.location}</Typography>
            <Typography>{activity.phone}</Typography>
            <Typography>{activity.address}</Typography>
            <Button onClick={() => handleUpdateClick(activity)} variant="outlined">
              Update
            </Button>
            <Button onClick={() => deleteActivity(activity.id)} variant="outlined" color="secondary">
              Delete
            </Button>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Activity;
