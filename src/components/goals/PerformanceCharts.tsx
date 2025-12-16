import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart
} from 'recharts';
import { Box, Card, CardContent, Typography, GridLegacy as Grid } from '@mui/material';
import type { MonthlyGoal } from '../types';

interface Props {
    goals: MonthlyGoal[];
    realizedData: MonthlyGoal[]; // Mocked for now since we don't have real data aggregation yet
}

const PerformanceCharts = ({ goals, realizedData }: Props) => {
    // Merge target and realized for charts
    const data = goals.map((target, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        targetRevenue: target.revenue,
        realizedRevenue: realizedData[index]?.revenue || 0,
        targetDeals: target.transactions,
        realizedDeals: realizedData[index]?.transactions || 0,
    }));

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Revenue: Target vs Realized</Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="targetRevenue" fill="#8884d8" name="Target" />
                                        <Bar dataKey="realizedRevenue" fill="#82ca9d" name="Realized" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Transactions: Target vs Realized</Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="realizedDeals" barSize={20} fill="#413ea0" name="Realized" />
                                        <Line type="monotone" dataKey="targetDeals" stroke="#ff7300" name="Target" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PerformanceCharts;
