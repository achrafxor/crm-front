import React from 'react';
import { Box, Typography, Tooltip, alpha } from '@mui/material';
import type { CalendarTask } from '../../types';

interface TimeSlotProps {
    timeSlot: string;
    tasks: CalendarTask[];
    date: string;
    onTimeSlotClick: (date: string, timeSlot: string) => void;
    onTaskClick: (task: CalendarTask) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
    timeSlot,
    tasks,
    date,
    onTimeSlotClick,
    onTaskClick,
}) => {
    if (tasks.length === 0) {
        return null; // Don't render empty time slots
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
            }}
        >
            {tasks.map((task) => (
                <Tooltip
                    key={task.id}
                    title={
                        <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {task.title}
                            </Typography>
                            <Typography variant="caption">
                                {task.startTime} - {task.endTime}
                            </Typography>
                            {task.description && (
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                    {task.description}
                                </Typography>
                            )}
                        </Box>
                    }
                    arrow
                    placement="right"
                >
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task);
                        }}
                        sx={{
                            bgcolor: task.color || 'primary.main',
                            color: 'white',
                            p: 0.5,
                            borderRadius: 1,
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease-in-out',
                            borderLeft: `3px solid ${alpha('#fff', 0.5)}`,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                            '&:hover': {
                                opacity: 0.9,
                                transform: 'translateX(2px)',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            },
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                display: 'block',
                                mb: 0.25,
                            }}
                        >
                            {task.startTime}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '0.7rem',
                                display: 'block',
                                fontWeight: 500,
                            }}
                        >
                            {task.title}
                        </Typography>
                    </Box>
                </Tooltip>
            ))}
        </Box>
    );
};

export default TimeSlot;

