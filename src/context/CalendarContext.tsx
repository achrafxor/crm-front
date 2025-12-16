import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CalendarTask } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface CalendarContextType {
    tasks: CalendarTask[];
    addTask: (task: Omit<CalendarTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, task: Partial<CalendarTask>) => void;
    deleteTask: (id: string) => void;
    getTasksByDate: (date: string) => CalendarTask[];
    getTask: (id: string) => CalendarTask | undefined;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useCalendar must be used within a CalendarProvider');
    }
    return context;
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<CalendarTask[]>(() => {
        const saved = localStorage.getItem('crm_calendar_tasks');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('crm_calendar_tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (data: Omit<CalendarTask, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTask: CalendarTask = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setTasks(prev => [...prev, newTask]);
    };

    const updateTask = (id: string, updates: Partial<CalendarTask>) => {
        setTasks(prev => prev.map(t =>
            t.id === id
                ? { ...t, ...updates, updatedAt: new Date().toISOString() }
                : t
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const getTasksByDate = (date: string) => {
        return tasks.filter(t => t.date === date).sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
        );
    };

    const getTask = (id: string) => tasks.find(t => t.id === id);

    return (
        <CalendarContext.Provider value={{ tasks, addTask, updateTask, deleteTask, getTasksByDate, getTask }}>
            {children}
        </CalendarContext.Provider>
    );
};


