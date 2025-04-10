import React from 'react';

import Box from '@mui/material/Box';


import AddMember from './AddMember';
import CreateGroup from './CreateGroup';
import BudgetPieChart from '../BudgetBuddy/BudgetPieChart';

import { user } from '../../../../types/models.ts';

interface DashboardProps {
  user: user;
}


const Dashboard: React.FC<DashboardProps>= ({ user }) => {
  return (
    <Box>
      <CreateGroup user={user}/>
      <Box position= 'absolute' bottom = '10%'>
        <BudgetPieChart />
      </Box>
    </Box>
  )
};

export default Dashboard;