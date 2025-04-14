// import React, { FC, useState, useEffect } from 'react';
// import axios from 'axios';
// import { Container, Card, Grid, Button, Typography } from '@mui/material';
// import Activity from './Activity';
// import ActivityForm from './ActivityForm';

// type ActivityType = {
//   id: string; // or number if that's how you're storing the ID in your DB
//   name: string;
//   description: string;
//   time: string;
//   date: string;
//   location: string;
//   image: string;
//   phone: string;
//   address: string;
//   itineraryId: number
// };

// const Activities: FC = () => {
//   const [activitySet, setActivitySet] = useState<ActivityType[]>([]);

//   useEffect(() => {
//     getAllActivities();
//   }, []);
//   return (
//     <Container>
//       <h2>Current Activities</h2>
//       {activitySet.map((act) => (
//         <Card key={act.id}>
//       <Activity
//       act={act}
//       getAllActivities={getAllActivities}
//       setEditMode={setEditMode}
//       setActivitySet={setActivitySet}
//       setEditableActivity={setEditableActivity}
//       />
//       </Card>
//       ))}
// <ActivityForm
// activitySet={activitySet}
// editMode={editMode}
// setEditMode={setEditMode}
// getAllActivities={getAllActivities}
// editableActivity={editableActivity}
// />
//     </Container>
//   )
// }

//   useEffect(() => {
//     getAllActivities();
//   }, []); // Fetch activities when the component mounts

//   return (
//     <Container>
//       <Typography variant="h4" gutterBottom>Current Activities</Typography>
//       <Grid container spacing={4}>
//         {activitySet.length > 0 ? (
//           activitySet.map((act) => (
//             <Grid item key={act.id}>
//               <Card>
//                 <Activity act={act} getAllActivities={getAllActivities} editMode={false} />
//               </Card>
//             </Grid>
//           ))
//         ) : (
//           <Typography>No activities found</Typography>
//         )}
//       </Grid>
//       <ActivityForm getAllActivities={getAllActivities} />
//     </Container>
//   );
// };

// export default Activities;
