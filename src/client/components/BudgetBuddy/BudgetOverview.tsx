import React, { useEffect, useState } from 'react';
import api from './api';
import {
  Typography,
  CircularProgress,
  LinearProgress,
  Box,
  Stack,
} from '@mui/material';

// Function to color the progress bar based on users budget usage
function getProgressColor(value: number): 'primary' | 'warning' | 'error' {
  if (value < 50) return 'primary';
  if (value < 85) return 'warning';
  return 'error';
}

// Budget object structure
interface BudgetEntry {
  id: number;
  category: string;
  notes: string;
  limit: number;
  spent?: number;
}

const BudgetOverview: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/budget')
      .then((res) => {
        console.log('Budget response:', res.data);

        //Force response into array (temporary workaround)
        const result = Array.isArray(res.data) ? res.data : [res.data];
        setBudgets(result);
      })
      .catch((err) => console.error('Fetch budget error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;

  if (budgets.length === 0) {
    return <Typography sx={{ m: 4 }}>No budget entries found.</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Budget Overview
      </Typography>

      {budgets.map((budget) => {
        const percent = budget.spent
          ? (budget.spent / budget.limit) * 100
          : 0;

        return (
          <Box
            key={budget.id}
            sx={{
              mb: 3,
              p: 2,
              border: '1px solid #ccc',
              borderRadius: 2,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="h6">{budget.category}</Typography>
            <Typography>{budget.notes}</Typography>
            <Typography variant="body2">
              ${budget.spent?.toFixed(2) || 0} of ${budget.limit}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={percent}
              color={getProgressColor(percent)}
              sx={{ height: 10, borderRadius: 5, mt: 1 }}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default BudgetOverview;