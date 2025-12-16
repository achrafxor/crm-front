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
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const drawerWidth = 240;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [commercialOpen, setCommercialOpen] = useState(false);
    const [activitesOpen, setActivitesOpen] = useState(false);
    const [vendeurOpen, setVendeurOpen] = useState(false);

    // Check if we're on a commercial-related page to keep it expanded
    useEffect(() => {
        if (location.pathname.startsWith('/vendeur') || 
            location.pathname === '/contacts' || 
            location.pathname.startsWith('/mandat')) {
            setCommercialOpen(true);
        }
        if (location.pathname === '/assistant' || location.pathname.startsWith('/calendar')) {
            setActivitesOpen(true);
        }
        if (location.pathname.startsWith('/vendeur')) {
            setVendeurOpen(true);
        }
    }, [location.pathname]);

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Goals', icon: <AssessmentIcon />, path: '/goals' },
    ];

    const handleCommercialClick = () => {
        setCommercialOpen(!commercialOpen);
    };

    const handleActivitesClick = () => {
        setActivitesOpen(!activitesOpen);
    };

    const handleVendeurClick = () => {
        setVendeurOpen(!vendeurOpen);
    };

    const isCommercialActive = location.pathname === '/contacts' || 
                               location.pathname.startsWith('/mandat') || 
                               location.pathname.startsWith('/vendeur');
    const isActivitesActive = location.pathname === '/assistant' || location.pathname.startsWith('/calendar');
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

                        {/* Activités avec sous-catégories */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleActivitesClick}
                                selected={isActivitesActive}
                            >
                                <ListItemIcon>
                                    <EventNoteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Activités" />
                                {activitesOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={activitesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/assistant')}
                                    selected={location.pathname === '/assistant'}
                                >
                                    <ListItemIcon>
                                        <SearchIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Assistant" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/calendar')}
                                    selected={location.pathname.startsWith('/calendar')}
                                >
                                    <ListItemIcon>
                                        <CalendarTodayIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Calendrier" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Commercial avec sous-catégories */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleCommercialClick}
                                selected={isCommercialActive}
                            >
                                <ListItemIcon>
                                    <BusinessCenterIcon />
                                </ListItemIcon>
                                <ListItemText primary="Commercial" />
                                {commercialOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={commercialOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/contacts')}
                                    selected={location.pathname === '/contacts'}
                                >
                                    <ListItemIcon>
                                        <PeopleIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Contacts" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={() => navigate('/mandat')}
                                    selected={location.pathname.startsWith('/mandat')}
                                >
                                    <ListItemIcon>
                                        <MonetizationOnIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Mandat" />
                                </ListItemButton>
                                {/* Vendeur avec sous-catégories */}
                                <ListItemButton
                                    sx={{ pl: 4 }}
                                    onClick={handleVendeurClick}
                                    selected={isVendeurActive}
                                >
                                    <ListItemIcon>
                                        <SearchIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Vendeur" />
                                    {vendeurOpen ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={vendeurOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={{ pl: 6 }}
                                            onClick={() => navigate('/vendeur/personnes')}
                                            selected={location.pathname === '/vendeur/personnes'}
                                        >
                                            <ListItemIcon>
                                                <PersonIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="Gérer des Vendeurs" />
                                        </ListItemButton>
                                        <ListItemButton
                                            sx={{ pl: 6 }}
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
