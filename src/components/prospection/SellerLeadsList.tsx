import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Typography,
    Tooltip,
    Box,
    alpha,
} from '@mui/material';
import { Delete, Save, VerifiedUser } from '@mui/icons-material';
import type { SellerLead } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
    sellerLeads: SellerLead[];
    onSaveAsProspect: (id: string) => void;
    onSaveAsQualifiedProspect: (id: string) => void;
    onDelete: (id: string) => void;
}

const SellerLeadsList = ({ sellerLeads, onSaveAsProspect, onSaveAsQualifiedProspect, onDelete }: Props) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    if (sellerLeads.length === 0) {
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
                    Aucune annonce vendeur pour le moment.
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
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sellerLeads.map((lead, index) => (
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
                                borderBottom: index < sellerLeads.length - 1 ? '1px solid' : 'none',
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
                            <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                    <Tooltip title="Sauvegarder comme prospect" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSaveAsProspect(lead.id);
                                            }}
                                            sx={{
                                                color: lead.phase === 'PROSPECT' ? 'primary.main' : 'text.secondary',
                                                '&:hover': {
                                                    bgcolor: alpha('#1976d2', 0.1),
                                                },
                                            }}
                                        >
                                            <Save fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Sauvegarder comme prospect qualifié" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSaveAsQualifiedProspect(lead.id);
                                            }}
                                            sx={{
                                                color: lead.phase === 'PROSPECT_QUALIFIE' ? '#00bcd4' : 'text.secondary',
                                                '&:hover': {
                                                    bgcolor: alpha('#00bcd4', 0.1),
                                                },
                                            }}
                                        >
                                            <VerifiedUser fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Supprimer" arrow>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(lead.id);
                                            }}
                                            sx={{
                                                color: 'error.main',
                                                '&:hover': {
                                                    bgcolor: alpha('#f44336', 0.1),
                                                },
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SellerLeadsList;
