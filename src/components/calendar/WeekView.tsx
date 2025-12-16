import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import type { CalendarTask } from '../../types';

interface WeekViewProps {
    startDate: string;
    tasks: CalendarTask[];
    onTimeSlotClick: (date: string, timeSlot: string) => void;
    onTaskClick: (task: CalendarTask) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ startDate, tasks, onTimeSlotClick, onTaskClick }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const start = new Date(startDate);
    const dayOfWeek = start.getDay();
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        return date;
    });

    const dayNames = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return {
            value: `${String(i).padStart(2, '0')}:00`,
            display: `${String(displayHour).padStart(2, '0')}:00 ${ampm}`,
        };
    });

    const formatDate = (date: Date): string => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getTasksForDayAndHour = (dateStr: string, hour: string): CalendarTask[] => {
        return tasks.filter(t => t.date === dateStr && t.startTime.startsWith(hour.split(':')[0]));
    };

    const getAllDayTasks = (dateStr: string): CalendarTask[] => {
        return tasks.filter(t => t.date === dateStr && (!t.startTime || t.startTime === '00:00'));
    };

    useEffect(() => {
        if (scrollRef.current) {
            const currentHour = new Date().getHours();
            const scrollPosition = Math.max(0, (currentHour - 1) * 60);
            scrollRef.current.scrollTop = scrollPosition;
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)' }}>
            {/* Day Headers */}
            <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                <Box sx={{ width: 80, borderRight: '1px solid', borderColor: 'divider' }} />
                {weekDays.map((date, index) => {
                    const dateStr = formatDate(date);
                    const isToday = dateStr === todayStr;
                    const isWeekend = index >= 5;

                    return (
                        <Box
                            key={dateStr}
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
                                    fontSize: '0.7rem',
                                    color: isToday ? '#2196f3' : isWeekend ? '#e91e63' : 'text.secondary',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                {dayNames[index]} {date.getDate()}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* All Day Row */}
            <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                <Box
                    sx={{
                        width: 80,
                        bgcolor: '#26a69a',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 1,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                        Journée
                    </Typography>
                </Box>
                {weekDays.map((date, index) => {
                    const dateStr = formatDate(date);
                    const allDayTasks = getAllDayTasks(dateStr);

                    return (
                        <Box
                            key={`allday-${dateStr}`}
                            onClick={() => onTimeSlotClick(dateStr, '00:00')}
                            sx={{
                                flex: 1,
                                minHeight: 40,
                                p: 0.5,
                                borderRight: index < 6 ? '1px solid' : 'none',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#f5f5f5' },
                            }}
                        >
                            {allDayTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onTaskClick(task);
                                    }}
                                    sx={{
                                        bgcolor: task.color || '#2196f3',
                                        color: 'white',
                                        px: 0.5,
                                        py: 0.25,
                                        borderRadius: '2px',
                                        fontSize: '0.65rem',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {task.title}
                                </Box>
                            ))}
                        </Box>
                    );
                })}
            </Box>

            {/* Time Grid */}
            <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto' }}>
                {hours.map((hour) => (
                    <Box
                        key={hour.value}
                        sx={{
                            display: 'flex',
                            minHeight: 60,
                            borderBottom: '1px solid',
                            borderColor: '#f0f0f0',
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-end',
                                pr: 1,
                                pt: 0.5,
                                borderRight: '1px solid',
                                borderColor: 'divider',
                                position: 'relative',
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    fontSize: '0.7rem',
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                }}
                            >
                                {hour.display}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    width: 6,
                                    height: 1,
                                    bgcolor: '#e0e0e0',
                                }}
                            />
                        </Box>

                        {weekDays.map((date, index) => {
                            const dateStr = formatDate(date);
                            const hourTasks = getTasksForDayAndHour(dateStr, hour.value);

                            return (
                                <Box
                                    key={`${dateStr}-${hour.value}`}
                                    onClick={() => onTimeSlotClick(dateStr, hour.value)}
                                    sx={{
                                        flex: 1,
                                        minHeight: 60,
                                        borderRight: index < 6 ? '1px solid' : 'none',
                                        borderColor: '#f0f0f0',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        '&:hover': { bgcolor: '#fafafa' },
                                    }}
                                >
                                    {hourTasks.map((task) => (
                                        <Box
                                            key={task.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onTaskClick(task);
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                left: 2,
                                                right: 2,
                                                top: 2,
                                                bgcolor: task.color || '#2196f3',
                                                color: 'white',
                                                p: 0.5,
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                cursor: 'pointer',
                                                zIndex: 1,
                                            }}
                                        >
                                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                                                {task.startTime}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem' }}>
                                                {task.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            );
                        })}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default WeekView;
