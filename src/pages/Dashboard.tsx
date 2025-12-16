import { Typography, Box, Paper, Grid2 as Grid, LinearProgress, Avatar, Chip } from '@mui/material';
import { TrendingUp, TrendingDown, AttachMoney, People, Assignment, Timer, ArrowForward } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
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
    const revenueGoal = currentGoal?.revenueTarget || 100000;
    const revenuePercentage = revenueGoal > 0 ? Math.min((totalRevenue / revenueGoal) * 100, 100) : 0;

    const transactionsYTD = mandats.filter(m => m.stage === 'PURCHASED').length;
    const prospectCount = sellerLeads.filter(l => l.phase === 'PROSPECT' || l.phase === 'PROSPECT_QUALIFIE').length;
    const prospectToMandateConversion = prospectCount > 0 ? (mandats.length / prospectCount) * 100 : 0;
    const mandateToSaleConversion = mandats.length > 0 ? (transactionsYTD / mandats.length) * 100 : 0;

    const soldMandates = mandats.filter(m => m.stage === 'PURCHASED');
    const averageTimeToSell = soldMandates.length > 0 ? soldMandates.reduce((acc, m) => {
        const createdDate = new Date(m.createdAt);
        const purchasedDate = new Date(m.updatedAt);
        const diffTime = Math.abs(purchasedDate.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
    }, 0) / soldMandates.length : 0;

    const pipelineData = [
        { name: 'Lead', value: mandats.filter(m => m.stage === 'LEAD').length, color: '#94a3b8' },
        { name: 'Prospect', value: mandats.filter(m => m.stage === 'PROSPECT').length, color: '#60a5fa' },
        { name: 'Visites', value: mandats.filter(m => m.stage === 'VISITES').length, color: '#34d399' },
        { name: 'Offre', value: mandats.filter(m => m.stage === 'OFFRE').length, color: '#fbbf24' },
        { name: 'Négociation', value: mandats.filter(m => m.stage === 'NEGOCIATION').length, color: '#f97316' },
        { name: 'Vendu', value: mandats.filter(m => m.stage === 'PURCHASED').length, color: '#10b981' },
    ];

    const StatCard = ({ 
        title, 
        value, 
        subtitle, 
        icon, 
        trend, 
        trendValue,
        color = '#3b82f6'
    }: { 
        title: string; 
        value: string | number; 
        subtitle?: string;
        icon: React.ReactNode; 
        trend?: 'up' | 'down';
        trendValue?: string;
        color?: string;
    }) => (
        <Paper
            sx={{
                p: 3,
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                '&:hover': {
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar
                    sx={{
                        bgcolor: `${color}15`,
                        color: color,
                        width: 48,
                        height: 48,
                    }}
                >
                    {icon}
                </Avatar>
                {trend && (
                    <Chip
                        size="small"
                        icon={trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                        label={trendValue}
                        sx={{
                            bgcolor: trend === 'up' ? '#dcfce7' : '#fee2e2',
                            color: trend === 'up' ? '#166534' : '#991b1b',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            '& .MuiChip-icon': {
                                color: 'inherit',
                            },
                        }}
                    />
                )}
            </Box>
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 0.5,
                    fontSize: '1.75rem',
                }}
            >
                {value}
            </Typography>
            <Typography
                sx={{
                    color: '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                }}
            >
                {title}
            </Typography>
            {subtitle && (
                <Typography
                    sx={{
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        mt: 0.5,
                    }}
                >
                    {subtitle}
                </Typography>
            )}
        </Paper>
    );

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 0.5,
                    }}
                >
                    Tableau de Bord
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.9375rem',
                    }}
                >
                    Bienvenue ! Voici un apercu de votre activité.
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Transactions YTD"
                        value={transactionsYTD}
                        icon={<Assignment />}
                        trend="up"
                        trendValue="+12%"
                        color="#3b82f6"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Mandats Actifs"
                        value={mandats.length}
                        icon={<AttachMoney />}
                        trend="up"
                        trendValue="+5%"
                        color="#10b981"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Contacts"
                        value={buyers.length + sellerLeads.length}
                        icon={<People />}
                        color="#8b5cf6"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        title="Temps Moyen de Vente"
                        value={`${averageTimeToSell.toFixed(0)}j`}
                        subtitle="Délai moyen"
                        icon={<Timer />}
                        color="#f59e0b"
                    />
                </Grid>
            </Grid>

            {/* Revenue Progress */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            height: '100%',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    Objectif de Revenu
                                </Typography>
                                <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                                    Progression vers votre objectif annuel
                                </Typography>
                            </Box>
                            <Chip
                                label={`${revenuePercentage.toFixed(1)}%`}
                                sx={{
                                    bgcolor: revenuePercentage >= 75 ? '#dcfce7' : revenuePercentage >= 50 ? '#fef3c7' : '#fee2e2',
                                    color: revenuePercentage >= 75 ? '#166534' : revenuePercentage >= 50 ? '#92400e' : '#991b1b',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                }}
                            />
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {totalRevenue.toLocaleString('fr-FR')} €
                                </Typography>
                                <Typography sx={{ color: '#64748b' }}>
                                    {revenueGoal.toLocaleString('fr-FR')} €
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={revenuePercentage}
                                sx={{
                                    height: 12,
                                    borderRadius: 6,
                                    bgcolor: '#e2e8f0',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 6,
                                        bgcolor: revenuePercentage >= 75 ? '#10b981' : revenuePercentage >= 50 ? '#f59e0b' : '#3b82f6',
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 0.5 }}>
                                    Taux Prospect → Mandat
                                </Typography>
                                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.25rem' }}>
                                    {prospectToMandateConversion.toFixed(1)}%
                                </Typography>
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mb: 0.5 }}>
                                    Taux Mandat → Vente
                                </Typography>
                                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.25rem' }}>
                                    {mandateToSaleConversion.toFixed(1)}%
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
                            Pipeline
                        </Typography>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie
                                    data={pipelineData.filter(d => d.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pipelineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {pipelineData.filter(d => d.value > 0).map((item) => (
                                <Chip
                                    key={item.name}
                                    size="small"
                                    label={`${item.name}: ${item.value}`}
                                    sx={{
                                        bgcolor: `${item.color}20`,
                                        color: item.color,
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Activity & Pipeline */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
                            Répartition du Pipeline
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={pipelineData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={80}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                    {pipelineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Activité Récente
                            </Typography>
                            <ArrowForward sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[...mandats]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .slice(0, 4)
                                .map((mandat) => (
                                    <Box
                                        key={mandat.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: '#f8fafc',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: '#f1f5f9',
                                            },
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: '#e0f2fe',
                                                color: '#0284c7',
                                                width: 32,
                                                height: 32,
                                            }}
                                        >
                                            <Assignment sx={{ fontSize: 16 }} />
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem',
                                                    color: '#1e293b',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {mandat.name}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: '0.75rem',
                                                    color: '#94a3b8',
                                                }}
                                            >
                                                Nouveau mandat
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}

                            {mandats.length === 0 && (
                                <Typography sx={{ color: '#94a3b8', textAlign: 'center', py: 2 }}>
                                    Aucune activité récente
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
