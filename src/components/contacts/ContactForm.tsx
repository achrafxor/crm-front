import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    GridLegacy as Grid,
} from '@mui/material';
import type { Contact } from '../../types';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: Contact;
}

const ContactForm = ({ open, onClose, onSubmit, initialData }: Props) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: '',
    });

    useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    firstName: initialData?.firstName || '',
                    lastName: initialData?.lastName || '',
                    phone: initialData?.phone || '',
                    email: initialData?.email || '',
                    notes: initialData?.notes || '',
                });
            } else {
                setFormData({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    notes: '',
                });
            }
        }
    }, [open, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{initialData ? 'Edit Contact' : 'New Contact'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Prénom"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nom"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Téléphone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                multiline
                                rows={3}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">Save</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ContactForm;
