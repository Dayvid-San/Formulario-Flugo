import { 
  Box, Button, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Paper, Avatar, Chip, TextField, MenuItem, 
  IconButton
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('Todos');

  const collaboratorTotal = collaborators.length;

  const levelOptions = [
    { value: 'Júnior', label: 'Júnior' },
    { value: 'Pleno', label: 'Pleno' },
    { value: 'Sênior', label: 'Sênior' },
    { value: 'Gestor', label: 'Gestor' },
  ];

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

  const filteredCollaborators = collaborators.filter(colab => {
    const matchesName = colab.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'Todos' || colab.cargo === filterDept;
    return matchesName && matchesDept;
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nome", "Email", "Departamento", "Nível", "Salario", "Status"];
    const tableRows: any[] = [];
  
    filteredCollaborators.forEach(employee => {
      const employeeData = [
        employee.titulo || '',
        employee.email || '',
        employee.cargo || '',
        employee.nivel || '',
        `R$ ${Number(employee.salario || 0).toLocaleString('pt-BR')}`,
        employee.status || 'Active'
      ];
      tableRows.push(employeeData);
    });
  
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [0, 200, 83] }
    });
  
    doc.text("Colaboradores", 14, 15);
    doc.save(`colaboradores_flugo_${new Date().getTime()}.pdf`);
  };
  
  const exportToExcel = () => {
    const worksheetData = filteredCollaborators.map(employee => ({
      Name: employee.titulo,
      Email: employee.email,
      Department: employee.cargo,
      Level: employee.nivel,
      Salary: employee.salario,
      Status: employee.status
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Colaboradores");
    
    XLSX.writeFile(workbook, `colaboradores_flugo_${new Date().getTime()}.xlsx`);
  };

  const updateField = async (id: string, field: string, newValue: any) => {
    try {
      const docRef = doc(db, "colaboradores", id);
      await updateDoc(docRef, {
        [field]: newValue,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };
  
  const averageSalary = collaboratorTotal > 0 
    ? collaborators.reduce((acc, curr) => acc + (Number(curr.salario) || 0), 0) / collaboratorTotal 
    : 0;

  const deptoMorePeaple = () => {
    if (collaboratorTotal === 0) return "Nenhum";
    const counts = collaborators.reduce((acc: any, curr) => {
      acc[curr.cargo] = (acc[curr.cargo] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
    <Paper sx={{ 
      p: 3, flex: 1, minWidth: '200px', borderRadius: 3, 
      borderLeft: `6px solid ${color}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' 
    }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: '#263238' }}>
        {value}
      </Typography>
    </Paper>
  );

  return (
    <NavbarsLayout>
    
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            <StatCard 
              title="Total de Colaboradores" 
              value={collaboratorTotal} 
              color="#00c853"
            />
            <StatCard 
              title="Média Salarial" 
              value={averageSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
              color="#0288d1"
            />
            <StatCard 
              title="Maior Depto" 
              value={deptoMorePeaple()} 
              color="#ffa000"
            />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4, 
          flexWrap: 'wrap', 
          gap: 2 
        }}>
          <Typography variant="h5" fontWeight="bold">Colaboradores</Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<PictureAsPdfIcon />} 
              onClick={exportToPDF}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Export PDF
            </Button>
            
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<TableChartIcon />} 
              onClick={exportToExcel}
              sx={{ textTransform: 'none', fontWeight: 'bold' }}
            >
              Export Excel
            </Button>

            <Button 
              variant="contained" 
              onClick={onAddNew}
              sx={{ 
                bgcolor: '#00c853', 
                color: '#ffffff', 
                px: { xs: 2, md: 3 }, 
                fontSize: { xs: '0.8rem', md: '0.9rem' }, 
                '&:hover': { bgcolor: '#00a844' }, 
                textTransform: 'none', 
                fontWeight: 'bold',
                boxShadow: 'none'
              }}
            >
              New Collaborator
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3, 
          flexWrap: 'wrap',
          p: 2,
          bgcolor: 'white',
          borderRadius: 2,
          border: '1px solid #eee'
        }}>
          <TextField
            label="Buscar por nome"
            variant="outlined"
            size="small"
            sx={{ flexGrow: 1, minWidth: '200px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <TextField
            select
            label="Filtrar por Departamento"
            variant="outlined"
            size="small"
            sx={{ minWidth: '200px' }}
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <MenuItem value="Todos">Todos os Departamentos</MenuItem>
            {dbDepartments.map((dept) => (
              <MenuItem key={dept.value} value={dept.value}>
                {dept.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee', overflowX: 'auto'}}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Departamento</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Nível</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Salário</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCollaborators.map((collaborator) => (
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

                  <EditableTableCell 
                        initialValue={collaborator.nivel || 'Júnior'} 
                        options={levelOptions}
                        onSave={(newValue) => updateField(collaborator.id, 'nivel', newValue)}
                  />
                  
                  <EditableTableCell 
                    initialValue={
                      collaborator.salario 
                        ? `R$ ${Number(collaborator.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                        : 'R$ 0,00'
                    } 
                    onSave={(newValue) => {
                      const numericValue = newValue.replace(/\D/g, "");
                      updateField(collaborator.id, 'salario', Number(numericValue) / 100);
                    }}
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
              
              {filteredCollaborators.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#999' }}>
                    Nenhum colaborador encontrado para esta busca.
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