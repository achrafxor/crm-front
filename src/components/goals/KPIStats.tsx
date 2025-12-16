import { Box, Card, CardContent, Typography, LinearProgress, Chip, GridLegacy as Grid } from '@mui/material';
import type { AnnualGoal, MonthlyGoal } from '../types';

interface Props {
    goal: AnnualGoal;
    realized: MonthlyGoal[]; // aggregated or list
}

const KPICard = ({ title, target, current, formatCurrency = false }: { title: string, target: number, current: number, formatCurrency?: boolean }) => {
    const percent = Math.min(100, Math.max(0, (current / target) * 100));

    let color: 'success' | 'warning' | 'error' = 'success';
    if (percent < 65) color = 'error';
    else if (percent < 100) color = 'warning';

    const format = (num: number) => formatCurrency
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
        : num;

    return (
        <Card>
            <CardContent>
                <Typography color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="div">
                    {format(current)} <Typography component="span" variant="body2" color="text.secondary">/ {format(target)}</Typography>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={percent} color={color} />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">{`${Math.round(percent)}%`}</Typography>
                    </Box>
                </Box>
                <Box sx={{ mt: 1 }}>
                    <Chip size="small" label={percent >= 100 ? "On Track" : percent >= 65 ? "At Risk" : "Behind"} color={color} />
                </Box>
            </CardContent>
        </Card>
    );
};

const KPIStats = ({ goal, realized }: Props) => {
    // Aggregate realized data
    const totalRevenue = realized.reduce((sum: number, m: MonthlyGoal) => sum + m.revenue, 0);
    const totalTransactions = realized.reduce((sum: number, m: MonthlyGoal) => sum + m.transactions, 0);
    const totalMandates = realized.reduce((sum: number, m: MonthlyGoal) => sum + m.newMandates, 0);

    const targetMandates = goal.monthlyGoals.reduce((sum: number, m: MonthlyGoal) => sum + m.newMandates, 0);
    const targetTransactions = goal.monthlyGoals.reduce((sum: number, m: MonthlyGoal) => sum + m.transactions, 0);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <KPICard title="Annual Revenue" target={goal.revenueTarget} current={totalRevenue} formatCurrency />
            </Grid>
            <Grid item xs={12} md={4}>
                <KPICard title="Transactions" target={targetTransactions} current={totalTransactions} />
            </Grid>
            <Grid item xs={12} md={4}>
                <KPICard title="New Mandates" target={targetMandates} current={totalMandates} />
            </Grid>
        </Grid>
    );
};

export default KPIStats;
