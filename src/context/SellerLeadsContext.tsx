import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SellerLead, SellerPhase } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SellerLeadsContextType {
    sellerLeads: SellerLead[];
    markAsContacted: (id: string) => void;
    convertToContact: (id: string) => void;
    deleteSellerLead: (id: string) => void;
    updateSellerLead: (id: string, updates: Partial<SellerLead>) => void;
    updateSellerLeadPhase: (id: string, newPhase: SellerPhase) => void;
    addSellerLead: (lead: Omit<SellerLead, 'id' | 'contacted' | 'convertedToContact'>) => void;
}

const SellerLeadsContext = createContext<SellerLeadsContextType | undefined>(undefined);

export const useSellerLeads = () => {
    const context = useContext(SellerLeadsContext);
    if (!context) {
        throw new Error('useSellerLeads must be used within a SellerLeadsProvider');
    }
    return context;
};

// Mock data simulating scraped seller listings
const mockSellerLeads: SellerLead[] = [
    {
        id: uuidv4(),
        sellerName: 'Ahmed Bennani',
        title: 'Villa 250m² avec jardin - Hay Riad',
        description: 'Magnifique villa moderne de 250m² située dans le quartier prisé de Hay Riad. Comprend 4 chambres, 3 salles de bain, grand salon, cuisine équipée, jardin de 200m² avec piscine. Garage pour 2 voitures. Proche des écoles et commerces.',
        phone: '+216 12 34 56 78',
        region: 'Tunis',
        photos: [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        ],
        source: 'tayara.tn',
        listingDate: new Date().toISOString(),
        contacted: false,
        phase: 'PROSPECT',
        propertyType: 'Villa',
    },
    {
        id: uuidv4(),
        sellerName: 'Fatima Alaoui',
        title: 'Appartement 3 chambres - La Marsa',
        description: 'Bel appartement de 120m² au 3ème étage avec ascenseur. Vue mer exceptionnelle. 3 chambres spacieuses, 2 salles de bain, cuisine moderne, grand balcon. Parking privé. Idéal pour famille.',
        phone: '+216 23 45 67 89',
        region: 'La Marsa',
        photos: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        ],
        source: 'mubawab.tn',
        listingDate: new Date(Date.now() - 86400000).toISOString(),
        contacted: false,
        phase: 'PROSPECT_QUALIFIE',
        propertyType: 'Appartement',
    },
    {
        id: uuidv4(),
        sellerName: 'Mohamed Tazi',
        title: 'Maison traditionnelle - Médina',
        description: 'Charmante maison traditionnelle tunisienne dans la médina. 180m², entièrement rénovée avec matériaux authentiques. 3 chambres, patio central, terrasse sur le toit. Parfait pour location touristique ou résidence.',
        phone: '+216 34 56 78 90',
        region: 'Tunis Médina',
        photos: [
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        ],
        source: 'tayara.tn',
        listingDate: new Date(Date.now() - 172800000).toISOString(),
        contacted: true,
        phase: 'CLIENT',
        propertyType: 'Maison',
    },
    {
        id: uuidv4(),
        sellerName: 'Samira Benjelloun',
        title: 'Studio meublé - Centre ville',
        description: 'Studio moderne de 45m² entièrement meublé et équipé. Cuisine américaine, salle de bain moderne, balcon. Climatisation. Proche transports et commodités. Idéal investissement locatif.',
        phone: '+216 45 67 89 01',
        region: 'Sousse',
        photos: [
            'https://images.unsplash.com/photo-1502672260066-6bc51419c12d?w=800',
            'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
        ],
        source: 'mubawab.tn',
        listingDate: new Date(Date.now() - 259200000).toISOString(),
        contacted: false,
        phase: 'APRES_VENTE',
        propertyType: 'Studio',
    },
];

export const SellerLeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sellerLeads, setSellerLeads] = useState<SellerLead[]>(() => {
        const saved = localStorage.getItem('crm_seller_leads');
        return saved ? JSON.parse(saved) : mockSellerLeads;
    });

    useEffect(() => {
        localStorage.setItem('crm_seller_leads', JSON.stringify(sellerLeads));
    }, [sellerLeads]);

    const markAsContacted = (id: string) => {
        setSellerLeads(prev => prev.map(lead =>
            lead.id === id ? { ...lead, contacted: true } : lead
        ));
    };

    const convertToContact = (id: string) => {
        setSellerLeads(prev => prev.map(lead =>
            lead.id === id ? { ...lead, convertedToContact: true } : lead
        ));
    };

    const deleteSellerLead = (id: string) => {
        setSellerLeads(prev => prev.filter(lead => lead.id !== id));
    };

    const updateSellerLead = (id: string, updates: Partial<SellerLead>) => {
        setSellerLeads(prev => prev.map(lead =>
            lead.id === id ? { ...lead, ...updates } : lead
        ));
    };

    const updateSellerLeadPhase = (id: string, newPhase: SellerPhase) => {
        setSellerLeads(prev => prev.map(lead =>
            lead.id === id ? { ...lead, phase: newPhase } : lead
        ));
    };

    const addSellerLead = (leadData: Omit<SellerLead, 'id' | 'contacted' | 'convertedToContact'>) => {
        const newLead: SellerLead = {
            ...leadData,
            id: uuidv4(),
            contacted: false,
            convertedToContact: false,
        };
        setSellerLeads(prev => [newLead, ...prev]);
    };

    return (
        <SellerLeadsContext.Provider value={{ sellerLeads, markAsContacted, convertToContact, deleteSellerLead, updateSellerLead, updateSellerLeadPhase, addSellerLead }}>
            {children}
        </SellerLeadsContext.Provider>
    );
};
