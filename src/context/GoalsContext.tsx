import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AnnualGoal } from '../types';

interface GoalsContextType {
    currentGoal: AnnualGoal | null;
    setGoal: (goal: AnnualGoal) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentGoal, setGoal] = useState<AnnualGoal | null>(() => {
        const saved = localStorage.getItem('crm_annual_goal');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (currentGoal) {
            localStorage.setItem('crm_annual_goal', JSON.stringify(currentGoal));
        }
    }, [currentGoal]);

    return (
        <GoalsContext.Provider value={{ currentGoal, setGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};
