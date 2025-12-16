import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Buyer, BuyerStage } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface BuyerContextType {
    buyers: Buyer[];
    addBuyer: (buyer: Omit<Buyer, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateBuyerStage: (id: string, newStage: BuyerStage) => void;
    getBuyersByMandat: (mandatId: string) => Buyer[];
}

const BuyerContext = createContext<BuyerContextType | undefined>(undefined);

export const useBuyers = () => {
    const context = useContext(BuyerContext);
    if (!context) {
        throw new Error('useBuyers must be used within a BuyerProvider');
    }
    return context;
};

export const BuyerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [buyers, setBuyers] = useState<Buyer[]>(() => {
        const saved = localStorage.getItem('crm_buyers');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('crm_buyers', JSON.stringify(buyers));
    }, [buyers]);

    const addBuyer = (data: Omit<Buyer, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newBuyer: Buyer = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setBuyers(prev => [...prev, newBuyer]);
    };

    const updateBuyerStage = (id: string, newStage: BuyerStage) => {
        setBuyers(prev => prev.map(b =>
            b.id === id ? { ...b, stage: newStage } : b
        ));
    };

    const getBuyersByMandat = (mandatId: string) => buyers.filter(b => b.mandatId === mandatId);

    return (
        <BuyerContext.Provider value={{ buyers, addBuyer, updateBuyerStage, getBuyersByMandat }}>
            {children}
        </BuyerContext.Provider>
    );
};
