import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import api from './api';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

interface BudgetCategory {
  id: number;
  category: string;
  spent: number;
  notes?: string;
  limit?: number;
}

const BudgetPieChart: React.FC = () => {
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

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);

      const grouped = res.data.reduce((acc: Record<string, number>, curr: BudgetCategory) => {
        const key = curr.category?.trim() || `Category ${curr.id}`;
        acc[key] = (acc[key] || 0) + (curr.spent || 0);
        return acc;
      }, {});

      const transformed = Object.entries(grouped).map(([name, value]) => ({
        name,
        value,
      }));

      setChartData(transformed);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEditModal = (entry: BudgetCategory) => {
    setEditForm({
      id: entry.id,
      category: entry.category,
      spent: String(entry.spent || ''),
      limit: String(entry.limit || ''),
      notes: entry.notes || '',
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await api.put(`/${editForm.id}`, {
        category: editForm.category,
        limit: parseFloat(editForm.limit),
        spent: parseFloat(editForm.spent),
        notes: editForm.notes,
      });
      setEditOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
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
            })),
          }]}
          width={400}
          height={300}
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
                <Typography variant="body2">Notes: {entry.notes || 'None'}</Typography>
                <Box mt={1}>
                  <Button variant="outlined" size="small" onClick={() => openEditModal(entry)} sx={{ mr: 1 }}>
                    Update
                  </Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(entry.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>
      )}

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>All Budget Entries</Typography>
        {categories.length === 0 ? (
          <Typography>No entries yet.</Typography>
        ) : (
          categories.map((entry) => (
            <Box key={entry.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#eef' }}>
              <Typography><strong>Category:</strong> {entry.category || `Category ${entry.id}`}</Typography>
              <Typography><strong>Limit:</strong> ${entry.limit}</Typography>
              <Typography><strong>Spent:</strong> ${entry.spent}</Typography>
              <Typography><strong>Notes:</strong> {entry.notes || 'None'}</Typography>
              <Box mt={1}>
                <Button variant="outlined" size="small" onClick={() => openEditModal(entry)} sx={{ mr: 1 }}>
                  Update
                </Button>
                <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(entry.id)}>
                  Delete
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Budget Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Category"
            fullWidth
            margin="dense"
            value={editForm.category}
            disabled
          />
          <TextField
            label="Limit"
            type="number"
            fullWidth
            margin="dense"
            value={editForm.limit}
            onChange={(e) => setEditForm({ ...editForm, limit: e.target.value })}
          />
          <TextField
            label="Spent"
            type="number"
            fullWidth
            margin="dense"
            value={editForm.spent}
            onChange={(e) => setEditForm({ ...editForm, spent: e.target.value })}
          />
          <TextField
            label="Notes"
            fullWidth
            multiline
            margin="dense"
            value={editForm.notes}
            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetPieChart;