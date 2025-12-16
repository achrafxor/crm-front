import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import type { BuyerStage } from '../../types';
import { useBuyers } from '../../context/BuyerContext';
import BuyerKanbanColumn from './BuyerKanbanColumn';

const stages: BuyerStage[] = ['LEAD', 'PROSPECT', 'VISITES', 'OFFRE', 'NEGOCIATION', 'PURCHASED', 'APRES_VENTE'];

interface BuyerKanbanBoardProps {
    mandatId: string;
}

const BuyerKanbanBoard = ({ mandatId }: BuyerKanbanBoardProps) => {
    const { getBuyersByMandat, updateBuyerStage } = useBuyers();
    const buyers = getBuyersByMandat(mandatId);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const buyerId = active.id as string;
            const newStage = over.id as BuyerStage;
            updateBuyerStage(buyerId, newStage);
        }
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Box sx={{ display: 'flex', gap: 2, p: 1 }}>
                <SortableContext items={stages} strategy={horizontalListSortingStrategy}>
                    {stages.map(stage => {
                        const buyersInStage = buyers.filter(buyer => buyer.stage === stage);
                        return <BuyerKanbanColumn key={stage} stage={stage} buyers={buyersInStage} />;
                    })}
                </SortableContext>
            </Box>
        </DndContext>
    );
};

export default BuyerKanbanBoard;
