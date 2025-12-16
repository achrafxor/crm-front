import React from 'react';
import { Box, Card, CardContent, Typography, Paper, GridLegacy as Grid, Chip } from '@mui/material';
import type { Deal, Stage } from '../../types';

interface Props {
    stages: Stage[];
    deals: Deal[];
    onDragEnd?: (result: any) => void;
    onScore?: (deal: Deal) => void;
}

const PipelineBoard = ({ stages, deals, onScore }: Props) => {
    // Basic Column Layout without DnD for initial version
    return (
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
            <Box sx={{ display: 'flex', minWidth: stages.length * 300, gap: 2 }}>
                {stages.map(stage => {
                    const stageDeals = deals.filter(d => d.stageId === stage.id);
                    return (
                        <Paper key={stage.id} sx={{ flex: 1, minWidth: 280, bgcolor: '#f5f5f5', p: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                {stage.name} ({stageDeals.length})
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {stageDeals.map(deal => (
                                    <Card key={deal.id}>
                                        <CardContent sx={{ p: '16px !important' }}>
                                            <Typography variant="body1" fontWeight="medium">{deal.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(deal.value)}
                                            </Typography>

                                            {deal.score && (
                                                <Chip
                                                    label={deal.score.classification}
                                                    size="small"
                                                    sx={{ mt: 1, bgcolor: deal.score.classification === 'CHAUD' ? '#4caf50' : deal.score.classification === 'FROID' ? '#ef5350' : '#ff9800', color: 'white' }}
                                                />
                                            )}

                                            {deal.type === 'SELLER' && !deal.score && onScore && (
                                                <Box sx={{ mt: 1 }}>
                                                    <Chip
                                                        label="Qualify"
                                                        size="small"
                                                        onClick={() => onScore(deal)}
                                                        color="primary"
                                                        variant="outlined"
                                                        clickable
                                                    />
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Paper>
                    )
                })}
            </Box>
        </Box>
    );
};

export default PipelineBoard;
