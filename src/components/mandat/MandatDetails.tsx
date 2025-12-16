import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    GridLegacy as Grid,
    Paper,
    Typography,
    Box,
    Chip,
    Divider,
} from '@mui/material';
import type { Mandat } from '../../types';
import { useContacts } from '../../context/ContactsContext';

interface Props {
    open: boolean;
    onClose: () => void;
    mandat: Mandat | null;
}

const MandatDetails = ({ open, onClose, mandat }: Props) => {
    const { contacts } = useContacts();

    if (!mandat) return null;

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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5">{mandat.name}</Typography>
                    <Chip
                        label={getStageLabel(mandat.stage)}
                        color={getStageColor(mandat.stage)}
                    />
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* Main Info */}
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Contact</Typography>
                                    <Typography variant="h6">{contactName}</Typography>
                                    {contact && (
                                        <>
                                            <Typography variant="body2">{contact.phone}</Typography>
                                            <Typography variant="body2">{contact.email}</Typography>
                                        </>
                                    )}
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Type de Mandat</Typography>
                                    <Typography variant="h6">{getMandatTypeLabel(mandat.type)}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* KPIs */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Informations</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                                    <Typography variant="body2" color="text.secondary">Date</Typography>
                                    <Typography variant="h6">{formatDate(mandat.date)}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
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
                        </Grid>
                    </Grid>

                    {/* Notes */}
                    {mandat.notes && (
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Notes</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
                                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                    {mandat.notes}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    {/* Score if available */}
                    {mandat.score && (
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>Score de Qualification</Typography>
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MandatDetails;
