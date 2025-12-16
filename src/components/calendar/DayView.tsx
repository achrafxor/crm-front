import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { CalendarTask } from '../../types';
import TimeSlot from './TimeSlot';

interface DayViewProps {
  date: string; // YYYY-MM-DD
  tasks: CalendarTask[];
  onTimeSlotClick: (date: string, timeSlot: string) => void;
  onTaskClick: (task: CalendarTask) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00');

const DayView: React.FC<DayViewProps> = ({ date, tasks, onTimeSlotClick, onTaskClick }) => {
  // Group tasks by hour (startTime HH:mm)
  const tasksByHour = hours.reduce<Record<string, CalendarTask[]>>((acc, hourLabel) => {
    const hour = hourLabel.split(':')[0];
    acc[hour] = tasks.filter((t) => t.startTime.startsWith(hour));
    return acc;
  }, {});

  return (
    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
      {/* Hour column */}
      <Box sx={{ width: 72, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {hours.map((h) => (
          <Paper key={h} elevation={0} sx={{ p: 0.5, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" color="text.secondary">{h}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Timeline column */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {hours.map((h, idx) => {
          const hourKey = h.split(':')[0];
          const hourTasks = tasksByHour[hourKey] || [];
          return (
            <Paper
              key={h}
              elevation={0}
              sx={{
                p: 0.5,
                minHeight: 48,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0.5,
                borderBottom: 1,
                borderColor: 'divider',
              }}
              onClick={() => onTimeSlotClick(date, h)}
            >
              <Box sx={{ flex: 1 }}>
                {hourTasks.length > 0 ? (
                  <TimeSlot timeSlot={h} tasks={hourTasks} date={date} onTimeSlotClick={onTimeSlotClick} onTaskClick={onTaskClick} />
                ) : null}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default DayView;
