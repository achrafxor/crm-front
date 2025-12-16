import React from 'react';
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
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { Mandat } from '../../types';
import { useContacts } from '../../context/ContactsContext';
import { useNavigate } from 'react-router-dom';

interface Props {
    mandats: Mandat[];
    onEdit: (mandat: Mandat) => void;
    onDelete: (id: string) => void;
}

const MandatList = ({ mandats, onEdit, onDelete }: Props) => {
    const { contacts } = useContacts();
    const navigate = useNavigate();

    const getContactName = (contactId: string) => {
        const contact = contacts.find(c => c.id === contactId);
        return contact ? `${contact.firstName} ${contact.lastName}` : 'N/A';
    };

    const getMandatTypeLabel = (type: string) => {
        switch (type) {
            case 'MANDAT_SIMPLE': return 'Mandat Simple';
            case 'MANDAT_EXCLUSIF': return 'Mandat Exclusif';
            case 'MANDAT_RECHERCHE': return 'Mandat de Recherche';
            default: return type;
        }
    };

    const getMandatTypeColor = (type: string): "default" | "primary" | "secondary" | "success" => {
        switch (type) {
            case 'MANDAT_EXCLUSIF': return 'primary';
            case 'MANDAT_RECHERCHE': return 'secondary';
            default: return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const formatValue = (value: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
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

    if (mandats.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    Aucun mandat pour le moment. Cliquez sur "Nouveau Mandat" pour commencer.
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Nom</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Étape</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Contact</strong></TableCell>
                        <TableCell align="right"><strong>Valeur</strong></TableCell>
                        <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mandats.map((mandat) => (
                        <TableRow
                            key={mandat.id}
                            hover
                            onClick={() => navigate(`/mandat/${mandat.id}`)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell>{mandat.name}</TableCell>
                            <TableCell>{formatDate(mandat.date)}</TableCell>
                            <TableCell>
                                <Chip
                                    label={getStageLabel(mandat.stage)}
                                    color={getStageColor(mandat.stage)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={getMandatTypeLabel(mandat.type)}
                                    color={getMandatTypeColor(mandat.type)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{getContactName(mandat.contactId)}</TableCell>
                            <TableCell align="right">{formatValue(mandat.value)}</TableCell>
                            <TableCell align="center">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => onEdit(mandat)}
                                    title="Modifier"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onDelete(mandat.id)}
                                    title="Supprimer"
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MandatList;
