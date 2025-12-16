import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Alert,
    Stack,
    Avatar,
} from '@mui/material';
import { TrendingUp, Flag } from '@mui/icons-material';
import type { SeniorityLevel } from '../types';
import { suggestSeniority, generateMonthlyGoals } from '../services/goalsService';
import { useGoals } from '../context/GoalsContext';
import { useNavigate } from 'react-router-dom';

const SENIORITY_LEVELS: SeniorityLevel[] = [
    'Débutant', 'Junior', 'Confirmé', 'Senior', 'Leader', 'Expert'
];

const GoalSetup = () => {
    const { setGoal } = useGoals();
    const navigate = useNavigate();

    const [year, setYear] = useState(new Date().getFullYear() + 1);
    const [revenue, setRevenue] = useState<string>('');
    const [seniority, setSeniority] = useState<SeniorityLevel>('Débutant');
    const [suggested, setSuggested] = useState<SeniorityLevel | null>(null);

    useEffect(() => {
        const revVal = parseFloat(revenue);
        if (!isNaN(revVal) && revVal > 0) {
            const suggestion = suggestSeniority(revVal);
            setSuggested(suggestion);
            setSeniority(suggestion);
        }
    }, [revenue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const revVal = parseFloat(revenue);
        if (!year || isNaN(revVal) || revVal <= 0) return;

        const newGoal = generateMonthlyGoals(year, revVal, seniority);
        setGoal(newGoal);
        navigate('/goals');
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                    sx={{
                        bgcolor: '#3b82f6',
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                    }}
                >
                    <Flag sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 1,
                    }}
                >
                    Définir vos Objectifs
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.9375rem',
                    }}
                >
                    Configurez vos objectifs annuels pour générer votre feuille de route mensuelle
                </Typography>
            </Box>

            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Année cible"
                            type="number"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <TextField
                            label="Objectif de Revenu Annuel (EUR)"
                            type="number"
                            value={revenue}
                            onChange={(e) => setRevenue(e.target.value)}
                            fullWidth
                            required
                            helperText={suggested ? `Niveau suggéré: ${suggested}` : 'Entrez un montant pour voir la suggestion'}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <TextField
                            select
                            label="Niveau d'Expérience"
                            value={seniority}
                            onChange={(e) => setSeniority(e.target.value as SeniorityLevel)}
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        >
                            {SENIORITY_LEVELS.map((level) => (
                                <MenuItem key={level} value={level}>
                                    {level}
                                </MenuItem>
                            ))}
                        </TextField>

                        {suggested && suggested !== seniority && (
                            <Alert 
                                severity="info"
                                sx={{
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        alignItems: 'center',
                                    },
                                }}
                            >
                                Basé sur votre objectif de revenu, nous recommandons le niveau <strong>{suggested}</strong>.
                            </Alert>
                        )}

                        <Button 
                            type="submit" 
                            variant="contained" 
                            size="large" 
                            fullWidth
                            startIcon={<TrendingUp />}
                            sx={{
                                bgcolor: '#3b82f6',
                                borderRadius: 2,
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                                '&:hover': {
                                    bgcolor: '#2563eb',
                                },
                            }}
                        >
                            Générer les Objectifs
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default GoalSetup;
