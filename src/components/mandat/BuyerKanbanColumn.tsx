import { Paper, Typography, Box } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Buyer, BuyerStage } from '../../types';
import BuyerKanbanCard from './BuyerKanbanCard';

interface BuyerKanbanColumnProps {
    stage: BuyerStage;
    buyers: Buyer[];
}

const getStageLabel = (stage: string) => {
    switch (stage) {
        case 'LEAD': return 'Lead';
        case 'PROSPECT': return 'Prospect';
        case 'VISITES': return 'Visites';
        case 'OFFRE': return 'Offre';
        case 'NEGOCIATION': return 'Négociation';
        case 'PURCHASED': return 'Purchased';
        case 'APRES_VENTE': return 'Après-Vente';
        default: return stage;
    }
};

const getStageColor = (stage: string) => {
    switch (stage) {
        case 'LEAD': return '#90CAF9';
        case 'PROSPECT': return '#81C784';
        case 'VISITES': return '#FFB74D';
        case 'OFFRE': return '#9575CD';
        case 'NEGOCIATION': return '#F06292';
        case 'PURCHASED': return '#4CAF50';
        case 'APRES_VENTE': return '#64B5F6';
        default: return '#E0E0E0';
    }
};

const BuyerKanbanColumn = ({ stage, buyers }: BuyerKanbanColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: stage,
    });

    return (
        <Paper ref={setNodeRef} sx={{ flex: 1, minWidth: 180, p: 2, backgroundColor: getStageColor(stage), color: '#fff' }}>
            <Typography variant="h6" gutterBottom>{getStageLabel(stage)} ({buyers.length})</Typography>
            <SortableContext items={buyers.map(b => b.id)} strategy={verticalListSortingStrategy}>
                <Box sx={{ minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                    {buyers.map(buyer => (
                        <BuyerKanbanCard key={buyer.id} buyer={buyer} />
                    ))}
                </Box>
            </SortableContext>
        </Paper>
    );
};

export default BuyerKanbanColumn;
