import { Typography, Box, Paper, GridLegacy as Grid, Button, Divider } from '@mui/material';
import { useSellerLeads } from '../context/SellerLeadsContext';
import { useContacts } from '../context/ContactsContext';
import SellerLeadsList from '../components/prospection/SellerLeadsList';
import SellerKPIs from '../components/prospection/SellerKPIs';
import SellerPersonsTable from '../components/prospection/SellerPersonsTable';
import { useState } from 'react';
import type { SellerPhase } from '../types';

type FilterType = 'ALL' | 'QUALIFIED' | 'NON_QUALIFIED' | 'CONTACTED' | 'NON_CONTACTED';

const SellerProspection = () => {
    const { sellerLeads, markAsContacted, convertToContact, deleteSellerLead } = useSellerLeads();
    const { addContact } = useContacts();
    const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
    const [activePhaseFilter, setActivePhaseFilter] = useState<SellerPhase | 'TOTAL'>('TOTAL');

    const handleMarkContacted = (id: string) => {
        markAsContacted(id);
    };

    const handleConvertToContact = (id: string) => {
        const lead = sellerLeads.find(l => l.id === id);
        if (lead) {
            const names = lead.sellerName.split(' ');
            const firstName = names[0] || '';
            const lastName = names.slice(1).join(' ') || '';

            addContact({
                firstName,
                lastName,
                phone: lead.phone,
                email: '',
                notes: `Converti depuis annonce: ${lead.title}\nSource: ${lead.source}\nRégion: ${lead.region}`,
            });

            convertToContact(id);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
            deleteSellerLead(id);
        }
    };

    const handleResetData = () => {
        if (window.confirm('Réinitialiser les données avec les annonces exemple (avec photos et descriptions) ?')) {
            localStorage.removeItem('crm_seller_leads');
            window.location.reload();
        }
    };

    // Calculate stats
    const stats = {
        total: sellerLeads.length,
        qualified: sellerLeads.filter(l => l.convertedToContact).length,
        nonQualified: sellerLeads.filter(l => !l.convertedToContact && !l.contacted).length,
        contacted: sellerLeads.filter(l => l.contacted || l.convertedToContact).length,
        nonContacted: sellerLeads.filter(l => !l.contacted && !l.convertedToContact).length,
    };

    // Filter leads based on active filter
    const getFilteredLeads = () => {
        switch (activeFilter) {
            case 'QUALIFIED':
                return sellerLeads.filter(l => l.convertedToContact);
            case 'NON_QUALIFIED':
                return sellerLeads.filter(l => !l.convertedToContact && !l.contacted);
            case 'CONTACTED':
                return sellerLeads.filter(l => l.contacted || l.convertedToContact);
            case 'NON_CONTACTED':
                return sellerLeads.filter(l => !l.contacted && !l.convertedToContact);
            case 'ALL':
            default:
                return sellerLeads;
        }
    };

    const filteredLeads = getFilteredLeads();

    const KpiCard = ({
        title,
        value,
        color,
        filterType
    }: {
        title: string;
        value: number;
        color: string;
        filterType: FilterType;
    }) => {
        const isActive = activeFilter === filterType;

        return (
            <Grid item xs={12} sm={6} md={2.4}>
                <Paper
                    onClick={() => setActiveFilter(filterType)}
                    sx={{
                        p: 2.5,
                        textAlign: 'center',
                        bgcolor: isActive ? color : '#fff',
                        color: isActive ? 'white' : 'inherit',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: isActive ? `3px solid ${color}` : '3px solid transparent',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isActive ? 4 : 1,
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: 4,
                            bgcolor: isActive ? color : '#f5f5f5',
                        }
                    }}
                >
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{ color: isActive ? 'white' : color }}
                    >
                        {value}
                    </Typography>
                    <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{ mt: 1, color: isActive ? 'white' : 'text.secondary' }}
                    >
                        {title}
                    </Typography>
                </Paper>
            </Grid>
        );
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Prospection Vendeur
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Gestion des prospects et annonces vendeur
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleResetData}
                >
                    Réinitialiser les Données
                </Button>
            </Box>

            {/* Section 1: KPIs et Tableau des Personnes */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                    Section 1: KPIs et Gestion des Personnes
                </Typography>

                {/* KPIs avec filtres */}
                <SellerKPIs
                    sellerLeads={sellerLeads}
                    activeFilter={activePhaseFilter}
                    onFilterChange={setActivePhaseFilter}
                />

                {/* Indicateur de filtre actif */}
                {activePhaseFilter !== 'TOTAL' && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                            Filtre actif: <strong>
                                {activePhaseFilter === 'PROSPECT' && 'Prospect'}
                                {activePhaseFilter === 'PROSPECT_QUALIFIE' && 'Prospect Qualifié'}
                                {activePhaseFilter === 'CLIENT' && 'Client'}
                                {activePhaseFilter === 'APRES_VENTE' && 'Après Vente'}
                            </strong>
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => setActivePhaseFilter('TOTAL')}
                            variant="outlined"
                        >
                            Réinitialiser le filtre
                        </Button>
                    </Box>
                )}

                {/* Tableau des personnes */}
                <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
                    Tableau des Personnes
                </Typography>
                <SellerPersonsTable
                    sellerLeads={sellerLeads}
                    activeFilter={activePhaseFilter}
                />
            </Paper>

            {/* Section 2: Annonces Scrappées (gardée identique) */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                    Section 2: Annonces Scrappées
                </Typography>

                {/* KPI Cards - Clickable Filters pour les annonces */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <KpiCard
                        title="Total Prospects"
                        value={stats.total}
                        color="#2196f3"
                        filterType="ALL"
                    />
                    <KpiCard
                        title="Qualifiés"
                        value={stats.qualified}
                        color="#4caf50"
                        filterType="QUALIFIED"
                    />
                    <KpiCard
                        title="Non Qualifiés"
                        value={stats.nonQualified}
                        color="#9e9e9e"
                        filterType="NON_QUALIFIED"
                    />
                    <KpiCard
                        title="Contactés"
                        value={stats.contacted}
                        color="#ff9800"
                        filterType="CONTACTED"
                    />
                    <KpiCard
                        title="Non Contactés"
                        value={stats.nonContacted}
                        color="#f44336"
                        filterType="NON_CONTACTED"
                    />
                </Grid>

                {/* Active Filter Indicator */}
                {activeFilter !== 'ALL' && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body1" color="text.secondary">
                            Filtre actif: <strong>
                                {activeFilter === 'QUALIFIED' && 'Qualifiés'}
                                {activeFilter === 'NON_QUALIFIED' && 'Non Qualifiés'}
                                {activeFilter === 'CONTACTED' && 'Contactés'}
                                {activeFilter === 'NON_CONTACTED' && 'Non Contactés'}
                            </strong>
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => setActiveFilter('ALL')}
                            variant="outlined"
                        >
                            Réinitialiser le filtre
                        </Button>
                    </Box>
                )}

                {/* Seller Leads Table */}
                <SellerLeadsList
                    sellerLeads={filteredLeads}
                    onMarkContacted={handleMarkContacted}
                    onConvertToContact={handleConvertToContact}
                    onDelete={handleDelete}
                />
            </Paper>
        </Box>
    );
};

export default SellerProspection;
