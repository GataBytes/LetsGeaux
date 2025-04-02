import React from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import BudgetOverview from './BudgetOverview';
import BudgetForm from './BudgetForm';
import BudgetPieChart from './BudgetPieChart';

//layout for budget page
//keep track of organizing sub components
const BudgetBuddy: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
    <Typography variant="h3" gutterBottom align="center">
      Budget Buddy
    </Typography>

    <Box sx={{ my: 3 }}>
      <Paper elevation={6} sx={{ p: 4, transition: 'transform .3s', '&:hover': { transform: 'scale(1.03)' } }}>
        <BudgetOverview />
      </Paper>
    </Box>

    <Box sx={{ my: 3 }}>
      <Paper elevation={6} sx={{ p: 4, transition: 'transform .3s', '&:hover': { transform: 'scale(1.03)' } }}>
        <BudgetForm />
      </Paper>
    </Box>

    <Box sx={{ my: 3 }}>
      <Paper elevation={6} sx={{ p: 4, transition: 'transform .3s', '&:hover': { transform: 'scale(1.03)' } }}>
        <BudgetPieChart />
      </Paper>
    </Box>
  </Container>
  );
};

export default BudgetBuddy;
