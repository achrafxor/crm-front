import React, { useState } from 'react';
import { Typography, Box, Button, IconButton, Paper } from '@mui/material';
import { Add, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useCalendar } from '../context/CalendarContext';
import MonthView from '../components/calendar/MonthView';
import TaskForm from '../components/calendar/TaskForm';
import type { CalendarTask } from '../types';

const Calendar = () => {
    const { tasks } = useCalendar();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<CalendarTask | undefined>(undefined);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setIsFormOpen(true);
    };

    const handleTimeSlotClick = (date: string, timeSlot: string) => {
        setSelectedDate(date);
        setSelectedTimeSlot(timeSlot);
        setIsFormOpen(true);
    };

    const handleTaskClick = (task: CalendarTask) => {
        setEditingTask(task);
        setSelectedDate(task.date);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingTask(undefined);
        setSelectedDate(null);
        setSelectedTimeSlot(null);
    };

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        onClick={handlePreviousMonth}
                        sx={{
                            bgcolor: 'background.paper',
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <ChevronLeft />
                    </IconButton>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            minWidth: { xs: '200px', sm: 'auto' },
                            textAlign: 'center',
                        }}
                    >
                        {monthNames[month]} {year}
                    </Typography>
                    <IconButton
                        onClick={handleNextMonth}
                        sx={{
                            bgcolor: 'background.paper',
                            border: 1,
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setSelectedDate(new Date().toISOString().split('T')[0]);
                        setIsFormOpen(true);
                    }}
                    sx={{
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4,
                        },
                    }}
                >
                    Nouvelle Tâche
                </Button>
            </Box>

            {/* Calendar */}
            <Paper
                elevation={2}
                sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <MonthView
                        year={year}
                        month={month}
                        tasks={tasks}
                        onDateClick={handleDateClick}
                        onTimeSlotClick={handleTimeSlotClick}
                        onTaskClick={handleTaskClick}
                    />
                </Box>
            </Paper>

            <TaskForm
                open={isFormOpen}
                onClose={handleClose}
                initialDate={selectedDate || undefined}
                initialTimeSlot={selectedTimeSlot || undefined}
                initialTask={editingTask}
            />
        </Box>
    );
};

export default Calendar;

