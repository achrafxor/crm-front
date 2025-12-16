import React, { useState } from 'react';
import { Typography, Box, Button, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Add, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useCalendar } from '../context/CalendarContext';
import MonthView from '../components/calendar/MonthView';
import WeekView from '../components/calendar/WeekView';
import DayView from '../components/calendar/DayView';
import TaskForm from '../components/calendar/TaskForm';
import type { CalendarTask } from '../types';

const Calendar = () => {
    const { tasks } = useCalendar();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<CalendarTask | undefined>(undefined);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePreviousMonth = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(year, month - 1, 1));
        } else if (viewMode === 'week') {
            setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
        } else {
            setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
        }
    };

    const handleNextMonth = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(year, month + 1, 1));
        } else if (viewMode === 'week') {
            setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
        } else {
            setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
        }
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

            {/* View mode selector */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(e, newMode) => newMode && setViewMode(newMode)}
                    sx={{ bgcolor: 'background.paper', boxShadow: 1 }}
                >
                    <ToggleButton value="month">Mois</ToggleButton>
                    <ToggleButton value="week">Semaine</ToggleButton>
                    <ToggleButton value="day">Jour</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Calendar */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'auto',
                }}
            >
                <Box sx={{ width: '100%' }}>
                    {viewMode === 'month' && (
                        <MonthView
                            year={year}
                            month={month}
                            tasks={tasks}
                            onDateClick={handleDateClick}
                            onTimeSlotClick={handleTimeSlotClick}
                            onTaskClick={handleTaskClick}
                        />
                    )}
                    {viewMode === 'week' && (
                        <WeekView
                            startDate={currentDate.toISOString().split('T')[0]}
                            tasks={tasks}
                            onTimeSlotClick={handleTimeSlotClick}
                            onTaskClick={handleTaskClick}
                        />
                    )}
                    {viewMode === 'day' && (
                        <DayView
                            date={currentDate.toISOString().split('T')[0]}
                            tasks={tasks}
                            onTimeSlotClick={handleTimeSlotClick}
                            onTaskClick={handleTaskClick}
                        />
                    )}
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

