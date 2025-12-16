import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Button,
    GridLegacy as Grid,
    Paper,
    Chip,
    Divider,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useMandat } from '../context/MandatContext';
import { useContacts } from '../context/ContactsContext';
import { useAnnonces } from '../context/AnnonceContext';
import AnnonceForm from '../components/mandat/AnnonceForm';
import { useState } from 'react';
import BuyerKanbanBoard from '../components/mandat/BuyerKanbanBoard';

const MandatDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getMandat, updateMandat } = useMandat();
    const { contacts } = useContacts();
    const { getAnnonceByMandat, addAnnonce } = useAnnonces();
    const [annonceModalOpen, setAnnonceModalOpen] = useState(false);

    const mandat = id ? getMandat(id) : null;
    const annonce = mandat ? getAnnonceByMandat(mandat.id) : null;

    if (!mandat) {
        return (
            <Box>
                <Typography variant="h5">Mandat non trouvé</Typography>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/mandat')}>
                    Retour
                </Button>
            </Box>
        );
    }

    const contact = contacts.find(c => c.id === mandat.contactId);
    const contactName = contact ? `${contact.firstName} ${contact.lastName}` : 'N/A';

    const getMandatTypeLabel = (type: string) => {
        switch (type) {
            case 'MANDAT_SIMPLE': return 'Mandat Simple';
            case 'MANDAT_EXCLUSIF': return 'Mandat Exclusif';
            case 'MANDAT_RECHERCHE': return 'Mandat de Recherche';
            default: return type;
        }
    };

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

    const getStageColor = (stage: string): "default" | "primary" | "secondary" | "success" | "error" | "warning" | "info" => {
        switch (stage) {
            case 'LEAD': return 'info';
            case 'PROSPECT': return 'success';
            case 'VISITES': return 'warning';
            case 'OFFRE': return 'secondary';
            case 'NEGOCIATION': return 'error';
            case 'PURCHASED': return 'success';
            case 'APRES_VENTE': return 'primary';
            default: return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatValue = (value: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    };

    
    return (
        <Box>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/mandat')}
                    variant="outlined"
                >
                    Retour
                </Button>
                <Typography variant="h4">{mandat.name}</Typography>
                {annonce ? (
                    <Button variant="contained" color="secondary" onClick={() => { /* Implement navigation to annonce page */ }}>
                        Voir l'annonce
                    </Button>
                ) : (
                    <Button variant="contained" onClick={() => setAnnonceModalOpen(true)}>
                        Ajouter une annonce
                    </Button>
                )}
                <Chip
                    label={getStageLabel(mandat.stage)}
                    color={getStageColor(mandat.stage)}
                    size="medium"
                />
            </Box>

            <Grid container spacing={3}>
                {/* Main Info */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                                <Typography variant="h6" gutterBottom>{contactName}</Typography>
                                {contact && (
                                    <>
                                        <Typography variant="body2">{contact.phone}</Typography>
                                        <Typography variant="body2">{contact.email}</Typography>
                                    </>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">Type de Mandat</Typography>
                                <Typography variant="h6">{getMandatTypeLabel(mandat.type)}</Typography>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Date</Typography>
                                <Typography variant="h6">{formatDate(mandat.date)}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Buyer Kanban Board */}
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>Pipeline Acheteur</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <BuyerKanbanBoard mandatId={mandat.id} />
                </Grid>

                {/* Mandat Details */}
                <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>Détails du Mandat</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                                <Typography variant="body2" color="text.secondary">Valeur</Typography>
                                <Typography variant="h6">{formatValue(mandat.value)}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
                                <Typography variant="body2" color="text.secondary">Créé le</Typography>
                                <Typography variant="body1" fontSize="0.9rem">
                                    {formatDate(mandat.createdAt)}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                                <Typography variant="body2" color="text.secondary">Modifié le</Typography>
                                <Typography variant="body1" fontSize="0.9rem">
                                    {formatDate(mandat.updatedAt)}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
                                <Typography variant="body2" color="text.secondary">Étape Actuelle</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {getStageLabel(mandat.stage)}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Notes */}
                {mandat.notes && (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>Notes</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Paper sx={{ p: 3, bgcolor: '#fafafa' }}>
                            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                {mandat.notes}
                            </Typography>
                        </Paper>
                    </Grid>
                )}

                {/* Score if available */}
                {mandat.score && (
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>Score de Qualification</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Paper sx={{
                            p: 3,
                            textAlign: 'center',
                            bgcolor: mandat.score.classification === 'CHAUD' ? '#e8f5e9' :
                                mandat.score.classification === 'FROID' ? '#ffebee' : '#fff3e0'
                        }}>
                            <Typography variant="h4" fontWeight="bold">
                                {mandat.score.totalScore}/100
                            </Typography>
                            <Typography variant="h5" color="primary">
                                {mandat.score.classification}
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
            <AnnonceForm
                open={annonceModalOpen}
                onClose={() => setAnnonceModalOpen(false)}
                onSubmit={(annonceData) => {
                    const newAnnonce = addAnnonce(annonceData);
                    if (mandat) {
                        updateMandat(mandat.id, { annonceId: newAnnonce.id });
                    }
                    setAnnonceModalOpen(false);
                }}
                initialData={{
                    mandatId: mandat?.id || '',
                    title: mandat?.name || '',
                    description: mandat?.notes || '',
                }}
            />
        </Box>
    );
};

export default MandatDetail;
