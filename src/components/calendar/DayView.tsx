import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import type { CalendarTask } from '../../types';

interface DayViewProps {
    date: string;
    tasks: CalendarTask[];
    onTimeSlotClick: (date: string, timeSlot: string) => void;
    onTaskClick: (task: CalendarTask) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, tasks, onTimeSlotClick, onTaskClick }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = i;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return {
            value: `${String(i).padStart(2, '0')}:00`,
            display: `${String(displayHour).padStart(2, '0')}:00 ${ampm}`,
        };
    });

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const isToday = date === todayStr;

    const getTasksForHour = (hour: string): CalendarTask[] => {
        return tasks.filter(t => t.date === date && t.startTime.startsWith(hour.split(':')[0]));
    };

    const getAllDayTasks = (): CalendarTask[] => {
        return tasks.filter(t => t.date === date && (!t.startTime || t.startTime === '00:00'));
    };

    const getOverdueTasks = (): CalendarTask[] => {
        const now = new Date();
        return tasks.filter(t => {
            if (t.date < todayStr) return true;
            if (t.date === todayStr && t.endTime) {
                const [hours, minutes] = t.endTime.split(':').map(Number);
                const taskEnd = new Date(now);
                taskEnd.setHours(hours, minutes, 0, 0);
                return taskEnd < now;
            }
            return false;
        });
    };

    const getCurrentTimePosition = (): number => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        return hours * 60 + minutes;
    };

    const formatCurrentTime = (): string => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current && isToday) {
            const currentHour = new Date().getHours();
            const scrollPosition = Math.max(0, (currentHour - 2) * 60);
            scrollRef.current.scrollTop = scrollPosition;
        }
    }, [isToday]);

    const overdueTasks = getOverdueTasks();
    const allDayTasks = getAllDayTasks();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)' }}>
            {/* Overdue Activities Banner */}
            {overdueTasks.length > 0 && (
                <Box
                    sx={{
                        bgcolor: '#ffebee',
                        color: '#c62828',
                        px: 2,
                        py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        borderBottom: '1px solid',
                        borderColor: '#ffcdd2',
                    }}
                >
                    <Box
                        sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: '#c62828',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                        }}
                    >
                        !
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                        Activités en retard ({overdueTasks.length})
                    </Typography>
                </Box>
            )}

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
                        py: 1.5,
                    }}
                >
                    <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                        Journée ({allDayTasks.length})
                    </Typography>
                </Box>
                <Box
                    onClick={() => onTimeSlotClick(date, '00:00')}
                    sx={{
                        flex: 1,
                        minHeight: 50,
                        p: 1,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
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
                                px: 1,
                                py: 0.5,
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                            }}
                        >
                            {task.title}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Time Grid */}
            <Box ref={scrollRef} sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {hours.map((hour, index) => {
                    const hourTasks = getTasksForHour(hour.value);

                    return (
                        <Box
                            key={hour.value}
                            sx={{
                                display: 'flex',
                                minHeight: 60,
                                borderBottom: '1px solid',
                                borderColor: '#f0f0f0',
                                position: 'relative',
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
                                    position: 'relative',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: '0.75rem',
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
                                        top: 0,
                                        bottom: 0,
                                        width: 1,
                                        bgcolor: '#e0e0e0',
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 70,
                                        top: '50%',
                                        width: 6,
                                        height: 1,
                                        bgcolor: '#e0e0e0',
                                    }}
                                />
                            </Box>

                            <Box
                                onClick={() => onTimeSlotClick(date, hour.value)}
                                sx={{
                                    flex: 1,
                                    minHeight: 60,
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
                                            left: 8,
                                            right: 8,
                                            top: 4,
                                            bgcolor: task.color || '#2196f3',
                                            color: 'white',
                                            p: 1,
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            zIndex: 1,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                            {task.startTime} - {task.endTime}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                            {task.title}
                                        </Typography>
                                        {task.description && (
                                            <Typography sx={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                                {task.description}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    );
                })}

                {/* Current Time Indicator */}
                {isToday && (
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: getCurrentTimePosition(),
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 10,
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: '#e91e63',
                                color: 'white',
                                px: 0.5,
                                py: 0.25,
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                borderRadius: '2px',
                                ml: 0.5,
                            }}
                        >
                            {formatCurrentTime()}
                        </Box>
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 75,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#e91e63',
                            }}
                        />
                        <Box
                            sx={{
                                flex: 1,
                                height: 2,
                                bgcolor: '#e91e63',
                                ml: -1,
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DayView;
