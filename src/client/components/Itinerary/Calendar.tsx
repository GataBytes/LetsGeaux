
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

//used to compare dates for range seletion
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore)
//passing date state for reusability 
export interface CalendarProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setStartDate: (date: Dayjs | null) => void;
  setEndDate: (date: Dayjs | null) => void;
  setSelectedDates: (dates: Date[]) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setSelectedDates,
}) => {
  // when both dates are selected, loop through every date in the range
  useEffect(() => {
    if (startDate && endDate) {
      const range: Date[] = [];
      let current = startDate;
      while (current.isSameOrBefore(endDate, 'day')) {
        range.push(current.toDate());
        current = current.add(1, 'day');
      }
      setSelectedDates(range);
    }
  }, [startDate, endDate, setSelectedDates]);

  // handles ppicking start date and end date, and reset then starting over
  const handleDateChange = (newDate: Dayjs | null) => {
    if (!newDate) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(newDate);
      setEndDate(null);
    } else if (newDate.isBefore(startDate, 'day')) {
      setStartDate(newDate);
      setEndDate(null);
    } else {
      setEndDate(newDate);
    }
  };

  // highlight eah day that falls in date range
  const CustomPickersDay = (props: PickersDayProps<Dayjs>) => {
    const { day, ...rest } = props;

    const isSelected =
      startDate &&
      endDate &&
      day.isSameOrAfter(startDate, 'day') &&
      day.isSameOrBefore(endDate, 'day');

    return (
      <PickersDay
        {...rest}
        day={day}
        selected={isSelected}
        sx={{
          backgroundColor: isSelected ? 'primary.main' : undefined,
          '&:hover': {
            backgroundColor: isSelected ? 'primary.light' : undefined,
          },
        }}
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <Typography variant="h5" align="center" gutterBottom>
          Choose Days For Trip
        </Typography>
        <Box display="flex" justifyContent="center" my={2}>
          <DateCalendar
            value={endDate || startDate}
            onChange={handleDateChange}
            views={['day']}
            slots={{ day: CustomPickersDay }}
          />
        </Box>
       
        {(startDate || endDate) && (
          <Box display="flex" gap={2} justifyContent="center" mt={2}>
            {startDate && (
              <MobileTimePicker
                label="Start Time"
                value={startDate}
                onChange={(newTime) => {
                  if (newTime) {
                    setStartDate(startDate.hour(newTime.hour()).minute(newTime.minute()));
                  }
                }}
                sx={{ width: 155 }}
                slotProps={{
                  textField: {
                    InputLabelProps: {
                      sx: { top: -9,
                        color: 'black', 
      '&.Mui-focused': {
        color: 'black' 
      }, 

                      }
                    }
                  },
                  actionBar: {
                    sx: {
                      '& .MuiButton-textPrimary': {
                        color: 'black', 
                      },
                    },
                  },
                }}
                
              />
            )}
            
            {endDate && (
              <MobileTimePicker
                label="End Time"
                value={endDate}
                onChange={(newTime) => {
                  if (newTime) {
                    setEndDate(endDate.hour(newTime.hour()).minute(newTime.minute()));
                  }
                }}
                
                sx={{ width: 155 }}
                slotProps={{
                  textField: {
                    InputLabelProps: {
                      sx: { top: -9,
                        color: 'black', 
      '&.Mui-focused': {
        color: 'black' 
      },
                       }
                    }
                  },
                  actionBar: {
                    sx: {
                      '& .MuiButton-textPrimary': {
                        color: 'black', 
                      },
                    },
                  },
                }}
              />
            )}
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default Calendar;
