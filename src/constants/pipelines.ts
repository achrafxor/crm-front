import { v4 as uuidv4 } from 'uuid';
import type { Stage, PipelineType } from '../types';

export const DEFAULT_BUYER_STAGES: Omit<Stage, 'id'>[] = [
    { name: 'New Lead', order: 0, pipelineType: 'BUYER' },
    { name: 'Contacted', order: 1, pipelineType: 'BUYER' },
    { name: 'Visit Scheduled', order: 2, pipelineType: 'BUYER' },
    { name: 'Offer Made', order: 3, pipelineType: 'BUYER' },
    { name: 'Under Contract', order: 4, pipelineType: 'BUYER' },
    { name: 'Closed', order: 5, pipelineType: 'BUYER' },
    { name: 'Lost', order: 6, pipelineType: 'BUYER' },
];

export const DEFAULT_SELLER_STAGES: Omit<Stage, 'id'>[] = [
    { name: 'Valuation Request', order: 0, pipelineType: 'SELLER' },
    { name: 'Valuation Done', order: 1, pipelineType: 'SELLER' },
    { name: 'Mandate Signed', order: 2, pipelineType: 'SELLER' },
    { name: 'Marketing', order: 3, pipelineType: 'SELLER' },
    { name: 'Offer Received', order: 4, pipelineType: 'SELLER' },
    { name: 'Under Contract', order: 5, pipelineType: 'SELLER' },
    { name: 'Closed', order: 6, pipelineType: 'SELLER' },
    { name: 'Lost', order: 7, pipelineType: 'SELLER' },
];

export const initializeStages = (): Stage[] => {
    const buyerStages = DEFAULT_BUYER_STAGES.map(s => ({ ...s, id: uuidv4() }));
    const sellerStages = DEFAULT_SELLER_STAGES.map(s => ({ ...s, id: uuidv4() }));
    return [...buyerStages, ...sellerStages];
};
