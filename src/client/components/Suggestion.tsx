import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Button,
  Card,
  CardMedia,
  Stack,
  Fade,
  Accordion,
  AccordionClasses,
  AccordionSummary,
  Typography,
  AccordionDetails,
  accordionDetailsClasses,
  Dialog,
  Grid,
  Avatar,
  ImageList,
  ImageListItem,
  ListItemText,
} from '@mui/material';
import { AddToQueueRounded, ArrowForwardIos } from '@mui/icons-material'
import { user } from '../../../types/models.ts';

interface SuggestionProps {
  user: user;
  getAllSuggestions: Function;
  setSuggestionEditMode: Function;
  getAllWishlistSuggestions: Function;
  wishMode: Boolean;

}

/**
 * When the "add to itinerary" speed dial  button is pressed, the associated function will:
 * Save the suggestion info to the database
 * Take the necessary info for the activity form as props
 * Move those props to the activity form component
 * autofill that info into the form
 * STRETCH: highlight the other fields that need to be filled in
 *
 * Future: need to set up conditionals for voting icons in speed dial. Don't show if suggestion isn't saved. Disable if unauthorized to vote

Faded translucent accordion to be set by lunch tomorrow.  [https://mui.com/material-ui/react-accordion/]

*/


// const Grid = Grid2;
const Suggestion: React.FC<SuggestionProps> = ({
  user,
  currentSuggestion,
  getAllSuggestions,
  wishMode,
  getAllWishlistSuggestions,
  /*listSuggestion, setEditableSuggestion}*/
}) => {
  const [expanded, toggleExpanded] = useState(false);


  /* ---------Parts of the currentSuggestion
  title, description, phoneNum, latitude, longitude, address
  */

  /**
   * Activity Suggestion match points
   */

  /**
   * How to handle separate posts..
   * I can add a quality to the post function on this side to either add it to the wishlist get
   * or let it just stay in the db. (maybe searchable with a "show all saved suggestions" button)
   * maybe call it a wishlist id, but use a userId, so whenever a user with that Id shows up there,
   * it'll only show up if it matches... Patch requests can add the id  to and take it away from the wishlist
   * also via a button
   *
   * maybe also an "inWishlist"
   */

  // This is what occurs when the add to wishlist button is pressed. Calling a post request with wish markers to post the Suggestion
  const addToWishlist = () => {
    console.log(currentSuggestion);
    console.log(user);
    /**
     * sugg values:[corresponding suggestion values will be below the first]
     * address, description,  latitude,  longitude, phoneNum, title
     * address, description, *latitude, *longitude, phoneNum, title, image (upVotes, downVotes = 0; timeAvailable coming soon:)
     * MUST ADD[latitude, longitude, isWished?, WishedUserId]
     */
    // gather the needed values and put them into an axios post request in a similar way to activities
    const { address, description, latitude, longitude, phoneNum, title } = currentSuggestion;

    const details = {
      data: {
        address,
        description,
        latitude,
        longitude,
        phoneNum,
        title,
        upVotes: 0,
        downVotes: 0,
      }
    }
    axios.post(`/api/suggestions/${user.id}`, details).then(() => { }).catch(err => console.error('unable to save suggestion', err))
  }

  const handleAddToActivities = () => {
    const details = {
      data: {
        address: currentSuggestion.address,
        description: currentSuggestion.description,
        phone: currentSuggestion.phoneNum,
        name: currentSuggestion.title,
      }
  }
  axios.post('/api/activity', details.data).then(() => {
    if (wishMode) {
      handleRemoveFromWishlist()
    }
  }).then(() => {
    if (wishMode) {
      getAllWishlistSuggestions();
    }
  }).catch((err) => {
    console.error('unable to change suggestion', err);
  })
}


const handleRemoveFromWishlist = () => {
  axios.patch(`/api/wishlist/${currentSuggestion.id}/${user.id}`)
  .then(() => {
    getAllWishlistSuggestions();
  })
  .catch((err) => console.error('sorry, tex', err));
}

  const handleExpansion = () => {
    toggleExpanded((prevExpanded) => !prevExpanded)



  }
  const { title, description, phoneNum, latitude, longitude, address, hours, image } = currentSuggestion;
  return (
    <Container>
      <Grid item size={6}>
        <Card>
          {/* <Typography variant="h3">Featurfefefefefeeefefefefefed Foray:</Typography> */}
          {/* <Button variant="filled">Next attraction</Button> */}
          <Button variant="filled" onClick={handleAddToActivities}>add to activities!</Button>
          {wishMode
          ?
          <Button onClick={handleRemoveFromWishlist}>Remove from wishlist</Button>
          :
          <Button onClick={addToWishlist} variant="filled">add to wishlist!</Button>
          }
          <ImageList>
            <ImageListItem key="ItemText" cols={4}>
              <ListItemText >
                <Typography variant="h2">
                  {title}
                </Typography>
              </ListItemText>
              <img width="50" height="50" src="https://static.vecteezy.com/system/resources/previews/002/187/723/original/coming-soon-neon-signs-style-text-free-vector.jpg"></img>
              <Typography>{description}</Typography>
              <Typography><b>Contact number:</b> {phoneNum}</Typography>
              <Typography><b>address:</b> {address}</Typography>
              {hours
                ? (
                  <Box>
                    <Typography><b>Hours of operation:</b></Typography>
                  </Box>

                ) : (
                  <Typography><em>Operation hours unavailable</em></Typography>
                )}
              <Accordion
                expanded={expanded}
                onChange={handleExpansion}
                slots={{ transition: Fade as AccordionSlots['transition'] }}
              //     sx={[
              //       expanded
              //  ? {
              //         [`& .${AccordionClasses.region}`]: {
              //           height: 'auto',
              //         },
              //         [`& .${accordionDetailsClasses.root}`]: {
              //           display: 'block',
              //         },
              //       }
              //       : {
              //         [`& .${accordionClasses.region}`]: {
              //           height: 0,
              //         },
              //         [`& .${accordionDetailsClasses.root}`]: {
              //           display: 'none',
              //         },
              //       }
              //     ]}
              >
                <Typography></Typography>
              </Accordion>
            </ImageListItem>
          </ImageList>
        </Card>

      </Grid>


    </Container >

  )
}
export default Suggestion;
