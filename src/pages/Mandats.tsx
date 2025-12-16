import { useState } from 'react';
import { Typography, Box, Button, Paper, InputBase, Avatar, Chip } from '@mui/material';
import { Add, Search, FilterList } from '@mui/icons-material';
import { useMandat } from '../context/MandatContext';
import MandatList from '../components/mandat/MandatList';
import MandatForm from '../components/mandat/MandatForm';
import type { Mandat } from '../types';

const Mandats = () => {
    const { mandats, addMandat, updateMandat, deleteMandat } = useMandat();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMandat, setEditingMandat] = useState<Mandat | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredMandats = mandats.filter(mandat =>
        mandat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandat.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = mandats.filter(m => !['PURCHASED', 'APRES_VENTE'].includes(m.stage)).length;
    const soldCount = mandats.filter(m => m.stage === 'PURCHASED').length;

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 0.5,
                    }}
                >
                    Mandats
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.9375rem',
                    }}
                >
                    Gérez vos mandats de vente immobilière
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Paper
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1,
                    }}
                >
                    <Avatar sx={{ bgcolor: '#dbeafe', color: '#2563eb', width: 44, height: 44 }}>
                        {activeCount}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>Mandats Actifs</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>En cours de traitement</Typography>
                    </Box>
                </Paper>
                <Paper
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flex: 1,
                    }}
                >
                    <Avatar sx={{ bgcolor: '#dcfce7', color: '#16a34a', width: 44, height: 44 }}>
                        {soldCount}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>Vendus</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>Transactions finalisées</Typography>
                    </Box>
                </Paper>
            </Box>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: '#f8fafc',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            flex: 1,
                            maxWidth: 400,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <Search sx={{ color: '#94a3b8', mr: 1 }} />
                        <InputBase
                            placeholder="Rechercher un mandat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flex: 1,
                                fontSize: '0.875rem',
                            }}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenCreate}
                        sx={{
                            bgcolor: '#3b82f6',
                            borderRadius: 2,
                            px: 3,
                            py: 1.25,
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                            '&:hover': {
                                bgcolor: '#2563eb',
                            },
                        }}
                    >
                        Nouveau Mandat
                    </Button>
                </Box>

                <MandatList
                    mandats={filteredMandats}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Paper>

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
