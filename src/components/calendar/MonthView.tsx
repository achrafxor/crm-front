import React from 'react';
import { Box, Typography } from '@mui/material';
import type { CalendarTask } from '../../types';

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
    onTaskClick,
}) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weekDays = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];
    
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    for (let i = 0; i < adjustedStartDay; i++) {
        currentWeek.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    while (currentWeek.length < 7 && currentWeek.length > 0) {
        currentWeek.push(null);
    }
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    const formatDate = (day: number): string => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const getTasksForDay = (day: number) => {
        return tasks.filter(t => t.date === formatDate(day));
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Day Headers */}
            <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
                {weekDays.map((day, index) => (
                    <Box
                        key={day}
                        sx={{
                            flex: 1,
                            py: 1.5,
                            textAlign: 'center',
                            borderRight: index < 6 ? '1px solid' : 'none',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: index >= 5 ? '#e91e63' : 'text.secondary',
                                letterSpacing: '0.5px',
                            }}
                        >
                            {day}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Calendar Grid */}
            {weeks.map((week, weekIndex) => (
                <Box
                    key={weekIndex}
                    sx={{
                        display: 'flex',
                        minHeight: '120px',
                        borderBottom: weekIndex < weeks.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                    }}
                >
                    {week.map((day, dayIndex) => {
                        const dateStr = day ? formatDate(day) : '';
                        const isToday = dateStr === todayStr;
                        const dayTasks = day ? getTasksForDay(day) : [];
                        const isWeekend = dayIndex >= 5;

                        return (
                            <Box
                                key={`${weekIndex}-${dayIndex}`}
                                onClick={() => day && onDateClick(dateStr)}
                                sx={{
                                    flex: 1,
                                    p: 1,
                                    borderRight: dayIndex < 6 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                    bgcolor: day ? 'transparent' : '#fafafa',
                                    cursor: day ? 'pointer' : 'default',
                                    '&:hover': day ? { bgcolor: '#f5f5f5' } : {},
                                    position: 'relative',
                                }}
                            >
                                {day && (
                                    <>
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: isToday ? 28 : 'auto',
                                                height: isToday ? 28 : 'auto',
                                                borderRadius: '50%',
                                                bgcolor: isToday ? '#2196f3' : 'transparent',
                                                color: isToday ? 'white' : isWeekend ? '#e91e63' : 'text.primary',
                                                mb: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: isToday ? 600 : 400,
                                                    fontSize: '0.875rem',
                                                }}
                                            >
                                                {day}
                                            </Typography>
                                        </Box>

                                        {/* Tasks */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                            {dayTasks.slice(0, 3).map((task) => (
                                                <Box
                                                    key={task.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onTaskClick(task);
                                                    }}
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        fontSize: '0.7rem',
                                                        color: task.color || '#2196f3',
                                                        cursor: 'pointer',
                                                        overflow: 'hidden',
                                                        whiteSpace: 'nowrap',
                                                        textOverflow: 'ellipsis',
                                                        '&:hover': { textDecoration: 'underline' },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: '50%',
                                                            bgcolor: task.color || '#2196f3',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontSize: '0.7rem',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {task.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            fontSize: '0.65rem',
                                                            color: 'text.secondary',
                                                            ml: 'auto',
                                                        }}
                                                    >
                                                        {task.startTime}
                                                    </Typography>
                                                </Box>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontSize: '0.65rem',
                                                        color: '#2196f3',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    +{dayTasks.length - 3} autres
                                                </Typography>
                                            )}
                                        </Box>
                                    </>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            ))}
        </Box>
    );
};

export default MonthView;
