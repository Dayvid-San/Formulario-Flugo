import { 
  Box, Button, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Paper, Avatar, Chip 
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";

interface DashboardProps {
  onAddNew: () => void;
}

export const Dashboard = ({ onAddNew }: DashboardProps) => {
  const [colaboradores, setColaboradores] = useState<any[]>([]);

  useEffect(() => {
    const colaboradoresRef = collection(db, "colaboradores");
    
    const unsubscribe = onSnapshot(colaboradoresRef, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setColaboradores(lista);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ width: 250, bgcolor: 'white', borderRight: '1px solid #ddd', p: 2 }}>
      <img src="/logo-flugo.png" alt="Flugo" style={{ width: 100, marginBottom: 40 }} />
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#666' }}>
          Colaboradores
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">Colaboradores</Typography>
          <Button 
            variant="contained" 
            onClick={onAddNew}
            sx={{ bgcolor: '#00c853', textTransform: 'none' }}
          >
            Novo Colaborador
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {colaboradores.map((colab) => (
                <TableRow key={colab.id}>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#00c853' }}>{colab.titulo ? colab.titulo.charAt(0).toUpperCase() : 'C'}</Avatar> 
                    {colab.titulo}
                  </TableCell>
                  <TableCell>{colab.email}</TableCell>
                  <TableCell>{colab.cargo}</TableCell>
                  <TableCell>
                    <Chip 
                      label={colab.status === 'Ativo' ? 'Ativo' : 'Inativo'} 
                      color={colab.status === 'Ativo' ? 'success' : 'default'} 
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
              
              {colaboradores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3, color: '#999' }}>
                    Nenhum colaborador cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};