import React from 'react';
import { Paper, Typography, Box, Chip, alpha } from '@mui/material';
import type { CalendarTask } from '../../types';
import TimeSlot from './TimeSlot';

interface DayCellProps {
    day: number;
    date: string;
    dayOfWeek?: number | null;
    tasks: CalendarTask[];
    onDateClick: (date: string) => void;
    onTimeSlotClick: (date: string, timeSlot: string) => void;
    onTaskClick: (task: CalendarTask) => void;
}

const DayCell: React.FC<DayCellProps> = ({
    day,
    date,
    dayOfWeek,
    tasks,
    onDateClick,
    onTimeSlotClick,
    onTaskClick,
}) => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = date === todayStr;

    // Group tasks by hour for better display
    const tasksByHour = tasks.reduce((acc, task) => {
        const hour = task.startTime.split(':')[0];
        if (!acc[hour]) {
            acc[hour] = [];
        }
        acc[hour].push(task);
        return acc;
    }, {} as Record<string, CalendarTask[]>);

    // Sort tasks by start time
    const sortedTasks = tasks.sort((a, b) =>
        a.startTime.localeCompare(b.startTime)
    );

    return (
        <Paper
            elevation={isToday ? 3 : 0}
            sx={{
                minHeight: '140px',
                height: '100%',
                width: '100%',
                p: 0.75,
                border: isToday ? 2 : 1,
                borderColor: isToday ? 'primary.main' : 'divider',
                bgcolor: isToday
                    ? alpha('#1976d2', 0.08)
                    : 'background.paper',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    bgcolor: isToday
                        ? alpha('#1976d2', 0.12)
                        : 'action.hover',
                    transform: 'translateY(-2px)',
                    boxShadow: isToday ? 4 : 2,
                },
            }}
            onClick={() => onDateClick(date)}
        >
            {/* Day number header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0.75,
                    pb: 0.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                }}
            >
                <Typography
                    variant="body1"
                    fontWeight={isToday ? 'bold' : 600}
                    color={isToday ? 'primary.main' : 'text.primary'}
                    sx={{
                        fontSize: '0.95rem',
                    }}
                >
                    {day}
                </Typography>
                {tasks.length > 0 && (
                    <Chip
                        label={tasks.length}
                        size="small"
                        color="primary"
                        sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                        }}
                    />
                )}
            </Box>

            {/* Tasks list - auto-adjusts height based on number of tasks */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    mt: 0.5,
                    '&::-webkit-scrollbar': {
                        width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: alpha('#000', 0.2),
                        borderRadius: '2px',
                        '&:hover': {
                            background: alpha('#000', 0.3),
                        },
                    },
                }}
            >
                {sortedTasks.length > 0 ? (
                    sortedTasks.map((task) => (
                        <TimeSlot
                            key={task.id}
                            timeSlot={task.startTime}
                            tasks={[task]}
                            date={date}
                            onTimeSlotClick={onTimeSlotClick}
                            onTaskClick={onTaskClick}
                        />
                    ))
                ) : (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            fontSize: '0.7rem',
                            fontStyle: 'italic',
                            display: 'block',
                            textAlign: 'center',
                            mt: 1,
                        }}
                    >
                        Aucune tâche
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default DayCell;

