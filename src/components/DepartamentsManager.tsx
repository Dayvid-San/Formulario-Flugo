import { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  TextField, 
  Button 
} from '@mui/material';
import { NavbarsLayout } from './NavbarsLayout';
import DeleteIcon from '@mui/icons-material/Delete';

export const DepartamentManager = () => {
  const [departamentos, setDepartamentos] = useState<any[]>([]);
  const [newDepartment, setNewDepartment] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "departamentos"), (snapshot) => {
      setDepartamentos(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAddDepartment = async () => {
    if (newDepartment.trim() !== '') {
      await addDoc(collection(db, "departamentos"), { nome: newDepartment });
      setNewDepartment('');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    await deleteDoc(doc(db, "departamentos", id));
  };

  return (
    <NavbarsLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Departamentos</Typography>
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Novo Departamento"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              fullWidth
              variant="outlined"
            />
            <Button onClick={handleAddDepartment} variant="contained" color="primary" sx={{ px: 4 }}>
              Adicionar
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departamentos.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>{dept.nome}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleDeleteDepartment(dept.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </NavbarsLayout>
  );
};