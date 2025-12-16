import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useSellerLeads } from '../../context/SellerLeadsContext';
import type { SellerLead, SellerPhase } from '../../types';

const COLUMNS: { id: SellerPhase; title: string }[] = [
    { id: 'PROSPECT', title: 'Prospects' },
    { id: 'PROSPECT_QUALIFIE', title: 'Prospects Qualifiés' },
    { id: 'CLIENT', title: 'Clients' },
    { id: 'APRES_VENTE', title: 'Après Vente' },
];

const getLeadsByPhase = (leads: SellerLead[], phase: SellerPhase) =>
    leads.filter(l => (!l.phase && phase === 'PROSPECT') || l.phase === phase);

const SellerKanban: React.FC = () => {
    const { sellerLeads, updateSellerLead } = useSellerLeads();

    const onDragEnd = (result: DropResult) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId) return;

        const newPhase = destination.droppableId as SellerPhase;
        updateSellerLead(draggableId, { phase: newPhase });
    };

    return (
        <Box sx={{ display: 'flex', gap: 2, width: '100%', overflowX: 'auto', py: 1 }}>
            <DragDropContext onDragEnd={onDragEnd}>
                {COLUMNS.map(col => {
                    const items = getLeadsByPhase(sellerLeads, col.id);
                    return (
                        <Box key={col.id} sx={{ minWidth: 320, flex: '0 0 320px' }}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
                                {col.title} <Chip label={items.length} size="small" sx={{ ml: 1 }} />
                            </Typography>
                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <Paper
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            minHeight: 200,
                                            p: 2,
                                            bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {items.map((lead, index) => (
                                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                                                {(providedDraggable, snapshotDraggable) => (
                                                    <Paper
                                                        ref={providedDraggable.innerRef}
                                                        {...providedDraggable.draggableProps}
                                                        {...providedDraggable.dragHandleProps}
                                                        sx={{
                                                            p: 1,
                                                            mb: 1,
                                                            cursor: 'grab',
                                                            bgcolor: snapshotDraggable.isDragging ? 'primary.light' : '#fff',
                                                            boxShadow: snapshotDraggable.isDragging ? 6 : 1,
                                                            maxHeight: 72,
                                                            overflow: 'hidden',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <Typography variant="body2" fontWeight={600} noWrap>
                                                            {lead.sellerName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25 }} noWrap>
                                                            {lead.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" display="block">
                                                            {lead.region} • {new Date(lead.listingDate).toLocaleDateString('fr-FR')}
                                                        </Typography>
                                                    </Paper>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Paper>
                                )}
                            </Droppable>
                        </Box>
                    );
                })}
            </DragDropContext>
        </Box>
    );
};

export default SellerKanban;
