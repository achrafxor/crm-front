import type { AnnualGoal, MonthlyGoal, SeniorityLevel } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Multipliers for different seniority levels (just an example logic)
const SENIORITY_MULTIPLIERS: Record<SeniorityLevel, number> = {
    'Débutant': 0.8,
    'Junior': 1.0,
    'Confirmé': 1.2,
    'Senior': 1.5,
    'Leader': 2.0,
    'Expert': 2.5,
};

// Conversion ratios (approximations for CRM logic)
const CONVERSION_RATES = {
    contactsToProspects: 0.5,
    prospectsToMandates: 0.3,
    mandatesToDeals: 0.8,
    dealsToOffers: 0.6,
    offersToAccepted: 0.7,
    acceptedToTransaction: 0.9,
};

export const generateMonthlyGoals = (year: number, annualRevenue: number, seniority: SeniorityLevel): AnnualGoal => {
    const multiplier = SENIORITY_MULTIPLIERS[seniority];
    const monthlyRevenue = annualRevenue / 12;

    // Reverse engineer metrics from Revenue
    // Transaction Value Avg (e.g., 5% commission on 300,000 property = 15,000)
    // Let's assume average commission is 5,000 for simplicity to calculate transaction count
    const avgCommission = 5000;
    const targetTransactions = Math.ceil((annualRevenue / avgCommission) * 1.0); // Buffer

    // Breakdown metrics per month
    const monthlyGoals: MonthlyGoal[] = Array.from({ length: 12 }, (_, i) => {
        const transactions = Math.ceil(targetTransactions / 12);
        const acceptedOffers = Math.ceil(transactions / CONVERSION_RATES.acceptedToTransaction);
        const offers = Math.ceil(acceptedOffers / CONVERSION_RATES.offersToAccepted);
        const newBuyerRequests = Math.ceil(offers / CONVERSION_RATES.dealsToOffers); // Simplified
        const activeProperties = Math.ceil(offers * 2); // Need inventory
        const newMandates = Math.ceil(activeProperties * 0.2); // Replenishment
        const prospects = Math.ceil(newMandates / CONVERSION_RATES.prospectsToMandates);
        const contacts = Math.ceil(prospects / CONVERSION_RATES.contactsToProspects);

        return {
            month: i + 1,
            contacts,
            prospects,
            newMandates,
            newBuyerRequests,
            activeProperties,
            offers,
            acceptedOffers,
            transactions,
            revenue: parseFloat(monthlyRevenue.toFixed(2)),
        };
    });

    return {
        id: uuidv4(),
        year,
        revenueTarget: annualRevenue,
        seniority,
        monthlyGoals,
    };
};

export const suggestSeniority = (revenue: number): SeniorityLevel => {
    if (revenue < 50000) return 'Débutant';
    if (revenue < 80000) return 'Junior';
    if (revenue < 120000) return 'Confirmé';
    if (revenue < 180000) return 'Senior';
    if (revenue < 300000) return 'Leader';
    return 'Expert';
};
