import { Typography, Box, Button, Paper, Chip } from '@mui/material';
import { Refresh, TrendingUp } from '@mui/icons-material';
import { useGoals } from '../context/GoalsContext';
import GoalSetup from './GoalSetup';
import MonthlyGoalsTable from '../components/goals/MonthlyGoalsTable';
import KPIStats from '../components/goals/KPIStats';
import PerformanceCharts from '../components/goals/PerformanceCharts';

const Goals = () => {
    const { currentGoal } = useGoals();

    if (!currentGoal) {
        return <GoalSetup />;
    }

    const mockRealized = currentGoal.monthlyGoals.map(g => ({
        ...g,
        revenue: g.revenue * (0.8 + Math.random() * 0.4),
        transactions: Math.floor(g.transactions * (0.5 + Math.random() * 0.8)),
        newMandates: Math.floor(g.newMandates * (0.7 + Math.random() * 0.5)),
    }));

    const handleReset = () => {
        if (confirm('Voulez-vous réinitialiser vos objectifs ?')) {
            localStorage.removeItem('crm_annual_goal');
            window.location.reload();
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    color: '#1e293b',
                                }}
                            >
                                Objectifs & Performance
                            </Typography>
                            <Chip
                                label={currentGoal.year}
                                size="small"
                                sx={{
                                    bgcolor: '#dbeafe',
                                    color: '#2563eb',
                                    fontWeight: 600,
                                }}
                            />
                        </Box>
                        <Typography
                            sx={{
                                color: '#64748b',
                                fontSize: '0.9375rem',
                            }}
                        >
                            Suivez votre progression vers vos objectifs annuels
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={handleReset}
                        sx={{
                            borderColor: '#e2e8f0',
                            color: '#64748b',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            '&:hover': {
                                borderColor: '#cbd5e1',
                                bgcolor: '#f8fafc',
                            },
                        }}
                    >
                        Réinitialiser
                    </Button>
                </Box>
            </Box>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    mb: 3,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
                    <Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', mb: 0.5 }}>
                            Objectif Annuel ({currentGoal.seniority})
                        </Typography>
                        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.5rem' }}>
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(currentGoal.revenueTarget)}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Box sx={{ mb: 4 }}>
                <KPIStats goal={currentGoal} realized={mockRealized} />
            </Box>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                    mb: 3,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                    Performance Mensuelle
                </Typography>
                <PerformanceCharts goals={currentGoal.monthlyGoals} realizedData={mockRealized} />
            </Paper>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                    Détail des Objectifs Mensuels
                </Typography>
                <MonthlyGoalsTable goals={currentGoal.monthlyGoals} />
            </Paper>
        </Box>
    );
};

export default Goals;
