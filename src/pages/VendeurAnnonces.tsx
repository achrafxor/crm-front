import { Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useSellerLeads } from '../context/SellerLeadsContext';
import SellerLeadsList from '../components/prospection/SellerLeadsList';
import NoteModal from '../components/prospection/NoteModal';
import type { SellerPhase } from '../types';

const VendeurAnnonces = () => {
    const { sellerLeads, updateSellerLead, deleteSellerLead } = useSellerLeads();
    const [noteModalOpen, setNoteModalOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [selectedPhase, setSelectedPhase] = useState<SellerPhase | null>(null);
    const [modalTitle, setModalTitle] = useState('');

    const handleSaveAsProspect = (id: string) => {
        setSelectedLeadId(id);
        setSelectedPhase('PROSPECT');
        setModalTitle('Sauvegarder comme Prospect');
        setNoteModalOpen(true);
    };

    const handleSaveAsQualifiedProspect = (id: string) => {
        setSelectedLeadId(id);
        setSelectedPhase('PROSPECT_QUALIFIE');
        setModalTitle('Sauvegarder comme Prospect Qualifié');
        setNoteModalOpen(true);
    };

    const handleSaveNote = (note: string) => {
        if (selectedLeadId && selectedPhase) {
            updateSellerLead(selectedLeadId, {
                phase: selectedPhase,
                notes: note || undefined,
            });
        }
        setSelectedLeadId(null);
        setSelectedPhase(null);
    };

    const handleCloseModal = () => {
        setNoteModalOpen(false);
        setSelectedLeadId(null);
        setSelectedPhase(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
            deleteSellerLead(id);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                    Prospecter des Vendeurs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Annonces scrappées automatiquement depuis internet
                </Typography>
            </Box>

            <SellerLeadsList
                sellerLeads={sellerLeads}
                onSaveAsProspect={handleSaveAsProspect}
                onSaveAsQualifiedProspect={handleSaveAsQualifiedProspect}
                onDelete={handleDelete}
            />

            <NoteModal
                open={noteModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveNote}
                title={modalTitle}
                initialNote={selectedLeadId ? sellerLeads.find(l => l.id === selectedLeadId)?.notes || '' : ''}
            />
        </Box>
    );
};

export default VendeurAnnonces;

