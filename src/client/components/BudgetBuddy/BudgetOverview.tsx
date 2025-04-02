import React, { useEffect, useState } from 'react';
import api from './api';
import { Typography, CircularProgress } from '@mui/material';

// Display current budget summary
const BudgetOverview: React.FC = () => {
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    api.get('/')
      .then(res => setBudget(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!budget) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5">
        Total: {budget.totalBudget} {budget.currency}
      </Typography>
      <Typography>{budget.notes}</Typography>
    </>
  );
};

export default BudgetOverview;