import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Mandat } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface MandatContextType {
    mandats: Mandat[];
    addMandat: (mandat: Omit<Mandat, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateMandat: (id: string, mandat: Partial<Mandat>) => void;
    deleteMandat: (id: string) => void;
    getMandat: (id: string) => Mandat | undefined;
}

const MandatContext = createContext<MandatContextType | undefined>(undefined);

export const useMandat = () => {
    const context = useContext(MandatContext);
    if (!context) {
        throw new Error('useMandat must be used within a MandatProvider');
    }
    return context;
};

export const MandatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mandats, setMandats] = useState<Mandat[]>(() => {
        const saved = localStorage.getItem('crm_mandats');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('crm_mandats', JSON.stringify(mandats));
    }, [mandats]);

    const addMandat = (data: Omit<Mandat, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newMandat: Mandat = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setMandats(prev => [...prev, newMandat]);
    };

    const updateMandat = (id: string, updates: Partial<Mandat>) => {
        setMandats(prev => prev.map(m =>
            m.id === id
                ? { ...m, ...updates, updatedAt: new Date().toISOString() }
                : m
        ));
    };

    const deleteMandat = (id: string) => {
        setMandats(prev => prev.filter(m => m.id !== id));
    };

    const getMandat = (id: string) => mandats.find(m => m.id === id);

    return (
        <MandatContext.Provider value={{ mandats, addMandat, updateMandat, deleteMandat, getMandat }}>
            {children}
        </MandatContext.Provider>
    );
};
