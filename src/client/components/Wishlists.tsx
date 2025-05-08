import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, Button } from '@mui/material';
import { user } from '../../../types/models.ts';
import Suggestion from './Suggestion.tsx';
import SuggestionToActivityForm from './SuggestionToActivityForm.tsx';

interface WishlistProps {
  user: user;
}

const Wishlist: React.FC<WishlistProps> = ({ user }) => {
  const [wishlistSuggs, setWishlistSuggs] = useState([]);
  const [wishMode, setWishMode] = useState(true)


  const getAllWishlistSuggestions = () => {
    console.log('getting');
    axios.get(`/api/wishlist/${user.id}`).then(({ data }) => {
      setWishlistSuggs(data);
    }).catch((err) => console.error('unable to retrieve wishlist', err));
  }
  useEffect(() => getAllWishlistSuggestions(), []);

const handleListDelete = () => {
  axios.delete(`/api/wishlist/${user.id}`).then(() => {
    getAllWishlistSuggestions();
  }).catch((err) => {
    console.error('unable to delete list', err);
  })
}


  return (
    <Container>
      {wishlistSuggs.map((currentSuggestion) => (
        <Card sx={{ mb: 4, borderRadius: 4, backgroundColor: "#C2A4F8"}} key={currentSuggestion.id}>
          <Suggestion
            user={user}
            isDb={true}
            wishMode={wishMode}
            currentSuggestion={currentSuggestion}
            getAllWishlistSuggestions={getAllWishlistSuggestions}
          />
        </Card>

      ))}
      {wishlistSuggs.length
      ? (
        <Button sx={{ borderWidth: 4, color: "black" }} onClick={handleListDelete}>Delete entire wishlist</Button>

      ) : (
        <Typography>Add new excursions to your wishlist on the Suggestions Page!</Typography>
      )}
    </Container>
  )
}

export default Wishlist;