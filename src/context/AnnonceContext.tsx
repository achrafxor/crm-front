import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Annonce } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AnnonceContextType {
    annonces: Annonce[];
    addAnnonce: (annonce: Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>) => Annonce;
    updateAnnonce: (id: string, annonce: Partial<Annonce>) => void;
    getAnnonceByMandat: (mandatId: string) => Annonce | undefined;
}

const AnnonceContext = createContext<AnnonceContextType | undefined>(undefined);

export const useAnnonces = () => {
    const context = useContext(AnnonceContext);
    if (!context) {
        throw new Error('useAnnonces must be used within an AnnonceProvider');
    }
    return context;
};

export const AnnonceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [annonces, setAnnonces] = useState<Annonce[]>(() => {
        const saved = localStorage.getItem('crm_annonces');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('crm_annonces', JSON.stringify(annonces));
    }, [annonces]);

    const addAnnonce = (data: Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>): Annonce => {
        const newAnnonce: Annonce = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setAnnonces(prev => [...prev, newAnnonce]);
        return newAnnonce;
    };

    const updateAnnonce = (id: string, updates: Partial<Annonce>) => {
        setAnnonces(prev => prev.map(a =>
            a.id === id
                ? { ...a, ...updates, updatedAt: new Date().toISOString() }
                : a
        ));
    };

    const getAnnonceByMandat = (mandatId: string) => annonces.find(a => a.mandatId === mandatId);

    return (
        <AnnonceContext.Provider value={{ annonces, addAnnonce, updateAnnonce, getAnnonceByMandat }}>
            {children}
        </AnnonceContext.Provider>
    );
};
