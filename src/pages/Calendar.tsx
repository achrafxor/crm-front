import { useState } from 'react';
import { Typography, Box, Button, IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Add, ChevronLeft, ChevronRight, CalendarToday } from '@mui/icons-material';
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

    const handlePrevious = () => {
        if (viewMode === 'month') {
            setCurrentDate(new Date(year, month - 1, 1));
        } else if (viewMode === 'week') {
            setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
        } else {
            setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
        }
    };

    const handleNext = () => {
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

    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    const formatDate = (date: Date): string => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getWeekRange = () => {
        const start = new Date(currentDate);
        const day = start.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        start.setDate(start.getDate() + diff);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.getDate()} ${monthNames[start.getMonth()].slice(0, 3)} ${start.getFullYear()} - ${end.getDate()} ${monthNames[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
    };

    const getHeaderTitle = () => {
        if (viewMode === 'month') {
            return `${monthNames[month]} ${year}`;
        } else if (viewMode === 'week') {
            return getWeekRange();
        } else {
            return `${currentDate.getDate()} ${monthNames[month]} ${year} ${dayNames[currentDate.getDay()]}`;
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 0,
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    borderRadius: 0,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
                    <Typography variant="h6" sx={{ fontWeight: 500, color: 'text.primary' }}>
                        Mon Calendrier
                    </Typography>
                </Box>

                {/* View Toggle */}
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                    sx={{
                        bgcolor: '#f5f5f5',
                        borderRadius: '20px',
                        '& .MuiToggleButton-root': {
                            border: 'none',
                            borderRadius: '20px',
                            px: 3,
                            py: 0.5,
                            textTransform: 'none',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                bgcolor: 'white',
                                color: 'text.primary',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                '&:hover': {
                                    bgcolor: 'white',
                                },
                            },
                        },
                    }}
                >
                    <ToggleButton value="day">Jour</ToggleButton>
                    <ToggleButton value="week">Semaine</ToggleButton>
                    <ToggleButton value="month">Mois</ToggleButton>
                </ToggleButtonGroup>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        setSelectedDate(formatDate(new Date()));
                        setIsFormOpen(true);
                    }}
                    sx={{
                        bgcolor: '#2196f3',
                        borderRadius: '6px',
                        px: 3,
                        py: 1,
                        fontWeight: 500,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#1976d2',
                            boxShadow: 'none',
                        },
                    }}
                >
                    Créer
                </Button>
            </Paper>

            {/* Sub-header with date and navigation */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday sx={{ color: 'text.secondary', fontSize: 18 }} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {getHeaderTitle()}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                        onClick={handlePrevious}
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '4px',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <ChevronLeft fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleNext}
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '4px',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <ChevronRight fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            {/* Calendar Content */}
            <Box sx={{ bgcolor: 'background.paper', minHeight: 'calc(100vh - 250px)' }}>
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
                        startDate={formatDate(currentDate)}
                        tasks={tasks}
                        onTimeSlotClick={handleTimeSlotClick}
                        onTaskClick={handleTaskClick}
                    />
                )}
                {viewMode === 'day' && (
                    <DayView
                        date={formatDate(currentDate)}
                        tasks={tasks}
                        onTimeSlotClick={handleTimeSlotClick}
                        onTaskClick={handleTaskClick}
                    />
                )}
            </Box>

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
