import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import type { CalendarTask } from '../../types';
import DayCell from './DayCell';

interface MonthViewProps {
    year: number;
    month: number;
    tasks: CalendarTask[];
    onDateClick: (date: string) => void;
    onTimeSlotClick: (date: string, timeSlot: string) => void;
    onTaskClick: (task: CalendarTask) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
    year,
    month,
    tasks,
    onDateClick,
    onTimeSlotClick,
    onTaskClick,
}) => {
    // Create date objects with proper timezone handling
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    // getDay() returns 0 (Sunday) to 6 (Saturday)
    const startingDayOfWeek = firstDay.getDay();

    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const weekDaysShort = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    // Build calendar grid: 7 columns (one for each day of week)
    // Each row represents a week
    const weeks: (number | null)[][] = [];

    // Start with empty cells for days before the first day of the month
    let currentWeek: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        currentWeek.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day);

        // When we reach 7 days, start a new week
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // Add remaining empty cells for the last week if needed
    while (currentWeek.length < 7 && currentWeek.length > 0) {
        currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const formatDate = (day: number): string => {
        const date = new Date(year, month, day);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    // Verify day of week for a given day
    const getDayOfWeek = (day: number): number => {
        const date = new Date(year, month, day);
        return date.getDay();
    };

    return (
        <Box sx={{ width: '100%', mx: 0 }}>
            {/* Week day headers - fixed width columns */}
            <Grid container spacing={0.25} sx={{ mb: 0.5, width: '100%', mx: 0 }}>
                {weekDays.map((dayName, index) => (
                    <Grid
                        item
                        xs
                        key={dayName}
                        sx={{
                            textAlign: 'center',
                            py: 1.5,
                            flex: '1 1 0%',
                            minWidth: 0,
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            {weekDaysShort[index]}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Calendar weeks - each week in a row with proper column alignment */}
            {weeks.map((week, weekIndex) => (
                <Grid
                    container
                    spacing={0.25}
                    key={weekIndex}
                    sx={{
                        mb: 0.25,
                        width: '100%',
                        mx: 0,
                        alignItems: 'stretch', // All cells in row have same height
                    }}
                >
                    {week.map((day, dayIndex) => {
                        // Verify this day is in the correct column
                        let actualDayOfWeek: number | null = null;
                        if (day !== null) {
                            actualDayOfWeek = getDayOfWeek(day);
                        }

                        return (
                            <Grid
                                item
                                xs
                                key={`${weekIndex}-${dayIndex}`}
                                sx={{
                                    minHeight: '140px',
                                    flex: '1 1 0%',
                                    minWidth: 0,
                                    display: 'flex',
                                }}
                            >
                                {day !== null ? (
                                    <DayCell
                                        day={day}
                                        date={formatDate(day)}
                                        dayOfWeek={actualDayOfWeek}
                                        tasks={tasks.filter(t => t.date === formatDate(day))}
                                        onDateClick={onDateClick}
                                        onTimeSlotClick={onTimeSlotClick}
                                        onTaskClick={onTaskClick}
                                    />
                                ) : (
                                    <Paper
                                        sx={{
                                            minHeight: '140px',
                                            height: '100%',
                                            width: '100%',
                                            bgcolor: 'grey.50',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    />
                                )}
                            </Grid>
                        );
                    })}
                </Grid>
            ))}
        </Box>
    );
};

export default MonthView;

