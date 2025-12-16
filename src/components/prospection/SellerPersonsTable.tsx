import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Typography,
    Box,
    alpha,
} from '@mui/material';
import type { SellerLead, SellerPhase } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
    sellerLeads: SellerLead[];
    activeFilter: SellerPhase;
}

const SellerPersonsTable: React.FC<Props> = ({ sellerLeads, activeFilter }) => {
    const navigate = useNavigate();

    // Filter leads based on phase. Default phase is PROSPECT: include leads with no phase.
    const getFilteredLeads = () => {
        if (activeFilter === 'PROSPECT') {
            return sellerLeads.filter(lead => !lead.phase || lead.phase === 'PROSPECT');
        }
        return sellerLeads.filter(lead => lead.phase === activeFilter);
    };

    const filteredLeads = getFilteredLeads();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const getPhaseColor = (phase?: SellerPhase) => {
        switch (phase) {
            case 'PROSPECT':
                return 'default';
            case 'PROSPECT_QUALIFIE':
                return 'info';
            case 'CLIENT':
                return 'success';
            case 'APRES_VENTE':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getPhaseLabel = (phase?: SellerPhase) => {
        switch (phase) {
            case 'PROSPECT':
                return 'Prospect';
            case 'PROSPECT_QUALIFIE':
                return 'Prospect Qualifié';
            case 'CLIENT':
                return 'Client';
            case 'APRES_VENTE':
                return 'Après Vente';
            default:
                return 'Prospect';
        }
    };

    if (filteredLeads.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                }}
            >
                <Typography variant="body1" color="text.secondary">
                    Aucune personne trouvée pour ce filtre.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden',
            }}
        >
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: alpha('#000', 0.02) }}>
                        <TableCell sx={{ fontWeight: 600, py: 2 }}>Photo</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Vendeur</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Titre</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Téléphone</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Région</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Note</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredLeads.map((lead, index) => (
                        <TableRow
                            key={lead.id}
                            hover
                            onClick={() => navigate(`/seller-prospection/${lead.id}`)}
                            sx={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha('#1976d2', 0.04),
                                },
                                borderBottom: index < filteredLeads.length - 1 ? '1px solid' : 'none',
                                borderColor: 'divider',
                            }}
                        >
                            <TableCell>
                                {lead.photos && lead.photos.length > 0 ? (
                                    <Box
                                        component="img"
                                        src={lead.photos[0]}
                                        alt="Aperçu"
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            objectFit: 'cover',
                                            borderRadius: 1.5,
                                            boxShadow: 1,
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            bgcolor: alpha('#000', 0.05),
                                            borderRadius: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography variant="caption" color="text.secondary">
                                            Pas d'image
                                        </Typography>
                                    </Box>
                                )}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                    {lead.sellerName}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                    {lead.title}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 300 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {lead.description || 'Aucune description'}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {lead.phone}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2">
                                    {lead.region}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={lead.source}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha('#1976d2', 0.1),
                                        color: 'primary.main',
                                        fontWeight: 500,
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(lead.listingDate)}
                                </Typography>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 300 }}>
                                {lead.notes ? (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {lead.notes}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                        Aucune note
                                    </Typography>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SellerPersonsTable;

