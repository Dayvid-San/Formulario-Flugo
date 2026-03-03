import { 
  Box, Button, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Paper, Avatar, Chip, TextField, MenuItem, 
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { NavbarsLayout } from '../../components/NavbarsLayout';


interface EditableAvatarProps {
  name: string;
  imageUrl?: string;
  onSave: (base64Image: string) => void;
}

const EditableAvatar = ({ name, imageUrl, onSave }: EditableAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        hidden 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <Avatar 
        {...(imageUrl ? { src: imageUrl } : {})} 
        onClick={(e) => {
          e.stopPropagation(); 
          fileInputRef.current?.click();
        }}
        sx={{ 
          bgcolor: '#00c853', 
          width: 32, 
          height: 32, 
          cursor: 'pointer', 
          transition: 'opacity 0.2s',
          '&:hover': { opacity: 0.7 } 
        }}
      >
        {!imageUrl && name ? name.charAt(0).toUpperCase() : 'C'}
      </Avatar>
    </>
  );
};

interface EditableTableCellProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  avatar?: React.ReactNode; 
  options?: { label: string, value: string }[];
}

const EditableTableCell = ({ initialValue, onSave, avatar, options }: EditableTableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      onSave(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(initialValue);
    }
  };

  return (
    <TableCell 
      onClick={() => setIsEditing(true)} 
      sx={{ cursor: 'pointer', transition: 'background 0.2s', '&:hover': { bgcolor: '#f0fdf4' }, height: '56px' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {avatar}
        {isEditing ? (
          <TextField
            select={!!options} 
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (options) {
                onSave(e.target.value);
                setIsEditing(false);
              }
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus={!options}
            variant="standard"
            size="small"
            fullWidth
            sx={{ input: { color: '#00c853', fontWeight: 'bold' } }}
          >
            {options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <Typography variant="body2">{value}</Typography>
        )}
      </Box>
    </TableCell>
  );
};

interface DashboardProps {
  onAddNew: () => void;
}

export const Dashboard = ({ onAddNew }: DashboardProps) => {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [dbDepartments, setDbDepartments] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {
    const collaboratorsRef = collection(db, "colaboradores");
    const unsubscribe = onSnapshot(collaboratorsRef, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setCollaborators(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      const deptsRef = collection(db, "departamentos");
      const unsubscribe = onSnapshot(deptsRef, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          value: doc.data().nome, 
          label: doc.data().nome
        }));
        setDbDepartments(list);
      });
    
      return () => unsubscribe();
  }, []);

  const deleteCollaborator = async (id: string) => {
    if (window.confirm("Deseja realmente excluir este colaborador?")) {
      await deleteDoc(doc(db, "colaboradores", id));
    }
  };

  const updateField = async (id: string, field: string, newValue: string) => {
    try {
      const docRef = doc(db, "colaboradores", id);
      await updateDoc(docRef, {
        [field]: newValue
      });
    } catch (error) {
      console.error("Erro ao atualizar o Firebase:", error);
    }
  };

  return (
    <NavbarsLayout>
    
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" fontWeight="bold">Colaboradores</Typography>
          <Button 
            variant="contained" 
            onClick={onAddNew}
            sx={{ bgcolor: '#00c853', color: '#ffffff', px: { xs: 2, md: 4 }, fontSize: { xs: '0.8rem', md: '0.9rem' }, '&:hover': { bgcolor: '#00a844' }, textTransform: 'none', fontWeight: 'bold' }}
          >
            Novo Colaborador
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee', overflowX: 'auto'}}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Departamento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collaborators.map((collaborator) => (
                <TableRow key={collaborator.id} hover>
                  <EditableTableCell 
                    initialValue={collaborator.titulo || ''} 
                    onSave={(newValue) => updateField(collaborator.id, 'titulo', newValue)}
                    avatar={
                      <EditableAvatar 
                        name={collaborator.titulo || ''} 
                        imageUrl={collaborator.avatarUrl}
                        onSave={(base64) => updateField(collaborator.id, 'avatarUrl', base64)} 
                      />
                    }
                  />

                  <EditableTableCell 
                    initialValue={collaborator.email || ''} 
                    onSave={(newValue) => updateField(collaborator.id, 'email', newValue)}
                  />

                  <EditableTableCell 
                    initialValue={collaborator.cargo || ''} 
                    options={dbDepartments}
                    onSave={(newValue) => updateField(collaborator.id, 'cargo', newValue)}
                  />
                  
                  <TableCell>
                    <Chip 
                      label={collaborator.status === 'Ativo' ? 'Ativo' : 'Inativo'} 
                      color={collaborator.status === 'Ativo' ? 'success' : 'default'} 
                      variant={collaborator.status === 'Ativo' ? "filled" : "outlined"}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => deleteCollaborator(collaborator.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              
              {collaborators.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#999' }}>
                    Nenhum colaborador cadastrado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
    </NavbarsLayout>
  );
};
