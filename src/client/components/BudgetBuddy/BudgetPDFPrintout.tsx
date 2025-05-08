import React, { useRef } from 'react';
import { Button, Typography, Box } from '@mui/material';
import jsPDF from 'jspdf';
//import team logo
import logo from '../../../../dist/images/cropedLogo.b76a2a6588ff3c85caf6472b9b9b2477.png';

interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
}

interface BudgetPDFPrintoutProps {
  itinerary: { name: string };
  budgetBreakdown: BudgetCategory[];
  currentBudget: number;
}

const BudgetPDFPrintout: React.FC<BudgetPDFPrintoutProps> = ({ itinerary, budgetBreakdown, currentBudget }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    if (printRef.current) {
      const pdf = new jsPDF('p', 'pt', 'a4');
      await pdf.html(printRef.current, {
        callback: function (doc) {
          doc.save(`${itinerary.name} Budget.pdf`);
        },
        x: 10,
        y: 10,
        width: pdf.internal.pageSize.getWidth() - 20,
      });
    }
  };

  return (
    <Box>
      {/* button to trigger PDF generation */}
      <Button variant="contained" onClick={handleGeneratePDF} sx={{ mb: 2 }}>
        Generate PDF
      </Button>
      {/* this box is the area captured for the PDF */}
      <Box
        ref={printRef}
        sx={{
          padding: 2,
          maxWidth: 600,          // constrain width
          margin: '0 auto',       // center on page
          backgroundColor: '#f9f9f9',
          color: 'black',
          border: '1px solid #ccc'
        }}
      >
        {/* render team logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <img src={logo} alt="Team Logo" style={{ maxWidth: 100 }} />
        </Box>

        {/* itinerary title (printed at top of PDF) */}
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
          {itinerary.name}
        </Typography>

        {/* budget Breakdown by Category */}
        <Typography variant="h8" sx={{ mb: 1 }}>
          Budget Breakdown:
        </Typography>
        {budgetBreakdown.map((cat) => (
          <Box key={cat.name} sx={{ my: 1 }}>
            <Typography variant="subtitle1">{cat.name}</Typography>
            <Typography variant="body2">
              Spent: ${cat.spent.toFixed(2)} | Limit: ${cat.limit.toFixed(2)}
            </Typography>
          </Box>
        ))}

        {/* current Budget Summary */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h8">
            Current Budget in Total: ${currentBudget.toFixed(2)}
          </Typography>
        </Box>

        {/* timestamp printed at the bottom */}
        <Typography variant="caption" sx={{ mt: 4, display: 'block', textAlign: 'center' }}>
          Generated on: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default BudgetPDFPrintout;
