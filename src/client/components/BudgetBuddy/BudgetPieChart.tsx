import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import api from './api';
import {
  Box,
  Typography,
  IconButton,      //bring in IconButton
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip
} from '@mui/material';
// Import PiTrash icon from react icons
import { PiTrash } from 'react-icons/pi';

interface BudgetCategory {
  id: number;
  category: string;
  spent: number;
  notes?: string;
  limit?: number;
}

interface Props {
  selectedItineraryId: number | null;
}

const BudgetPieChart: React.FC<Props> = ({ selectedItineraryId }) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    category: '',
    spent: '',
    limit: '',
    notes: ''
  });

  const [updatedId, setUpdatedId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/budget/categories', {
        params: { partyId: selectedItineraryId }
      });
      setCategories(res.data);
      const grouped = res.data.reduce((acc: Record<string, number>, curr: BudgetCategory) => {
        const key = curr.category?.trim() || `Category ${curr.id}`;
        acc[key] = (acc[key] || 0) + (curr.spent || 0);
        return acc;
      }, {});
      setChartData(
        Object.entries(grouped).map(([name, value]) => ({ name, value }))
      );
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    if (selectedItineraryId) fetchCategories();
  }, [selectedItineraryId]);

  const openEditModal = (entry: BudgetCategory) => {
    setEditForm({
      id: entry.id,
      category: entry.category,
      spent: String(entry.spent ?? ''),
      limit: String(entry.limit ?? ''),
      notes: entry.notes || '',
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/budget/${editForm.id}`, {
        category: editForm.category,
        limit: parseFloat(editForm.limit),
        spent: parseFloat(editForm.spent),
        notes: editForm.notes,
      });
      setEditOpen(false);
      setUpdatedId(editForm.id);
      fetchCategories();
      setTimeout(() => setUpdatedId(null), 2000);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/budget/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  if (!selectedItineraryId) {
    return <Typography sx={{ mt: 4 }}>Select an itinerary to view budget distribution.</Typography>;
  }

  return (
    <Box sx={{ width: '100%', mt: 8 }}>
      <Typography variant="h6" gutterBottom>Budget Distribution</Typography>

      {chartData.length === 0 ? (
        <Typography>No budget data yet.</Typography>
      ) : (
        <PieChart
          series={[{
            data: chartData.map((item, index) => ({
              id: index,
              value: item.value,
              label: item.name,
              connectorLength: 20        //improve label spacing
            })),
          }]}
          width={500}
          height={400}
          onClick={(e) => {
            if (e?.name) setSelectedCategory(e.name);
          }}
          slotProps={{ legend: { hidden: false } }}
        />
      )}

      {selectedCategory && (
        <Box mt={3}>
          <Typography variant="h6">Entries for: {selectedCategory}</Typography>
          {categories
            .filter((entry) => (entry.category?.trim() || `Category ${entry.id}`) === selectedCategory)
            .map((entry) => (
              <Box key={entry.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                <Typography variant="body1">Spent: ${entry.spent}</Typography>
                <Typography variant="body2">Limit: ${entry.limit}</Typography>
                <Typography variant="body2">Notes: {entry.notes || 'None'}</Typography>
                <Box mt={1}>
                  {/* use PiTrash for delete instead of text button */}
                  <IconButton
                    aria-label="delete entry"
                    color="error"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <PiTrash size={20} />
                  </IconButton>
                  {updatedId === entry.id && <Chip label="Updated!" color="success" size="small" sx={{ ml: 1 }} />}
                </Box>
              </Box>
            ))}
        </Box>
      )}

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Budget Entry</DialogTitle>
        <DialogContent sx={{ pt: 2, pb: 2 }}>
          {/* added padding so labels don’t overlap */}
          <TextField
            label="Category"
            fullWidth
            margin="dense"
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            label="Limit"
            type="number"
            fullWidth
            margin="dense"
            value={editForm.limit}
            onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Spent"
            type="number"
            fullWidth
            margin="dense"
            value={editForm.spent}
            onChange={(e) => setEditForm({ ...editForm, spent: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Notes"
            fullWidth
            margin="dense"
            multiline
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} sx={{ color: 'black' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetPieChart;
