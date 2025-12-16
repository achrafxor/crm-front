import { Paper, Typography, Box } from '@mui/material';
import type { SellerLead, SellerPhase } from '../../types';

interface Props {
    sellerLeads: SellerLead[];
    activeFilter: SellerPhase;
    onFilterChange: (filter: SellerPhase) => void;
}

const SellerKPIs: React.FC<Props> = ({ sellerLeads, activeFilter, onFilterChange }) => {
    // Calculate KPIs
    const stats = {
        total: sellerLeads.length,
        prospect: sellerLeads.filter(l => !l.phase || l.phase === 'PROSPECT').length,
        prospectQualifie: sellerLeads.filter(l => l.phase === 'PROSPECT_QUALIFIE').length,
        client: sellerLeads.filter(l => l.phase === 'CLIENT').length,
        apresVente: sellerLeads.filter(l => l.phase === 'APRES_VENTE').length,
    };

    const KpiCard = ({
        title,
        value,
        color,
        filterType
    }: {
        title: string;
        value: number;
        color: string;
        filterType: SellerPhase;
    }) => {
        const isActive = activeFilter === filterType;

        return (
            <Box
                sx={{
                    flex: '1 1 220px',
                    minWidth: 220,
                }}
            >
                <Paper
                    onClick={() => onFilterChange(filterType)}
                    sx={{
                        p: 3,
                        height: 140,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isActive ? color : '#fff',
                        color: isActive ? 'white' : 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: isActive ? `3px solid ${color}` : '3px solid transparent',
                        transform: isActive ? 'scale(1.03)' : 'scale(1)',
                        boxShadow: isActive ? 6 : 1,
                        '&:hover': {
                            transform: 'scale(1.03)',
                            boxShadow: 6,
                            bgcolor: isActive ? color : '#f5f5f5',
                        }
                    }}
                >
                    <Typography
                        variant="h2"
                        fontWeight="bold"
                        sx={{ color: isActive ? 'white' : color, lineHeight: 1 }}
                    >
                        {value}
                    </Typography>
                    <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ mt: 1, color: isActive ? 'white' : 'text.secondary' }}
                    >
                        {title}
                    </Typography>
                </Paper>
            </Box>
        );
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    width: '100%',
                }}
            >
                <KpiCard
                    title="Prospect"
                    value={stats.prospect}
                    color="#9e9e9e"
                    filterType="PROSPECT"
                />
                <KpiCard
                    title="Prospect Qualifié"
                    value={stats.prospectQualifie}
                    color="#00bcd4"
                    filterType="PROSPECT_QUALIFIE"
                />
                <KpiCard
                    title="Client"
                    value={stats.client}
                    color="#4caf50"
                    filterType="CLIENT"
                />
                <KpiCard
                    title="Après Vente"
                    value={stats.apresVente}
                    color="#ff9800"
                    filterType="APRES_VENTE"
                />
            </Box>
        </Box>
    );
};

export default SellerKPIs;

