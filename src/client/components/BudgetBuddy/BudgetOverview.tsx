import React, { useEffect, useState } from 'react';
import api from './api';
import {
  Typography,
  CircularProgress,
  LinearProgress,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

function getProgressColor(value: number): 'primary' | 'warning' | 'error' {
  if (value < 50) return 'primary';
  if (value < 85) return 'warning';
  return 'error';
}

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

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<BudgetEntry | null>(null);
  const [editForm, setEditForm] = useState({ category: '', limit: '', notes: '', spent: '' });

  useEffect(() => {
    api
      .get('/budget')
      .then((res) => {
        const result = Array.isArray(res.data) ? res.data : [res.data];
        setBudgets(result);
      })
      .catch((err) => console.error('Fetch budget error:', err))
      .finally(() => setLoading(false));
  }, []);

  const openEditModal = (budget: BudgetEntry) => {
    setSelectedBudget(budget);
    setEditForm({
      category: budget.category,
      limit: budget.limit.toString(),
      notes: budget.notes,
      spent: budget.spent?.toString() || '0'
    });
    setEditOpen(true);
  };

  const openDeleteModal = (budget: BudgetEntry) => {
    setSelectedBudget(budget);
    setDeleteOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedBudget) return;
    api.put(`/budget/${selectedBudget.id}`, {
      ...editForm,
      limit: parseFloat(editForm.limit),
      spent: parseFloat(editForm.spent),
    })
      .then(() => {
        setEditOpen(false);
        refreshBudgets();
      })
      .catch((err) => console.error('Update failed:', err));
  };

  const handleDeleteConfirm = () => {
    if (!selectedBudget) return;
    api.delete(`/budget/${selectedBudget.id}`)
      .then(() => {
        setDeleteOpen(false);
        refreshBudgets();
      })
      .catch((err) => console.error('Delete failed:', err));
  };

  const refreshBudgets = () => {
    setLoading(true);
    api.get('/budget')
      .then((res) => setBudgets(Array.isArray(res.data) ? res.data : [res.data]))
      .finally(() => setLoading(false));
  };

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (budgets.length === 0) return <Typography sx={{ m: 4 }}>No budget entries found.</Typography>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Budget Overview</Typography>

      {budgets.map((budget) => {
        const percent = budget.spent ? (budget.spent / budget.limit) * 100 : 0;

        return (
          <Box
            key={budget.id}
            sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}
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
            <Stack direction="row" spacing={1} mt={2}>
              <Button size="small" variant="outlined" onClick={() => openEditModal(budget)}>Edit</Button>
              <Button size="small" variant="outlined" color="error" onClick={() => openDeleteModal(budget)}>Delete</Button>
            </Stack>
          </Box>
        );
      })}

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent>
          <TextField
            label="Category"
            fullWidth
            margin="normal"
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          />
          <TextField
            label="Limit"
            type="number"
            fullWidth
            margin="normal"
            value={editForm.limit}
            onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })}
          />
          <TextField
            label="Spent"
            type="number"
            fullWidth
            margin="normal"
            value={editForm.spent}
            onChange={(e) => setEditForm({ ...editForm, spent: e.target.value })}
          />
          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            multiline
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this budget entry?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetOverview;