import { Typography, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Vendeur = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Vendeur
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Gestion des vendeurs, prospects et annonces
                </Typography>
            </Box>
            <Outlet />
        </Box>
    );
};

export default Vendeur;

