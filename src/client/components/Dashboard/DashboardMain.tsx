import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography
} from '@mui/material';
// import Divider from '@mui/material/Divider';
import CreateParty from './CreateParty';
// import BudgetPieChart from './BudgetPieChart'
import { user, userParty } from '../../../../types/models.ts';
import { useMedia } from '../MediaQueryProvider.tsx';
// import ImageUpload from '../ImageUpload';
import ImageDisplay from '../ImageDisplay';
interface DashboardProps {
  user: user;
}
interface party {
  id: number;
  name: string;
}
const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [partyInfo, setPartyInfo] = useState<{ id: number, name: string }[]>([])
  const userId = user.id
  const { isMobile } = useMedia(); 

  useEffect(() => {
    getUserParties();
  }, [userId])

  const getUserParties = async () => {
    // console.log(userId)
    try {
      let response = await axios.get<userParty[]>(`api/party/userParty/${userId}`);
      const parties = response.data; // userParty array
      const partyIds = parties.map((party) => {
        return party.partyId
      })
      getPartyNames(partyIds);
    } catch (error) {
      console.error('Failed to find parties for this user');
    };
  };

  const getPartyNames = async (partyIds: number[]) => {
    try {
      const requests = partyIds.map(id =>
        axios.get<party>(`/api/party/${id}`)
      );
      const responses = await Promise.all(requests);
      const names = responses.map((res) => ({
        id: res.data.id,
        name: res.data.name
      }));
      // console.log(names);
      setPartyInfo(names);
    } catch (error) {
      console.error('Could not find names for one or all partyIds')
    };
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 4,
        gap: 6 // spacing between the boxes
      }}
    >
      {/* Travel Parties Box */}
      
      <Box
        sx={{
          align: 'center',
          border: '4px solid black',
          borderRadius: 4,
          boxShadow: '2px 2px 0px black',
          m: 1,
          padding: 2,
          maxWidth: 400,
          width: isMobile? '91.5%' : '100%',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ mb: 1, padding: 1 }} variant='h4'>Your Travel Parties</Typography>
        {partyInfo.map((selectedParty) => (
          <Box key={selectedParty.id} sx={{ mt: 1, padding: .5 }}>
            <Link to={`/${selectedParty.id}`}>
            {/* <Link to={`/${selectedParty.id}?name=${encodeURIComponent(selectedParty.name)}`}> */}
              <Typography variant='h4' color='black'>
                {selectedParty.name}
              </Typography>
            </Link>
          </Box>
        ))}
        <Box sx={{ mt: 2, mb: 0 }} >
          <CreateParty user={user} onPartyCreated={getUserParties} />
        </Box>
      </Box>
  
      {/* Image Upload Box */}
      <Box
      // sx={{
      //   border: '4px solid black',
      //   borderRadius: 4,
      //   padding: 4,
      //   maxWidth: 400,
      //   width: '100%',
      //   textAlign: 'center',
      // }}
      >
        {/* <ImageUpload userId={user.id} /> */}
        <ImageDisplay userId={user.id} />
      </Box>
    </Box>
  )
};

export default Dashboard;