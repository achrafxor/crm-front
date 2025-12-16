import { Typography, Box, Button } from '@mui/material';
import { useGoals } from '../context/GoalsContext';
import GoalSetup from './GoalSetup';
import MonthlyGoalsTable from '../components/goals/MonthlyGoalsTable';
import KPIStats from '../components/goals/KPIStats';
import PerformanceCharts from '../components/goals/PerformanceCharts';

const Goals = () => {
    const { currentGoal, setGoal } = useGoals();

    if (!currentGoal) {
        return <GoalSetup />;
    }

    // Mock realized data for demonstration (randomized variations of targets)
    const mockRealized = currentGoal.monthlyGoals.map(g => ({
        ...g,
        revenue: g.revenue * (0.8 + Math.random() * 0.4),
        transactions: Math.floor(g.transactions * (0.5 + Math.random() * 0.8)),
        newMandates: Math.floor(g.newMandates * (0.7 + Math.random() * 0.5)),
    }));

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Goals & Performance {currentGoal.year}
                </Typography>
                <Button variant="outlined" onClick={() => {
                    // Reset mechanism for demo purposes
                    if (confirm('Reset goals?')) {
                        // We need a proper reset, but for now we can rely on setGoal
                        // Actually clear local storage or passing null would require type adjustment?
                        // The context type is AnnualGoal | null, so we can pass any cast or just reload.
                        localStorage.removeItem('crm_annual_goal');
                        window.location.reload();
                    }
                }}>
                    Reset Goals
                </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Target: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentGoal.revenueTarget)} ({currentGoal.seniority})</Typography>
                <KPIStats goal={currentGoal} realized={mockRealized} />
            </Box>

            <PerformanceCharts goals={currentGoal.monthlyGoals} realizedData={mockRealized} />

            <MonthlyGoalsTable goals={currentGoal.monthlyGoals} />
        </Box>
    );
};

export default Goals;
