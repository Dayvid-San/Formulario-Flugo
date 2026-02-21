import { 
    Box, Button, Typography, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, 
    Paper, Avatar, Chip 
  } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

interface DashboardProps {
    onAddNew: () => void;
}
export const Dashboard = ({ onAddNew }: DashboardProps) => {
    return (
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
        {/* Sidebar Simples */}
        <Box sx={{ width: 250, bgcolor: 'white', borderRight: '1px solid #ddd', p: 2 }}>
          <img src="/logo-flugo.png" alt="Flugo" style={{ width: 100, marginBottom: 40 }} />
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#666' }}>
            Colaboradores
          </Typography>
        </Box>
  
        {/* Conteúdo Principal */}
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">Colaboradores</Typography>
            <Button 
                variant="contained" 
                onClick={onAddNew} // Use a prop aqui no botão "Novo Colaborador"
                sx={{ bgcolor: '#00c853' }}
                >
                    Novo Colaborador
            </Button>
          </Box>
  
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Mapeie seus dados do Firebase aqui futuramente */}
                <TableRow>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src="/path/to/avatar.png" /> Fernanda Torres
                  </TableCell>
                  <TableCell>fernandatorres@flugo.com</TableCell>
                  <TableCell>Design</TableCell>
                  <TableCell>
                  <Chip 
                    label="Ativo" 
                    color="success" 
                    variant="outlined" // Ou remova esta linha para o preenchimento sólido
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  };