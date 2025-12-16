import { Typography, Box, Paper, Button, Avatar, Card, CardContent, IconButton, Chip } from '@mui/material';
import { Edit, Delete, Add, Refresh } from '@mui/icons-material';
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
        <Card 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners} 
            sx={{ 
                mb: 1.5, 
                cursor: 'grab', 
                position: 'relative',
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    sx={{ 
                        bgcolor: '#f8fafc', 
                        width: 28, 
                        height: 28,
                        '&:hover': { bgcolor: '#e2e8f0' },
                    }}
                >
                    <Edit sx={{ fontSize: 14 }} />
                </IconButton>
                <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    sx={{ 
                        bgcolor: '#fef2f2', 
                        color: '#dc2626',
                        width: 28, 
                        height: 28,
                        '&:hover': { bgcolor: '#fee2e2' },
                    }}
                >
                    <Delete sx={{ fontSize: 14 }} />
                </IconButton>
            </Box>
            <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
                <Avatar 
                    src={lead.photos[0]} 
                    sx={{ 
                        width: 48, 
                        height: 48, 
                        border: '2px solid #e2e8f0',
                    }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                        sx={{ 
                            fontWeight: 600, 
                            color: '#1e293b',
                            fontSize: '0.9rem',
                            mb: 0.25,
                        }}
                    >
                        {lead.sellerName}
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: '#64748b',
                            fontSize: '0.8rem',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {lead.title}
                    </Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        {lead.phone}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const KanbanColumn = ({ phase, leads, onEdit, onDelete }: { phase: SellerPhase; leads: SellerLead[]; onEdit: (lead: SellerLead) => void; onDelete: (id: string) => void; }) => {
    const { setNodeRef } = useDroppable({
        id: phase,
    });

    const phaseConfig: Record<SellerPhase, { title: string; color: string; bgColor: string }> = {
        'PROSPECT': { title: 'Prospects', color: '#6366f1', bgColor: '#eef2ff' },
        'PROSPECT_QUALIFIE': { title: 'Qualifiés', color: '#f59e0b', bgColor: '#fffbeb' },
        'CLIENT': { title: 'Mandat signé', color: '#10b981', bgColor: '#ecfdf5' },
        'APRES_VENTE': { title: 'Après Vente', color: '#64748b', bgColor: '#f8fafc' },
    };

    const config = phaseConfig[phase];

    return (
        <Paper 
            ref={setNodeRef} 
            sx={{ 
                flex: 1, 
                minWidth: 280, 
                p: 2, 
                bgcolor: '#fafafa',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box 
                    sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: config.color,
                    }} 
                />
                <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                    {config.title}
                </Typography>
                <Chip 
                    label={leads.length}
                    size="small"
                    sx={{ 
                        bgcolor: config.bgColor, 
                        color: config.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 22,
                    }}
                />
            </Box>
            <Box sx={{ minHeight: 400, display: 'flex', flexDirection: 'column' }}>
                {leads.map(lead => (
                    <KanbanCard 
                        key={lead.id} 
                        lead={lead} 
                        onEdit={() => onEdit(lead)} 
                        onDelete={() => onDelete(lead.id)} 
                    />
                ))}
                {leads.length === 0 && (
                    <Box 
                        sx={{ 
                            flex: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            border: '2px dashed #e2e8f0',
                            borderRadius: 2,
                            color: '#94a3b8',
                            fontSize: '0.875rem',
                        }}
                    >
                        Déposez ici
                    </Box>
                )}
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

        if (currentPhaseIndex >= 2 && newPhaseIndex < currentPhaseIndex) {
            return;
        }

        if (newPhase === 'CLIENT' && currentPhase !== 'CLIENT') {
            setSelectedLead(activeLead);
            setModalOpen(true);
        } else {
            updateSellerLeadPhase(leadId, newPhase);
        }
    };

    const handleResetData = () => {
        if (window.confirm('Réinitialiser les données avec les annonces exemple ?')) {
            localStorage.removeItem('crm_seller_leads');
            window.location.reload();
        }
    };

    const phases: SellerPhase[] = ['PROSPECT', 'PROSPECT_QUALIFIE', 'CLIENT', 'APRES_VENTE'];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 0.5,
                    }}
                >
                    Gestion des Vendeurs
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.9375rem',
                    }}
                >
                    Suivez vos prospects et gérez leur progression
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={() => { setEditingLead(null); setVendeurModalOpen(true); }}
                    sx={{
                        bgcolor: '#3b82f6',
                        borderRadius: 2,
                        px: 3,
                        py: 1.25,
                        fontWeight: 600,
                        textTransform: 'none',
                        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                        '&:hover': {
                            bgcolor: '#2563eb',
                        },
                    }}
                >
                    Ajouter Prospect
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={handleResetData}
                    sx={{
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                            borderColor: '#cbd5e1',
                            bgcolor: '#f8fafc',
                        },
                    }}
                >
                    Réinitialiser
                </Button>
            </Box>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                    {phases.map(phase => {
                        const leadsInPhase = sellerLeads.filter(lead => lead.phase === phase);
                        return (
                            <KanbanColumn 
                                key={phase} 
                                phase={phase} 
                                leads={leadsInPhase} 
                                onEdit={(lead) => { setEditingLead(lead); setVendeurModalOpen(true); }} 
                                onDelete={deleteSellerLead} 
                            />
                        );
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
                        contactId: '',
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
