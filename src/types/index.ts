export type SeniorityLevel = 'Débutant' | 'Junior' | 'Confirmé' | 'Senior' | 'Leader' | 'Expert';

export interface AnnualGoal {
    id: string;
    year: number;
    revenueTarget: number;
    seniority: SeniorityLevel;
    monthlyGoals: MonthlyGoal[];
}

export interface MonthlyGoal {
    month: number; // 1-12
    contacts: number;
    prospects: number;
    newMandates: number;
    newBuyerRequests: number;
    activeProperties: number;
    offers: number;
    acceptedOffers: number;
    transactions: number;
    revenue: number;
}


export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}


export type MandatType = 'MANDAT_SIMPLE' | 'MANDAT_EXCLUSIF' | 'MANDAT_RECHERCHE';

export type BuyerStage = 'LEAD' | 'PROSPECT' | 'VISITES' | 'OFFRE' | 'NEGOCIATION' | 'PURCHASED' | 'APRES_VENTE';

export type ScoreClassification = 'CHAUD' | 'TIÈDE' | 'FROID';

export interface SellerScore {
    totalScore: number; // 0-100
    classification: ScoreClassification;
    breakdown: {
        motivation: number;
        priceRealism: number;
        legal: number;
    };
}

export interface Mandat {
    id: string;
    name: string; // e.g., "dar mahrez goucha hachen"
    contactId: string;
    type: MandatType;
    stage: BuyerStage; // Pipeline stage
    value: number;
    date: string; // ISO date string
    score?: SellerScore; // Optional scoring
    notes?: string;
    createdAt: string;
    updatedAt: string;
    annonceId?: string;
}

export type SellerPhase = 'PROSPECT' | 'PROSPECT_QUALIFIE' | 'CLIENT' | 'APRES_VENTE';
export type PropertyType = 'Villa' | 'Appartement' | 'Maison' | 'Studio' | 'Terrain' | 'Bureau' | 'Local Commercial' | 'Autre';

export interface SellerLead {
    id: string;
    contactId?: string;
    sellerName: string;
    title: string;
    description: string;
    phone: string;
    region: string;
    photos: string[]; // URLs des photos
    source: string;
    listingDate: string; // Date d'annonce
    contacted: boolean;
    convertedToContact?: boolean;
    phase?: SellerPhase; // Phase du vendeur
    propertyType?: PropertyType; // Type de bien
    notes?: string; // Notes sur le vendeur
}

export interface Buyer {
    id: string;
    mandatId: string;
    name: string;
    phone: string;
    email: string;
    stage: BuyerStage;
    createdAt: string;
    updatedAt: string;
}

export interface Annonce {
    id: string;
    mandatId: string;
    title: string;
    description: string;
    photos: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CalendarTask {
    id: string;
    title: string;
    description?: string;
    date: string; // ISO date string (YYYY-MM-DD)
    startTime: string; // HH:mm format (00:00 - 23:59)
    endTime: string; // HH:mm format (00:00 - 23:59)
    color?: string; // Optional color for the task
    contactId?: string; // Optional link to a contact
    mandatId?: string; // Optional link to a mandat
    createdAt: string;
    updatedAt: string;
}