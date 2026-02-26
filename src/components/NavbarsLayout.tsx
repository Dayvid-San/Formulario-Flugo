import { Box, Typography } from "@mui/material";
import React from 'react';


interface LayoutProps {
  children: React.ReactNode;
}

export const NavbarsLayout = ({ children }: LayoutProps) => {
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
            height: '100vh'
        }}>
            <img src="/logo-flugo.png" alt="Flugo" style={{ width: 100, marginBottom: 40 }} />
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#666' }}>
                Colaboradores
            </Typography>
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
            <Typography variant="subtitle2" fontWeight="bold" color="#666">Colaboradores</Typography>
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