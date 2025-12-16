import React, { useState, useEffect } from 'react';
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
    Grid,
    Box,
} from '@mui/material';
import { useCalendar } from '../../context/CalendarContext';
import { useContacts } from '../../context/ContactsContext';
import { useMandat } from '../../context/MandatContext';
import type { CalendarTask } from '../../types';

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    initialDate?: string;
    initialTimeSlot?: string;
    initialTask?: CalendarTask;
}

const TaskForm: React.FC<TaskFormProps> = ({
    open,
    onClose,
    initialDate,
    initialTimeSlot,
    initialTask,
}) => {
    const { addTask, updateTask, deleteTask } = useCalendar();
    const { contacts } = useContacts();
    const { mandats } = useMandat();

    const [formData, setFormData] = useState<Omit<CalendarTask, 'id' | 'createdAt' | 'updatedAt'>>({
        title: '',
        description: '',
        date: initialDate || new Date().toISOString().split('T')[0],
        startTime: initialTimeSlot || '09:00',
        endTime: initialTimeSlot ?
            String(parseInt(initialTimeSlot.split(':')[0]) + 1).padStart(2, '0') + ':00' :
            '10:00',
        color: '#1976d2',
        contactId: '',
        mandatId: '',
    });

    useEffect(() => {
        if (initialTask) {
            setFormData({
                title: initialTask.title,
                description: initialTask.description || '',
                date: initialTask.date,
                startTime: initialTask.startTime,
                endTime: initialTask.endTime,
                color: initialTask.color || '#1976d2',
                contactId: initialTask.contactId || '',
                mandatId: initialTask.mandatId || '',
            });
        } else if (initialDate) {
            setFormData(prev => ({
                ...prev,
                date: initialDate,
            }));
        }
        if (initialTimeSlot) {
            setFormData(prev => ({
                ...prev,
                startTime: initialTimeSlot,
                endTime: String(parseInt(initialTimeSlot.split(':')[0]) + 1).padStart(2, '0') + ':00',
            }));
        }
    }, [initialTask, initialDate, initialTimeSlot]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (initialTask) {
            updateTask(initialTask.id, formData);
        } else {
            addTask(formData);
        }
        handleClose();
    };

    const handleDelete = () => {
        if (initialTask && window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            deleteTask(initialTask.id);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            endTime: '10:00',
            color: '#1976d2',
            contactId: '',
            mandatId: '',
        });
        onClose();
    };

    // Generate time options (00:00 to 23:59)
    const timeOptions = Array.from({ length: 24 }, (_, i) =>
        String(i).padStart(2, '0') + ':00'
    );

    const colorOptions = [
        { value: '#1976d2', label: 'Bleu' },
        { value: '#2e7d32', label: 'Vert' },
        { value: '#ed6c02', label: 'Orange' },
        { value: '#d32f2f', label: 'Rouge' },
        { value: '#9c27b0', label: 'Violet' },
        { value: '#0288d1', label: 'Cyan' },
    ];

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {initialTask ? 'Modifier la Tâche' : 'Nouvelle Tâche'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Titre"
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
                            rows={3}
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
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

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth required>
                            <InputLabel>Heure de début</InputLabel>
                            <Select
                                value={formData.startTime}
                                onChange={(e) => handleSelectChange('startTime', e.target.value)}
                                label="Heure de début"
                            >
                                {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth required>
                            <InputLabel>Heure de fin</InputLabel>
                            <Select
                                value={formData.endTime}
                                onChange={(e) => handleSelectChange('endTime', e.target.value)}
                                label="Heure de fin"
                            >
                                {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Couleur</InputLabel>
                            <Select
                                value={formData.color}
                                onChange={(e) => handleSelectChange('color', e.target.value)}
                                label="Couleur"
                            >
                                {colorOptions.map((color) => (
                                    <MenuItem key={color.value} value={color.value}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    bgcolor: color.value,
                                                    borderRadius: '50%',
                                                }}
                                            />
                                            {color.label}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Contact (optionnel)</InputLabel>
                            <Select
                                value={formData.contactId}
                                onChange={(e) => handleSelectChange('contactId', e.target.value)}
                                label="Contact (optionnel)"
                            >
                                <MenuItem value="">Aucun</MenuItem>
                                {contacts.map((contact) => (
                                    <MenuItem key={contact.id} value={contact.id}>
                                        {contact.firstName} {contact.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Mandat (optionnel)</InputLabel>
                            <Select
                                value={formData.mandatId}
                                onChange={(e) => handleSelectChange('mandatId', e.target.value)}
                                label="Mandat (optionnel)"
                            >
                                <MenuItem value="">Aucun</MenuItem>
                                {mandats.map((mandat) => (
                                    <MenuItem key={mandat.id} value={mandat.id}>
                                        {mandat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {initialTask && (
                    <Button onClick={handleDelete} color="error">
                        Supprimer
                    </Button>
                )}
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {initialTask ? 'Modifier' : 'Créer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskForm;


