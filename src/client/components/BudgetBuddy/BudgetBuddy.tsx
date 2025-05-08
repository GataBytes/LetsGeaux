import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';
import { useMedia } from '../MediaQueryProvider'; // used for responsive px/py

import BudgetOverview from './BudgetOverview';
import BudgetForm from './BudgetForm';
import BudgetPieChart from './BudgetPieChart';
import api from './api';
import BudgetPDFPrintout from './BudgetPDFPrintout';

const BudgetBuddy: React.FC = () => {
  const { isMobile } = useMedia(); // detect mobile for spacing
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(null);

  // budgets state to store fetched budget entries
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loadingBudgets, setLoadingBudgets] = useState<boolean>(false);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const res = await api.get('/itinerary');
        setItineraries(res.data);
      } catch (err) {
        console.error('Failed to fetch itineraries:', err);
        setItineraries([]);
      }
    };
    fetchItineraries();
  }, []);

  // fetch budgets when selection changes
  useEffect(() => {
    const fetchBudgets = async () => {
      if (!selectedItineraryId) return;
      setLoadingBudgets(true);
      try {
        const res = await api.get(`/budget?partyId=${selectedItineraryId}`);
        setBudgets(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.error('Failed to fetch budgets:', err);
        setBudgets([]);
      } finally {
        setLoadingBudgets(false);
      }
    };
    fetchBudgets();
  }, [selectedItineraryId]);

  // compute totals
  const currentBudget = budgets.reduce((acc, b) => acc + (Number(b.spent) || 0), 0);
  const budgetBreakdown = budgets.map((b) => ({
    name: b.category,
    spent: Number(b.spent) || 0,
    limit: Number(b.limit),
  }));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#c4a1ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: isMobile ? 2 : 4,
      }}
    >
      <Container
        maxWidth="md"
        component={Box}
        sx={{
          backgroundColor: '#fff',
          border: '2px solid black',
          boxShadow: '4px 4px 0px black',
          borderRadius: isMobile ? 2 : 4,
          p: isMobile ? 2 : 4,
        }}
      >
        <Typography variant="h6" gutterBottom align="center">
          Budget Buddy
        </Typography>

        {/* Itinerary selection */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ mb: 1, fontWeight: 'bold' }}>Select Itinerary</Typography>
          <FormControl fullWidth>
            <Select
              value={selectedItineraryId ?? ''}
              onChange={(e) => setSelectedItineraryId(Number(e.target.value))}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Choose an itinerary...
              </MenuItem>
              {itineraries.map((it) => (
                <MenuItem key={it.id} value={it.id}>
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Budget Overview Section*/}
        <Box sx={{ my: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: isMobile ? 2 : 4,
              backgroundColor: '#fff085',
              border: '2px solid black',
              boxShadow: '2px 2px 0px black',
              borderRadius: 2,
            }}
          >
            <BudgetOverview selectedItineraryId={selectedItineraryId} />
          </Paper>
        </Box>

        {/* Budget Form Section */}
        <Box sx={{ my: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: isMobile ? 2 : 4,
              backgroundColor: '#c4a1ff',
              border: '2px solid black',
              boxShadow: '2px 2px 0px black',
              borderRadius: 2,
            }}
          >
            <BudgetForm selectedItineraryId={selectedItineraryId} />
          </Paper>
        </Box>

        {/* Budget Pie Chart Section */}
        <Box sx={{ my: 3 }}>
          <Paper
            variant="outlined"
            sx={{
              p: isMobile ? 2 : 4,
              backgroundColor: '#E0E0E0',
              border: '2px solid black',
              boxShadow: '2px 2px 0px black',
              borderRadius: 2,
            }}
          >
            <BudgetPieChart selectedItineraryId={selectedItineraryId} />
          </Paper>
        </Box>

        {/* PDF Printout Section */}
        {selectedItineraryId && (
          <Box sx={{ my: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: isMobile ? 2 : 4,
                backgroundColor: '#E0E0E0',
                border: '2px solid black',
                boxShadow: '2px 2px 0px black',
                borderRadius: 2,
              }}
            >
              <BudgetPDFPrintout
                itinerary={itineraries.find((it) => it.id === selectedItineraryId) || { name: 'Unknown Trip' }}
                budgetBreakdown={budgetBreakdown}
                currentBudget={currentBudget}
              />
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BudgetBuddy;
