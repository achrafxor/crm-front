import { Typography, Box, Paper, Button, Avatar, Card, CardContent, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useSellerLeads } from '../context/SellerLeadsContext';
import type { SellerLead, SellerPhase, Mandat } from '../types';
import { DndContext, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import MandatForm from '../components/mandat/MandatForm';
import { useMandat } from '../context/MandatContext';
import VendeurForm from '../components/vendeur/VendeurForm';

const KanbanCard = ({ lead, onEdit, onDelete }: { lead: SellerLead; onEdit: () => void; onDelete: () => void; }) => {
    const handleDelete = () => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${lead.sellerName} ?`)) {
            onDelete();
        }
    };
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: lead.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        marginBottom: '8px',
    };

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} sx={{ mb: 1, cursor: 'grab', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 4, right: 4, display: 'flex' }}>
                    <IconButton size="small" onClick={onEdit}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={handleDelete}><Delete fontSize="small" /></IconButton>
                </Box>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={lead.photos[0]} />
                <Box>
                    <Typography variant="body1" fontWeight="bold">{lead.sellerName}</Typography>
                    <Typography variant="body2" color="text.secondary">{lead.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{lead.phone}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(lead.listingDate).toLocaleDateString()}</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const KanbanColumn = ({ phase, leads, onEdit, onDelete }: { phase: SellerPhase; leads: SellerLead[]; onEdit: (lead: SellerLead) => void; onDelete: (id: string) => void; }) => {
    const { setNodeRef } = useDroppable({
        id: phase,
    });

    const getPhaseTitle = (phase: SellerPhase) => {
        switch (phase) {
            case 'PROSPECT': return 'Prospects';
            case 'PROSPECT_QUALIFIE': return 'Prospects Qualifiés';
            case 'CLIENT': return 'Mandat signé';
            case 'APRES_VENTE': return 'Après Vente';
            default: return '';
        }
    };

    return (
        <Paper ref={setNodeRef} sx={{ flex: 1, minWidth: 200, p: 2, backgroundColor: 'grey.100' }}>
            <Typography variant="h6" gutterBottom>{getPhaseTitle(phase)} ({leads.length})</Typography>
            <Box sx={{ minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                {leads.map(lead => (
                    <KanbanCard key={lead.id} lead={lead} onEdit={() => onEdit(lead)} onDelete={() => onDelete(lead.id)} />
                ))}
            </Box>
        </Paper>
    );
};

const VendeurPersons = () => {
    const { sellerLeads, updateSellerLeadPhase, addSellerLead, updateSellerLead, deleteSellerLead } = useSellerLeads();
    const { addMandat } = useMandat();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<SellerLead | null>(null);
    const [vendeurModalOpen, setVendeurModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<SellerLead | null>(null);

            const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const leadId = active.id as string;
        const newPhase = over.id as SellerPhase;

        const activeLead = sellerLeads.find(l => l.id === leadId);
        if (!activeLead || !activeLead.phase) {
            return;
        }
        const currentPhase = activeLead.phase;

        const phasesOrder: SellerPhase[] = ['PROSPECT', 'PROSPECT_QUALIFIE', 'CLIENT', 'APRES_VENTE'];
        const currentPhaseIndex = phasesOrder.indexOf(currentPhase);
        const newPhaseIndex = phasesOrder.indexOf(newPhase);

        // Prevent moving backwards from 'CLIENT' (Mandat signé) and 'APRES_VENTE'
        if (currentPhaseIndex >= 2 && newPhaseIndex < currentPhaseIndex) {
            return; // Cannot move backwards from 'Mandat signé' or 'Après Vente'
        }

        // If moving to 'CLIENT', open the modal
        if (newPhase === 'CLIENT' && currentPhase !== 'CLIENT') {
            setSelectedLead(activeLead);
            setModalOpen(true);
        } else {
            // For other valid moves, just update the phase
            updateSellerLeadPhase(leadId, newPhase);
        }
    };

    const handleResetData = () => {
        if (window.confirm('Réinitialiser les données avec les annonces exemple (avec photos et descriptions) ?')) {
            localStorage.removeItem('crm_seller_leads');
            window.location.reload();
        }
    };

    const phases: SellerPhase[] = ['PROSPECT', 'PROSPECT_QUALIFIE', 'CLIENT', 'APRES_VENTE'];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                    Gérer des Vendeurs
                </Typography>
                <Button variant="contained" onClick={() => { setEditingLead(null); setVendeurModalOpen(true); }}>
                    Ajouter Prospect
                </Button>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleResetData}
                >
                    Réinitialiser les Données
                </Button>
            </Box>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Box sx={{ display: 'flex', gap: 2, p: 1, pb: 3 }}>
                    {phases.map(phase => {
                        const leadsInPhase = sellerLeads.filter(lead => lead.phase === phase);
                        return <KanbanColumn key={phase} phase={phase} leads={leadsInPhase} onEdit={(lead) => { setEditingLead(lead); setVendeurModalOpen(true); }} onDelete={deleteSellerLead} />;
                    })}
                </Box>
            </DndContext>
            {selectedLead && (
                <MandatForm
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={(mandatData) => {
                        addMandat(mandatData);
                        updateSellerLeadPhase(selectedLead.id, 'CLIENT');
                        setModalOpen(false);
                    }}
                    initialData={{
                        name: `Mandat pour ${selectedLead.title}`,
                        contactId: '', // This needs to be handled, maybe a new contact is created?
                        type: 'MANDAT_SIMPLE',
                        stage: 'LEAD',
                        value: 0,
                        date: new Date().toISOString().split('T')[0],
                        notes: `Créé à partir du lead vendeur: ${selectedLead.sellerName}`,
                    } as Omit<Mandat, 'id' | 'createdAt' | 'updatedAt'>}
                />
            )}
            <VendeurForm
                open={vendeurModalOpen}
                onClose={() => setVendeurModalOpen(false)}
                onSubmit={(data) => {
                    if (editingLead) {
                        updateSellerLead(editingLead.id, data);
                    } else {
                        addSellerLead(data);
                    }
                    setVendeurModalOpen(false);
                }}
                initialData={editingLead || undefined}
            />
        </Box>
    );
};

export default VendeurPersons;

