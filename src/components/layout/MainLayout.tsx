import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const drawerWidth = 240;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [vendeurOpen, setVendeurOpen] = useState(false);

    // Check if we're on a vendeur page to keep it expanded
    useEffect(() => {
        if (location.pathname.startsWith('/vendeur')) {
            setVendeurOpen(true);
        }
    }, [location.pathname]);

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Contacts', icon: <PeopleIcon />, path: '/contacts' },
        { text: 'Assistant', icon: <SearchIcon />, path: '/assistant' },
        { text: 'Mandat', icon: <MonetizationOnIcon />, path: '/mandat' },
        { text: 'Goals', icon: <AssessmentIcon />, path: '/goals' },
        { text: 'Calendrier', icon: <CalendarTodayIcon />, path: '/calendar' },
    ];

    const handleVendeurClick = () => {
        setVendeurOpen(!vendeurOpen);
    };

    const isVendeurActive = location.pathname.startsWith('/vendeur');

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Real Estate CRM
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {/* Vendeur avec sous-catégories */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleVendeurClick}
                                selected={isVendeurActive}
                            >
                                <ListItemIcon>
                                    <SearchIcon />
                                </ListItemIcon>
                                <ListItemText primary="Vendeur" />
                                {vendeurOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={vendeurOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/vendeur/personnes')}
                                    selected={location.pathname === '/vendeur/personnes'}
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Gérer des Vendeurs" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/vendeur/annonces')}
                                    selected={location.pathname === '/vendeur/annonces'}
                                >
                                    <ListItemIcon>
                                        <ArticleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Prospecter des Vendeurs" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 2, width: 'calc(100% - 240px)', maxWidth: '100%' }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;
