import { Typography, Box, Paper, GridLegacy as Grid } from '@mui/material';
import { RadialBarChart, RadialBar, Legend, Tooltip, FunnelChart, Funnel, LabelList } from 'recharts';
import { useSellerLeads } from '../context/SellerLeadsContext';
import { useMandat } from '../context/MandatContext';
import { useBuyers } from '../context/BuyerContext';
import { useGoals } from '../context/GoalsContext';

const Dashboard = () => {
    const { sellerLeads } = useSellerLeads();
    const { mandats } = useMandat();
    const { buyers } = useBuyers();
    const { currentGoal } = useGoals();

    const totalRevenue = mandats.reduce((acc, m) => acc + m.value, 0);
    const revenueGoal = currentGoal?.revenueTarget || 0;
    const revenuePercentage = revenueGoal > 0 ? (totalRevenue / revenueGoal) * 100 : 0;

    const transactionsYTD = mandats.filter(m => m.stage === 'PURCHASED').length;
    const prospectToMandateConversion = sellerLeads.length > 0 ? (mandats.length / sellerLeads.filter(l => l.phase === 'PROSPECT' || l.phase === 'PROSPECT_QUALIFIE').length) * 100 : 0;
    const mandateToSaleConversion = mandats.length > 0 ? (transactionsYTD / mandats.length) * 100 : 0;

    const soldMandates = mandats.filter(m => m.stage === 'PURCHASED');
    const averageTimeToSell = soldMandates.length > 0 ? soldMandates.reduce((acc, m) => {
        const createdDate = new Date(m.createdAt);
        const purchasedDate = new Date(m.updatedAt); // Assuming updatedAt is the date of purchase
        const diffTime = Math.abs(purchasedDate.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
    }, 0) / soldMandates.length : 0;

    
    const mandateStageData = [
        { name: 'Lead', value: mandats.filter(m => m.stage === 'LEAD').length },
        { name: 'Prospect', value: mandats.filter(m => m.stage === 'PROSPECT').length },
        { name: 'Visites', value: mandats.filter(m => m.stage === 'VISITES').length },
        { name: 'Offre', value: mandats.filter(m => m.stage === 'OFFRE').length },
        { name: 'Négociation', value: mandats.filter(m => m.stage === 'NEGOCIATION').length },
        { name: 'Purchased', value: mandats.filter(m => m.stage === 'PURCHASED').length },
        { name: 'Après-Vente', value: mandats.filter(m => m.stage === 'APRES_VENTE').length },
    ];
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Objectif de Revenu</Typography>
                        <RadialBarChart 
                            width={400} 
                            height={300} 
                            innerRadius="70%" 
                            outerRadius="100%" 
                            data={[{ name: 'Revenue', value: revenuePercentage }]} 
                            startAngle={180} 
                            endAngle={0}
                        >
                            <RadialBar
                                label={{ position: 'insideStart', fill: '#fff' }}
                                background
                                dataKey='value'
                            />
                            <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                            <Tooltip />
                        </RadialBarChart>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Transactions (YTD)</Typography>
                        <Typography variant="h4">{transactionsYTD}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Prospect → Mandat</Typography>
                        <Typography variant="h4">{prospectToMandateConversion.toFixed(2)}%</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Mandat → Vente</Typography>
                        <Typography variant="h4">{mandateToSaleConversion.toFixed(2)}%</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Temps de Vente Moyen</Typography>
                        <Typography variant="h4">{averageTimeToSell.toFixed(0)} jours</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Pipeline de Mandats</Typography>
                        <FunnelChart width={800} height={300}>
                            <Tooltip />
                            <Funnel dataKey="value" data={mandateStageData} isAnimationActive>
                                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Activité Récente</Typography>
                        {[...mandats].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map(mandat => (
                            <Box key={mandat.id} sx={{ mb: 1 }}>
                                <Typography variant="body2">Nouveau mandat: {mandat.name}</Typography>
                            </Box>
                        ))}
                        {[...buyers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3).map(buyer => (
                            <Box key={buyer.id} sx={{ mb: 1 }}>
                                <Typography variant="body2">Nouvel acheteur: {buyer.name}</Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
