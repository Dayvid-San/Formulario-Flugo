import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, List, 
  ListItem, ListItemText, IconButton, Divider, CircularProgress 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { db } from '../services/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';


export const DepartmentsPage = () => {
  const [deptName, setDeptName] = useState('');
  const [departments, setDepartments] = useState<{id: string, nome: string}[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca departamentos em tempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "departamentos"), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, nome: d.data().nome }));
      setDepartments(data);
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, "departamentos"), { nome: deptName });
      setDeptName('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Excluir este departamento?")) {
      await deleteDoc(doc(db, "departamentos", id));
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" color="#546e7a" gutterBottom>
        Departamentos
      </Typography>

      <Paper component="form" onSubmit={handleAdd} sx={{ p: 2, mb: 4, display: 'flex', gap: 2 }}>
        <TextField 
          fullWidth 
          label="Nome do Departamento" 
          value={deptName}
          onChange={(e) => setDeptName(e.target.value)}
          disabled={loading}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="success" 
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
          disabled={loading}
        >
          Adicionar
        </Button>
      </Paper>

      <Paper>
        <List>
          {departments.map((dept, index) => (
            <React.Fragment key={dept.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" color="error" onClick={() => handleDelete(dept.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={dept.nome} />
              </ListItem>
              {index < departments.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {departments.length === 0 && (
            <Typography sx={{ p: 3, textAlign: 'center', color: '#999' }}>
              Nenhum departamento cadastrado.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};