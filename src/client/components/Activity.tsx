import React, { FC, useState } from 'react';
import axios from 'axios';
import { Container, Card, Box, Button, Typography } from '@mui/material';
type ActivityType = {
  id: string;
  description: string;
  time: string;
  date: string;
  location: string;
  image: string;
  phone: string;
  address: string;
};
type ActivityProps = {
  act: ActivityType;
  getAllActivities: () => void;
};

const Activity: FC<ActivityProps> = ({ act, getAllActivities }) => {
  const deleteAct = () => {
    axios
      .delete(`/api/activity/${act.id}`)
      .then(() => {
        getAllActivities();
      })
      .catch(err => console.error(err));
  };
  return (
    <Container>
      <div className='activity-title'>{act.id}</div>
      <p className='activity-description'>{act.description}</p>
      <div className='activity-time'>{act.time}</div>
      <div className='activity-date'>{act.date}</div>
      <div className='activity-location'>{act.location}</div>
      <img
        className='activity-image'
        src={act.image}
        width='200'
        height='200'
      />
      <div className='activity-contact'>{act.phone}</div>
      <div className='activity-address'>{act.address}</div>
      <Button onClick={deleteAct}>Destroy</Button>
    </Container>
  );
};

export default Activity;
