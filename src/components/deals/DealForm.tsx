import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    GridLegacy as Grid,
    MenuItem
} from '@mui/material';
import type { Deal, PipelineType } from '../../types';
import { useContacts } from '../../context/ContactsContext';
import { useDeals } from '../../context/DealsContext';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
    initialData?: Deal;
}

const DealForm = ({ open, onClose, onSubmit, initialData }: Props) => {
    const { contacts } = useContacts();
    const { getPipelineStages } = useDeals();

    const [formData, setFormData] = useState({
        title: '',
        contactId: '',
        type: 'BUYER' as PipelineType,
        value: '',
        stageId: '',
    });

    // Populate form data when editing or initialData changes
    React.useEffect(() => {
        if (open) {
            if (initialData) {
                setFormData({
                    title: initialData.title,
                    contactId: initialData.contactId,
                    type: initialData.type,
                    value: initialData.value.toString(),
                    stageId: initialData.stageId,
                });
            } else {
                // Reset form for new deal
                setFormData(prev => ({
                    title: '',
                    contactId: '',
                    type: 'BUYER',
                    value: '',
                    stageId: '',
                    // We can't automatically set default stageId easily here without knowing the type first, 
                    // logic handled in render or submit if empty
                }));
            }
        }
    }, [open, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Get default stage if not selected
        let stageId = formData.stageId;
        if (!stageId) {
            const stages = getPipelineStages(formData.type);
            if (stages.length > 0) {
                stageId = stages[0].id;
            }
        }

        onSubmit({
            title: formData.title,
            contactId: formData.contactId,
            type: formData.type,
            value: Number(formData.value),
            stageId: stageId,
        });
        onClose();
    };

    const currentStages = getPipelineStages(formData.type);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{initialData ? 'Edit Deal' : 'New Deal'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Deal Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Pipeline"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                <MenuItem value="BUYER">Buyer Pipeline</MenuItem>
                                <MenuItem value="SELLER">Seller Pipeline</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Value ($)"
                                name="value"
                                type="number"
                                value={formData.value}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Contact"
                                name="contactId"
                                value={formData.contactId}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                {contacts.map(contact => (
                                    <MenuItem key={contact.id} value={contact.id}>
                                        {contact.firstName} {contact.lastName} ({contact.type})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Stage"
                                name="stageId"
                                value={formData.stageId}
                                onChange={handleChange}
                                fullWidth
                                helperText="Leave empty to start at first stage"
                            >
                                {currentStages.map(stage => (
                                    <MenuItem key={stage.id} value={stage.id}>
                                        {stage.name}
                                    </MenuItem>
                                ))}
                            </TextField>
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

export default DealForm;
