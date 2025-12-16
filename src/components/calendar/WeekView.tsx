import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import type { CalendarTask } from '../../types';
import TimeSlot from './TimeSlot';

interface WeekViewProps {
  startDate: string; // YYYY-MM-DD
  tasks: CalendarTask[];
  onTimeSlotClick: (date: string, timeSlot: string) => void;
  onTaskClick: (task: CalendarTask) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00');

const WeekView: React.FC<WeekViewProps> = ({ startDate, tasks, onTimeSlotClick, onTaskClick }) => {
  const start = new Date(startDate);
  const dayOfWeek = start.getDay();
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Monday start

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getTasksForDayAndHour = (date: string, hour: string): CalendarTask[] => {
    return tasks.filter(t => t.date === date && t.startTime.startsWith(hour.split(':')[0]));
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', gap: 1, minWidth: 'fit-content' }}>
        {/* Time column */}
        <Box sx={{ width: 72, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ height: 50 }} />
          {hours.map((h) => (
            <Paper key={h} elevation={0} sx={{ p: 0.5, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary">{h}</Typography>
            </Paper>
          ))}
        </Box>

        {/* Day columns */}
        {weekDays.map((date) => {
          const dateStr = formatDate(date);
          return (
            <Box key={dateStr} sx={{ minWidth: 150, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {/* Day header */}
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  height: 50,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'primary.light',
                  color: 'white',
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                </Typography>
                <Typography variant="h6">{date.getDate()}</Typography>
              </Paper>

              {/* Hour slots for day */}
              {hours.map((h) => {
                const dayTasks = getTasksForDayAndHour(dateStr, h);
                return (
                  <Paper
                    key={`${dateStr}-${h}`}
                    elevation={0}
                    sx={{
                      p: 0.5,
                      minHeight: 48,
                      display: 'flex',
                      alignItems: 'flex-start',
                      borderBottom: 1,
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => onTimeSlotClick(dateStr, h)}
                  >
                    <Box sx={{ flex: 1, width: '100%' }}>
                      {dayTasks.length > 0 ? (
                        <TimeSlot
                          timeSlot={h}
                          tasks={dayTasks}
                          date={dateStr}
                          onTimeSlotClick={onTimeSlotClick}
                          onTaskClick={onTaskClick}
                        />
                      ) : null}
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default WeekView;
