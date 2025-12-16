import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    GridLegacy as Grid,
} from '@mui/material';
import type { Annonce } from '../../types';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: Partial<Annonce>;
}

const AnnonceForm = ({ open, onClose, onSubmit, initialData }: Props) => {
    const [formData, setFormData] = useState<Omit<Annonce, 'id' | 'createdAt' | 'updatedAt'>>({
        mandatId: initialData?.mandatId || '',
        title: initialData?.title || '',
        description: initialData?.description || '',
        photos: initialData?.photos || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            photos: value.split(',').map(p => p.trim()),
        }));
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Modifier Annonce' : 'Nouvelle Annonce'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Titre de l'annonce"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Photos (URLs séparées par des virgules)"
                            name="photos"
                            value={formData.photos.join(', ')}
                            onChange={handlePhotoChange}
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

export default AnnonceForm;
