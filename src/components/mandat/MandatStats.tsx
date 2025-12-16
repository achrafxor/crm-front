import React from 'react';
import { GridLegacy as Grid, Paper, Typography, Box } from '@mui/material';
import type { Mandat, BuyerStage } from '../../types';

interface Props {
    mandats: Mandat[];
}

const MandatStats = ({ mandats }: Props) => {
    const stages: { key: BuyerStage; label: string; color: string }[] = [
        { key: 'LEAD', label: 'Lead', color: '#90CAF9' },
        { key: 'PROSPECT', label: 'Prospect', color: '#81C784' },
        { key: 'VISITES', label: 'Visites', color: '#FFB74D' },
        { key: 'OFFRE', label: 'Offre', color: '#9575CD' },
        { key: 'NEGOCIATION', label: 'Négociation', color: '#F06292' },
        { key: 'PURCHASED', label: 'Purchased', color: '#4CAF50' },
        { key: 'APRES_VENTE', label: 'Après-Vente', color: '#64B5F6' },
    ];

    const getCountForStage = (stage: BuyerStage): number => {
        return mandats.filter(m => m.stage === stage).length;
    };

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {stages.map(({ key, label, color }) => {
                const count = getCountForStage(key);
                return (
                    <Grid item xs={12} sm={6} md={3} lg={12 / 7} key={key}>
                        <Paper
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                backgroundColor: color,
                                color: '#fff',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            <Typography variant="h4" fontWeight="bold">
                                {count}
                            </Typography>
                            <Typography variant="body2">
                                {label}
                            </Typography>
                        </Paper>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default MandatStats;
