import React from 'react';
import { user } from '../../../types/models.ts';
import Dashboard from './Dashboard/DashboardMain';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { useUser } from './UserContext'
interface HomeProps {
  user: user;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const { localUser: contextUser } = useUser();
  const displayUsername = contextUser?.username || user?.username

  return (
    <Box>
      <Typography variant='h2' textTransform='none' align="center" color='black'>
        Hello, {displayUsername}!!!
      </Typography>
      <Box height={32} />
      <Dashboard user={user} />
    </Box>
  );
};

export default Home;