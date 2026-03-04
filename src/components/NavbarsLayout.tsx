import React from 'react';
import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Tooltip } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface LayoutProps {
  children: React.ReactNode;
}

export const NavbarsLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Equipe', icon: <PeopleIcon />, path: '/dashboard' },
    { text: 'Departamentos', icon: <BusinessIcon />, path: '/departamentos' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5', flexDirection: { xs: 'column', md: 'row' } }}>
        
        <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            width: 250, 
            minWidth: 250, 
            bgcolor: 'white', 
            borderRight: '1px solid #ddd', 
            p: 3, 
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
            justifyContent: 'space-between'
        }}>
            <Box>
                <img src="/logo-flugo.png" alt="Flugo" style={{ width: 100, marginBottom: 40 }} />
                
                <List sx={{ p: 0 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton 
                                    onClick={() => navigate(item.path)}
                                    sx={{ 
                                        borderRadius: 2,
                                        bgcolor: isActive ? '#e8f5e9' : 'transparent',
                                        color: isActive ? '#00c853' : '#666',
                                        '&:hover': { bgcolor: '#f1f8e9' }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? '#00c853' : '#666', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Box>
                <Divider sx={{ mb: 2 }} />
                <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#d32f2f' }}>
                    <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary="Sair" />
                </ListItemButton>
            </Box>
        </Box>

        <Box sx={{ 
            display: { xs: 'flex', md: 'none' }, 
            p: 2, 
            bgcolor: 'white', 
            borderBottom: '1px solid #ddd', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
        }}>
            <img src="/logo-flugo.png" alt="Flugo" style={{ width: 80 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => navigate('/dashboard')} color={location.pathname === '/dashboard' ? 'primary' : 'default'}><PeopleIcon /></IconButton>
                <IconButton onClick={() => navigate('/departamentos')} color={location.pathname === '/departamentos' ? 'primary' : 'default'}><BusinessIcon /></IconButton>
                <IconButton onClick={handleLogout} color="error"><LogoutIcon /></IconButton>
            </Box>
        </Box>

        <Box sx={{ 
            flexGrow: 1, 
            p: { xs: 2, md: 4 },
            width: '100%',
            overflowX: 'hidden'
        }}>
            {children}
        </Box>
    </Box>
  );
};