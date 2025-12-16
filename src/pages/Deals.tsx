import React, { useState } from 'react';
import { Typography, Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useDeals } from '../context/DealsContext';
import PipelineBoard from '../components/deals/PipelineBoard';
import DealForm from '../components/deals/DealForm';
import ScoringForm from '../components/scoring/ScoringForm';
import type { Deal, PipelineType, SellerScore } from '../types';

const Deals = () => {
    const { deals, addDeal, updateDeal, getPipelineStages } = useDeals();
    const [pipelineType, setPipelineType] = useState<PipelineType>('BUYER');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isScoringOpen, setIsScoringOpen] = useState(false);
    const [editingDeal, setEditingDeal] = useState<Deal | undefined>(undefined);
    const [scoringDeal, setScoringDeal] = useState<Deal | undefined>(undefined);

    const handleOpenCreate = () => {
        setEditingDeal(undefined);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingDeal(undefined);
    };

    const handleScore = (deal: Deal) => {
        setScoringDeal(deal);
        setIsScoringOpen(true);
    };

    const handleScoreSave = (score: SellerScore) => {
        if (scoringDeal) {
            updateDeal(scoringDeal.id, { score });
            setIsScoringOpen(false);
            setScoringDeal(undefined);
        }
    };

    const handleSubmit = (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingDeal) {
            updateDeal(editingDeal.id, data);
        } else {
            addDeal(data);
        }
    };

    const handlePipelineChange = (
        event: React.MouseEvent<HTMLElement>,
        newPipeline: PipelineType | null,
    ) => {
        if (newPipeline !== null) {
            setPipelineType(newPipeline);
        }
    };

    const filteredDeals = deals.filter(d => d.type === pipelineType);
    const stages = getPipelineStages(pipelineType);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Deals</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ToggleButtonGroup
                        value={pipelineType}
                        exclusive
                        onChange={handlePipelineChange}
                        aria-label="pipeline type"
                        size="small"
                    >
                        <ToggleButton value="BUYER">Buyer Pipeline</ToggleButton>
                        <ToggleButton value="SELLER">Seller Pipeline</ToggleButton>
                    </ToggleButtonGroup>
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
                        New Deal
                    </Button>
                </Box>
            </Box>

            <PipelineBoard
                stages={stages}
                deals={filteredDeals}
                onScore={handleScore}
            />

            <DealForm
                open={isFormOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                initialData={editingDeal}
            />

            <ScoringForm
                open={isScoringOpen}
                onClose={() => setIsScoringOpen(false)}
                onSave={handleScoreSave}
            />
        </Box>
    );
};

export default Deals;
