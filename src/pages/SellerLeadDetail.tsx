import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Button,
    GridLegacy as Grid,
    Paper,
    Chip,
    Divider,
    Card,
    CardMedia,
    IconButton,
    Stack,
} from '@mui/material';
import {
    ArrowBack,
    Phone,
    PersonAdd,
    NavigateBefore,
    NavigateNext,
    LocationOn,
    CalendarMonth,
    CheckCircle,
    PhoneEnabled,
} from '@mui/icons-material';
import { useSellerLeads } from '../context/SellerLeadsContext';
import { useContacts } from '../context/ContactsContext';

const SellerLeadDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { sellerLeads, markAsContacted, convertToContact } = useSellerLeads();
    const { addContact } = useContacts();

    const lead = id ? sellerLeads.find(l => l.id === id) : null;

    if (!lead) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
                <Typography variant="h5" color="text.secondary">Prospect introuvable</Typography>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/seller-prospection')}
                    variant="contained"
                    size="large"
                >
                    Retour à la liste
                </Button>
            </Box>
        );
    }

    const handleMarkContacted = () => {
        markAsContacted(lead.id);
    };

    const handleMarkQualified = () => {
        const names = lead.sellerName.split(' ');
        const firstName = names[0] || '';
        const lastName = names.slice(1).join(' ') || '';

        addContact({
            firstName,
            lastName,
            phone: lead.phone,
            email: '',
            notes: `✓ Qualifié depuis: ${lead.title}\n📍 ${lead.region}\n🔗 ${lead.source}\n\n${lead.description}`,
        });

        convertToContact(lead.id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    // Navigation
    const currentIndex = sellerLeads.findIndex(l => l.id === id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < sellerLeads.length - 1;
    const previousId = hasPrevious ? sellerLeads[currentIndex - 1].id : null;
    const nextId = hasNext ? sellerLeads[currentIndex + 1].id : null;

    return (
        <Box sx={{ maxWidth: 1400, mx: 'auto', pb: 6 }}>
            {/* Minimal Top Navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <IconButton
                    onClick={() => navigate('/seller-prospection')}
                    sx={{
                        bgcolor: '#f5f5f5',
                        '&:hover': { bgcolor: '#e0e0e0' }
                    }}
                >
                    <ArrowBack />
                </IconButton>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => previousId && navigate(`/seller-prospection/${previousId}`)}
                        disabled={!hasPrevious}
                        sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' } }}
                    >
                        <NavigateBefore />
                    </IconButton>
                    <IconButton
                        onClick={() => nextId && navigate(`/seller-prospection/${nextId}`)}
                        disabled={!hasNext}
                        sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' } }}
                    >
                        <NavigateNext />
                    </IconButton>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* Status Badge */}
                {lead.convertedToContact ? (
                    <Chip
                        icon={<CheckCircle sx={{ fontSize: 18 }} />}
                        label="Qualifié"
                        sx={{
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            fontWeight: 600,
                            px: 2,
                            py: 2.5,
                        }}
                    />
                ) : lead.contacted ? (
                    <Chip
                        label="Contacté"
                        sx={{
                            bgcolor: '#fff3e0',
                            color: '#e65100',
                            fontWeight: 600,
                            px: 2,
                            py: 2.5,
                        }}
                    />
                ) : (
                    <Chip
                        label="Nouveau"
                        sx={{
                            bgcolor: '#e3f2fd',
                            color: '#1565c0',
                            fontWeight: 600,
                            px: 2,
                            py: 2.5,
                        }}
                    />
                )}
            </Box>

            {/* Hero Section - Title & Meta */}
            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="h3"
                    fontWeight="700"
                    sx={{
                        mb: 2,
                        color: '#1a1a1a',
                        letterSpacing: '-0.5px'
                    }}
                >
                    {lead.title}
                </Typography>

                <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ color: '#666' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 20, color: '#999' }} />
                        <Typography variant="body1" fontWeight="500">{lead.region}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarMonth sx={{ fontSize: 20, color: '#999' }} />
                        <Typography variant="body1" fontWeight="500">{formatDate(lead.listingDate)}</Typography>
                    </Box>
                    <Chip
                        label={lead.source}
                        size="small"
                        sx={{
                            bgcolor: '#f5f5f5',
                            color: '#666',
                            fontWeight: 500
                        }}
                    />
                </Stack>
            </Box>

            <Grid container spacing={4}>
                {/* Main Content - Photos & Description */}
                <Grid item xs={12} md={8}>
                    <Stack spacing={4}>
                        {/* Photo Gallery */}
                        {lead.photos && lead.photos.length > 0 && (
                            <Box>
                                <Grid container spacing={2}>
                                    {lead.photos.map((photo, index) => (
                                        <Grid item xs={12} sm={index === 0 ? 12 : 6} key={index}>
                                            <Card
                                                elevation={0}
                                                sx={{
                                                    borderRadius: 3,
                                                    overflow: 'hidden',
                                                    border: '1px solid #f0f0f0',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                                    }
                                                }}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    height={index === 0 ? 400 : 250}
                                                    image={photo}
                                                    alt={`Photo ${index + 1}`}
                                                    sx={{ objectFit: 'cover' }}
                                                />
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {/* Description */}
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                gutterBottom
                                sx={{ mb: 2, color: '#1a1a1a' }}
                            >
                                Description
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    lineHeight: 1.8,
                                    color: '#555',
                                    fontSize: '1.05rem',
                                    whiteSpace: 'pre-wrap'
                                }}
                            >
                                {lead.description}
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>

                {/* Sidebar - Contact & Actions */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'sticky', top: 20 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid #f0f0f0',
                                bgcolor: '#fafafa'
                            }}
                        >
                            {/* Seller Info */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: '#999',
                                        fontWeight: 600,
                                        letterSpacing: 1
                                    }}
                                >
                                    Vendeur
                                </Typography>
                                <Typography variant="h5" fontWeight="600" sx={{ mt: 1, mb: 2 }}>
                                    {lead.sellerName}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <PhoneEnabled sx={{ color: '#666', fontSize: 20 }} />
                                    <Typography variant="h6" fontWeight="500" color="primary">
                                        {lead.phone}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Action Buttons */}
                            <Stack spacing={2}>
                                {/* Call Button - Primary */}
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    href={`tel:${lead.phone}`}
                                    sx={{
                                        py: 1.8,
                                        bgcolor: '#1a1a1a',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            bgcolor: '#333',
                                            boxShadow: 'none',
                                        }
                                    }}
                                >
                                    📞 Appeler
                                </Button>

                                {/* Qualify Button */}
                                {!lead.convertedToContact && (
                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        onClick={handleMarkQualified}
                                        startIcon={<CheckCircle />}
                                        sx={{
                                            py: 1.8,
                                            bgcolor: '#4caf50',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                bgcolor: '#45a049',
                                                boxShadow: 'none',
                                            }
                                        }}
                                    >
                                        Marquer comme Qualifié
                                    </Button>
                                )}

                                {/* Mark Contacted */}
                                {!lead.contacted && !lead.convertedToContact && (
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        fullWidth
                                        onClick={handleMarkContacted}
                                        sx={{
                                            py: 1.8,
                                            borderColor: '#e0e0e0',
                                            color: '#666',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: '#bdbdbd',
                                                bgcolor: '#fafafa',
                                            }
                                        }}
                                    >
                                        Marquer comme Contacté
                                    </Button>
                                )}
                            </Stack>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SellerLeadDetail;
