import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useMandat } from '../context/MandatContext';
import MandatList from '../components/mandat/MandatList';
import MandatForm from '../components/mandat/MandatForm';
import type { Mandat } from '../types';

const Mandats = () => {
    const { mandats, addMandat, updateMandat, deleteMandat } = useMandat();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMandat, setEditingMandat] = useState<Mandat | undefined>(undefined);

    const handleOpenCreate = () => {
        setEditingMandat(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (mandat: Mandat) => {
        setEditingMandat(mandat);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingMandat(undefined);
    };

    const handleSubmit = (data: Omit<Mandat, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingMandat) {
            updateMandat(editingMandat.id, data);
        } else {
            addMandat(data);
        }
        handleClose();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce mandat ?')) {
            deleteMandat(id);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Mandats</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
                    Nouveau Mandat
                </Button>
            </Box>

            <MandatList
                mandats={mandats}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <MandatForm
                open={isFormOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                initialData={editingMandat}
            />
        </Box>
    );
};

export default Mandats;
