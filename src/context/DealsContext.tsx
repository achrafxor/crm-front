import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Deal, Stage, PipelineType } from '../types';
import { initializeStages } from '../constants/pipelines';
import { v4 as uuidv4 } from 'uuid';

interface DealsContextType {
    deals: Deal[];
    stages: Stage[];
    addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateDeal: (id: string, updates: Partial<Deal>) => void;
    deleteDeal: (id: string) => void;
    moveDeal: (dealId: string, newStageId: string) => void;
    getPipelineStages: (type: PipelineType) => Stage[];
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const useDeals = () => {
    const context = useContext(DealsContext);
    if (!context) {
        throw new Error('useDeals must be used within a DealsProvider');
    }
    return context;
};

export const DealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stages, setStages] = useState<Stage[]>(() => {
        const saved = localStorage.getItem('crm_stages');
        return saved ? JSON.parse(saved) : initializeStages();
    });

    const [deals, setDeals] = useState<Deal[]>(() => {
        const saved = localStorage.getItem('crm_deals');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('crm_stages', JSON.stringify(stages));
    }, [stages]);

    useEffect(() => {
        localStorage.setItem('crm_deals', JSON.stringify(deals));
    }, [deals]);

    const addDeal = (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newDeal: Deal = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setDeals(prev => [...prev, newDeal]);
    };

    const updateDeal = (id: string, updates: Partial<Deal>) => {
        setDeals(prev => prev.map(d =>
            d.id === id
                ? { ...d, ...updates, updatedAt: new Date().toISOString() }
                : d
        ));
    };

    const moveDeal = (dealId: string, newStageId: string) => {
        updateDeal(dealId, { stageId: newStageId });
    };

    const deleteDeal = (id: string) => {
        setDeals(prev => prev.filter(d => d.id !== id));
    };

    const getPipelineStages = (type: PipelineType) => {
        return stages
            .filter(s => s.pipelineType === type)
            .sort((a, b) => a.order - b.order);
    };

    return (
        <DealsContext.Provider value={{ deals, stages, addDeal, updateDeal, deleteDeal, moveDeal, getPipelineStages }}>
            {children}
        </DealsContext.Provider>
    );
};
