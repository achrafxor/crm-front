import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    GridLegacy as Grid,
} from '@mui/material';
import type { Mandat, MandatType } from '../../types';
import { useContacts } from '../../context/ContactsContext';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Mandat, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: Partial<Mandat>;
}

const MandatForm = ({ open, onClose, onSubmit, initialData }: Props) => {
    const { contacts } = useContacts();
    const [formData, setFormData] = useState<Omit<Mandat, 'id' | 'createdAt' | 'updatedAt'>>({
        name: initialData?.name || '',
        contactId: initialData?.contactId || '',
        type: initialData?.type || 'MANDAT_SIMPLE',
        stage: initialData?.stage || 'LEAD',
        value: initialData?.value || 0,
        date: initialData?.date || new Date().toISOString().split('T')[0],
        notes: initialData?.notes || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'value' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSelectChange = (name: string, value: string | MandatType) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Modifier Mandat' : 'Nouveau Mandat'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Nom du Mandat"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="ex: dar mahrez goucha hachen"
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Contact</InputLabel>
                            <Select
                                value={formData.contactId}
                                onChange={(e) => handleSelectChange('contactId', e.target.value)}
                                label="Contact"
                            >
                                {contacts.map(contact => (
                                    <MenuItem key={contact.id} value={contact.id}>
                                        {contact.firstName} {contact.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Type de Mandat</InputLabel>
                            <Select
                                value={formData.type}
                                onChange={(e) => handleSelectChange('type', e.target.value as MandatType)}
                                label="Type de Mandat"
                            >
                                <MenuItem value="MANDAT_SIMPLE">Mandat Simple</MenuItem>
                                <MenuItem value="MANDAT_EXCLUSIF">Mandat Exclusif</MenuItem>
                                <MenuItem value="MANDAT_RECHERCHE">Mandat de Recherche</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel>Étape</InputLabel>
                            <Select
                                value={formData.stage}
                                onChange={(e) => handleSelectChange('stage', e.target.value)}
                                label="Étape"
                            >
                                <MenuItem value="LEAD">Lead</MenuItem>
                                <MenuItem value="PROSPECT">Prospect</MenuItem>
                                <MenuItem value="VISITES">Visites</MenuItem>
                                <MenuItem value="OFFRE">Offre</MenuItem>
                                <MenuItem value="NEGOCIATION">Négociation</MenuItem>
                                <MenuItem value="PURCHASED">Purchased</MenuItem>
                                <MenuItem value="APRES_VENTE">Après-Vente</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Valeur (€)"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {initialData ? 'Modifier' : 'Créer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MandatForm;
