import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    GridLegacy as Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import type { SellerLead, PropertyType } from '../../types';
import { useContacts } from '../../context/ContactsContext';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<SellerLead, 'id' | 'contacted' | 'convertedToContact'>) => void;
    initialData?: SellerLead;
}

const VendeurForm = ({ open, onClose, onSubmit, initialData }: Props) => {
    const { contacts } = useContacts();
    const [formData, setFormData] = useState<Omit<SellerLead, 'id' | 'contacted' | 'convertedToContact'>>({
        contactId: '',
        sellerName: '',
        title: '',
        description: '',
        phone: '',
        region: '',
        photos: [],
        source: '',
        listingDate: new Date().toISOString().split('T')[0],
        phase: 'PROSPECT',
        propertyType: 'Maison',
        notes: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                listingDate: initialData.listingDate.split('T')[0],
            });
        } else {
            setFormData({
                contactId: '',
                sellerName: '',
                title: '',
                description: '',
                phone: '',
                region: '',
                photos: [],
                source: '',
                listingDate: new Date().toISOString().split('T')[0],
                phase: 'PROSPECT',
                propertyType: 'Maison',
                notes: '',
            });
        }
    }, [initialData, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const selectedContact = contacts.find(c => c.id === formData.contactId);
        const sellerName = selectedContact ? `${selectedContact.firstName} ${selectedContact.lastName}` : 'N/A';
        const phone = selectedContact ? selectedContact.phone : '';
        onSubmit({ ...formData, sellerName, phone });
        onClose();
    };

    const regions = ['Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte', 'Béja', 'Jendouba', 'Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'];

    const propertyTypes: PropertyType[] = ['Villa', 'Appartement', 'Maison', 'Studio', 'Terrain', 'Bureau', 'Local Commercial', 'Autre'];
    
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'Modifier le Vendeur' : 'Ajouter un Vendeur'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={12} sm={6}><TextField fullWidth label="Titre de l'annonce" name="title" value={formData.title} onChange={handleChange} required /></Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Contact</InputLabel>
                            <Select value={formData.contactId} onChange={(e) => handleSelectChange('contactId', e.target.value)} label="Contact">
                                {contacts.map(c => <MenuItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" name="description" value={formData.description} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Région</InputLabel>
                            <Select value={formData.region} onChange={(e) => handleSelectChange('region', e.target.value)} label="Région">
                                {regions.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Source" name="source" value={formData.source} onChange={handleChange} /></Grid>
                                        <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Type de bien</InputLabel>
                            <Select value={formData.propertyType} onChange={(e) => handleSelectChange('propertyType', e.target.value)} label="Type de bien">
                                {propertyTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Notes" name="notes" value={formData.notes} onChange={handleChange} /></Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button onClick={handleSubmit} variant="contained">{initialData ? 'Enregistrer' : 'Créer'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default VendeurForm;
