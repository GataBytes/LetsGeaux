import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Input, InputLabel, Typography, Accordion, Grid,  } from '@mui/material';
//import Activity from './Activity';
//import ActivityForm from './ActivityForm';

const Activities = () => {
  const [activitySet, setActivitySet] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const getAllActivities = () => {
    axios.get('/api/activity').then(({data}) => {
      console.log(data);
      setActivitySet(data);
    }).catch((err) => console.error('there was an issue', err));
  }

  useEffect(() => {
    getAllActivities();
  }, []);
  return (
    <Container>
      <h2>Current Activities</h2>
      {activitySet.map((act) => (
        <Card key={act.name}>
      <Activity act={act} getAllActivities={getAllActivities} editMode={editMode} />
      </Card>
      ))}
      <ActivityForm act={act}/>
    </Container>
  )
}

export default Activities;
