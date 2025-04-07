import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card } from '@mui/material';
import Suggestion from './Suggestion.tsx';
import { user } from '../../../types/models.ts';

interface WishlistProps {
  user: user;
}

const Wishlist: React.FC<WishlistProps> = ({user}) => {
  const [listing, setListing] = useState(true);
  const [listSet, setListSet] = useState([]);
  const getAllWishlistSuggestions = () => {
    console.log('lawd, she tryin');
    // axios.get(`/api/wishlist/${user.id}`).then((data) => {
    //   console.log(data)
    //   setListSet(data);
    // }).catch((err) => console.error('did not grab wishes', err))
    // console.log('still gotta get em');
  }
  // useEffect(() => {
  //   getAllWishlistSuggestions();
  // }, [])

  return (
    <div>Stuff here</div>
    // <Container>
    //   {listSet.map((listSuggestion) => (

    //     <Card key={listSuggestion.id}>
    //       <Suggestion listSuggestion={listSuggestion} listing={listing} setListing={setListing} />
    //     </Card>
    //   ))}
    // </Container>
  )
}

export default Wishlist;