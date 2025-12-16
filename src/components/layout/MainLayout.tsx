import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Avatar, Divider } from '@mui/material';
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
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const drawerWidth = 260;

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [commercialOpen, setCommercialOpen] = useState(false);
    const [activitesOpen, setActivitesOpen] = useState(false);
    const [vendeurOpen, setVendeurOpen] = useState(false);

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
        { text: 'Objectifs', icon: <AssessmentIcon />, path: '/goals' },
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

    const menuItemStyle = (isSelected: boolean) => ({
        borderRadius: '10px',
        mx: 1,
        mb: 0.5,
        color: isSelected ? '#3b82f6' : '#64748b',
        bgcolor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
        '&:hover': {
            bgcolor: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(100, 116, 139, 0.08)',
        },
        '& .MuiListItemIcon-root': {
            color: isSelected ? '#3b82f6' : '#94a3b8',
            minWidth: 40,
        },
        '& .MuiListItemText-primary': {
            fontWeight: isSelected ? 600 : 500,
            fontSize: '0.875rem',
        },
    });

    const subMenuItemStyle = (isSelected: boolean) => ({
        ...menuItemStyle(isSelected),
        pl: 4,
    });

    const nestedSubMenuItemStyle = (isSelected: boolean) => ({
        ...menuItemStyle(isSelected),
        pl: 6,
    });

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            <CssBaseline />
            
            {/* Sidebar */}
            <Box
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    bgcolor: 'white',
                    borderRight: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    overflowY: 'auto',
                }}
            >
                {/* Logo Header */}
                <Box
                    sx={{
                        p: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        borderBottom: '1px solid #e2e8f0',
                    }}
                >
                    <Avatar
                        sx={{
                            bgcolor: '#3b82f6',
                            width: 40,
                            height: 40,
                        }}
                    >
                        <HomeWorkIcon sx={{ fontSize: 22 }} />
                    </Avatar>
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                color: '#1e293b',
                                lineHeight: 1.2,
                            }}
                        >
                            Real Estate
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '0.7rem',
                                color: '#94a3b8',
                                fontWeight: 500,
                                letterSpacing: '0.5px',
                            }}
                        >
                            CRM PRO
                        </Typography>
                    </Box>
                </Box>

                {/* Navigation */}
                <Box sx={{ flex: 1, py: 2 }}>
                    <Typography
                        sx={{
                            px: 3,
                            py: 1,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: '#94a3b8',
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                        }}
                    >
                        Menu Principal
                    </Typography>

                    <List sx={{ px: 0 }}>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={menuItemStyle(location.pathname === item.path)}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {/* Activités */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleActivitesClick}
                                sx={menuItemStyle(isActivitesActive)}
                            >
                                <ListItemIcon><EventNoteIcon /></ListItemIcon>
                                <ListItemText primary="Activités" />
                                {activitesOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={activitesOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    sx={subMenuItemStyle(location.pathname === '/assistant')}
                                    onClick={() => navigate('/assistant')}
                                >
                                    <ListItemIcon><SearchIcon /></ListItemIcon>
                                    <ListItemText primary="Assistant" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={subMenuItemStyle(location.pathname.startsWith('/calendar'))}
                                    onClick={() => navigate('/calendar')}
                                >
                                    <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                                    <ListItemText primary="Calendrier" />
                                </ListItemButton>
                            </List>
                        </Collapse>

                        {/* Commercial */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleCommercialClick}
                                sx={menuItemStyle(isCommercialActive)}
                            >
                                <ListItemIcon><BusinessCenterIcon /></ListItemIcon>
                                <ListItemText primary="Commercial" />
                                {commercialOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                        </ListItem>
                        <Collapse in={commercialOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    sx={subMenuItemStyle(location.pathname === '/contacts')}
                                    onClick={() => navigate('/contacts')}
                                >
                                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                                    <ListItemText primary="Contacts" />
                                </ListItemButton>
                                <ListItemButton
                                    sx={subMenuItemStyle(location.pathname.startsWith('/mandat'))}
                                    onClick={() => navigate('/mandat')}
                                >
                                    <ListItemIcon><MonetizationOnIcon /></ListItemIcon>
                                    <ListItemText primary="Mandats" />
                                </ListItemButton>
                                
                                {/* Vendeur nested */}
                                <ListItemButton
                                    sx={subMenuItemStyle(isVendeurActive)}
                                    onClick={handleVendeurClick}
                                >
                                    <ListItemIcon><SearchIcon /></ListItemIcon>
                                    <ListItemText primary="Vendeurs" />
                                    {vendeurOpen ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={vendeurOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton
                                            sx={nestedSubMenuItemStyle(location.pathname === '/vendeur/personnes')}
                                            onClick={() => navigate('/vendeur/personnes')}
                                        >
                                            <ListItemIcon><PersonIcon /></ListItemIcon>
                                            <ListItemText primary="Gestion" />
                                        </ListItemButton>
                                        <ListItemButton
                                            sx={nestedSubMenuItemStyle(location.pathname === '/vendeur/annonces')}
                                            onClick={() => navigate('/vendeur/annonces')}
                                        >
                                            <ListItemIcon><ArticleIcon /></ListItemIcon>
                                            <ListItemText primary="Prospection" />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </List>
                        </Collapse>
                    </List>
                </Box>

                {/* User Profile */}
                <Box sx={{ borderTop: '1px solid #e2e8f0' }}>
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: '#e2e8f0',
                                color: '#64748b',
                                width: 36,
                                height: 36,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                            }}
                        >
                            U
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    color: '#1e293b',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Utilisateur
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '0.75rem',
                                    color: '#94a3b8',
                                }}
                            >
                                Agent immobilier
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: `${drawerWidth}px`,
                    minHeight: '100vh',
                    bgcolor: '#f8fafc',
                }}
            >
                <Box sx={{ p: 3, maxWidth: '100%' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;
