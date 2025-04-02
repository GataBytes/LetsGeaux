// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   Container,
//   Box,
//   SpeedDial,
//   SpeedDialAction,
//   SpeedDialIcon,
//   Button,
//   Card,
//   CardMedia,
//   Stack,
//   Fade,
//   Accordion,
//   AccordionClasses,
//   AccordionSummary,
//   Typography,
//   AccordionDetails,
//   accordionDetailsClasses,
//   Dialog,
//   Grid,
//   Avatar,
//   ImageList,
//   ImageListItem,
//   ListItemText,
// } from '@mui/material';
// import { AddToQueueRounded, ArrowForwardIos } from '@mui/icons-material'

// /**
//  * When the "add to itinerary" speed dial  button is pressed, the associated function will:
//  * Save the suggestion info to the database
//  * Take the necessary info for the activity form as props
//  * Move those props to the activity form component
//  * autofill that info into the form
//  * STRETCH: highlight the other fields that need to be filled in
//  *
//  * Future: need to set up conditionals for voting icons in speed dial. Don't show if suggestion isn't saved. Disable if unauthorized to vote

// Faded translucent accordion to be set by lunch tomorrow.  [https://mui.com/material-ui/react-accordion/]

// */


// // const Grid = Grid2;
// const Suggestion = () => {
//   const [expanded, toggleExpanded] = useState(false);

//   const handleExpansion = () => {
//     toggleExpanded((prevExpanded) => !prevExpanded)



//   }
//   return (
//     <Container>
//       <Grid item size={6}>
//         <Card>
//           <Typography variant="h3">Featured Foray:</Typography>
//           <Button variant="filled">Next attraction</Button>
//           <Button variant="filled">add to activities</Button>
//           <ImageList>
//             <ImageListItem key="ItemText" cols={4}>
//               <ListItemText >
//                 <Typography variant="h2">
//                   New Orleans Jazz Museum
//                 </Typography>
//               </ListItemText>
//               <img src="https://media-cdn.tripadvisor.com/media/photo-o/0b/92/b7/85/20160608-102742-largejpg.jpg"></img>
//               <Box></Box>
//               <Accordion
//                 expanded={expanded}
//                 onChange={handleExpansion}
//                 slots={{ transition: Fade as AccordionSlots['transition'] }}
//             //     sx={[
//             //       expanded
//             //  ? {
//             //         [`& .${AccordionClasses.region}`]: {
//             //           height: 'auto',
//             //         },
//             //         [`& .${accordionDetailsClasses.root}`]: {
//             //           display: 'block',
//             //         },
//             //       }
//             //       : {
//             //         [`& .${accordionClasses.region}`]: {
//             //           height: 0,
//             //         },
//             //         [`& .${accordionDetailsClasses.root}`]: {
//             //           display: 'none',
//             //         },
//             //       }
//             //     ]}
//           >
//               <Typography variant="h4">The New Orleans Jazz Museum celebrates jazz in the city where it was born. Through dynamic interactive exhibits, multi-generational educational programming, research facilities, and engaging musical performances, the music New Orleans made famous is explored in all its forms. Housed in the historic Old U.S. Mint, strategically located at the intersection of the French Quarter and the Frenchmen Street live music corridor, the New Orleans Jazz Museum is in the heart of the city’s music scene.</Typography>
//             </Accordion>
//           </ImageListItem>
//         </ImageList>
//       </Card>

//     </Grid>


//     </Container >

//   )
// }
// export default Suggestion;
