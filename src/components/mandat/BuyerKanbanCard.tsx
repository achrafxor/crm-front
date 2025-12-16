import { Card, CardContent, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Buyer } from '../../types';

interface BuyerKanbanCardProps {
    buyer: Buyer;
}

const BuyerKanbanCard = ({ buyer }: BuyerKanbanCardProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: buyer.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        marginBottom: '8px',
    };

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ mb: 1, cursor: 'grab' }}>
            <CardContent>
                <Typography variant="body1" fontWeight="bold">{buyer.name}</Typography>
                <Typography variant="body2" color="text.secondary">{buyer.phone}</Typography>
                <Typography variant="body2" color="text.secondary">{buyer.email}</Typography>
            </CardContent>
        </Card>
    );
};

export default BuyerKanbanCard;
