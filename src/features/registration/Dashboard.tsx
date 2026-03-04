import { 
  Box, Button, Typography, 
  TextField, MenuItem, 
  IconButton, FormControl, InputLabel, Select,
  Paper
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Serviços e Layout
import { db } from "../../services/firebase";
import { NavbarsLayout } from '../../components/NavbarsLayout';
import SwapVertIcon from '@mui/icons-material/SwapVert';

// Componentes e Types Refatorados
import { CollaboratorTable } from '../../components/CollaboratorTable';
import { Collaborator, SortKey, LEVEL_OPTIONS } from '../../types/collaborator';

interface DashboardProps {
  onAddNew: () => void;
}

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

export const Dashboard = ({ onAddNew }: DashboardProps) => {
  // Estados
  const [sortBy, setSortBy] = useState<SortKey>('titulo');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [dbDepartments, setDbDepartments] = useState<{ value: string, label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Todos');
  const [selected, setSelected] = useState<string[]>([]);

  // Listeners do Firebase
  useEffect(() => {
    const collaboratorsRef = collection(db, "colaboradores");
    const unsubscribe = onSnapshot(collaboratorsRef, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Collaborator[];
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

  // Lógica de Filtro e Busca
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(collaborator => {
      const matchesName = collaborator.titulo?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = departmentFilter === 'Todos' || collaborator.cargo === departmentFilter;
      return matchesName && matchesDept;
    });
  }, [collaborators, searchTerm, departmentFilter]);

  // Lógica de Ordenação
  const sortedCollaborators = useMemo(() => {
    return [...filteredCollaborators].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (sortBy === 'salario') {
        return order === 'asc' 
          ? Number(valueA || 0) - Number(valueB || 0) 
          : Number(valueB || 0) - Number(valueA || 0);
      }

      const strA = String(valueA || '').toLowerCase();
      const strB = String(valueB || '').toLowerCase();

      return order === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredCollaborators, sortBy, order]);

  // Cálculos de Estatísticas
  const collaboratorTotal = collaborators.length;
  const averageSalary = collaboratorTotal > 0 
    ? collaborators.reduce((acc, curr) => acc + (Number(curr.salario) || 0), 0) / collaboratorTotal 
    : 0;

  const getLargestDepartment = () => {
    if (collaboratorTotal === 0) return "Nenhum";
    const counts = collaborators.reduce((acc: any, curr) => {
      acc[curr.cargo] = (acc[curr.cargo] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // Handlers de Seleção e Exclusão
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = sortedCollaborators.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleSelectOne = (_event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const deleteCollaborator = async (id: string) => {
    if (window.confirm("Deseja realmente excluir este colaborador?")) {
      await deleteDoc(doc(db, "colaboradores", id));
    }
  };
  
  const handleDeleteSelected = async () => {
    if (window.confirm(`Deseja realmente excluir ${selected.length} colaborador(es)?`)) {
        try {
            const batch = writeBatch(db);
            selected.forEach(id => {
                const docRef = doc(db, "colaboradores", id);
                batch.delete(docRef);
            });
            await batch.commit();
            setSelected([]);
        } catch (e) {
            console.error("Erro ao excluir colaboradores: ", e);
        }
    }
  };

  // Handlers de Exportação
  const exportToPDF = () => {
    const pdfDoc = new jsPDF();
    const tableColumn = ["Nome", "Email", "Departamento", "Nível", "Salario", "Status"];
    const tableRows = sortedCollaborators.map(employee => [
      employee.titulo || '',
      employee.email || '',
      employee.cargo || '',
      employee.nivel || '',
      `R$ ${Number(employee.salario || 0).toLocaleString('pt-BR')}`,
      employee.status || 'Active'
    ]);
  
    autoTable(pdfDoc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [0, 200, 83] }
    });
  
    pdfDoc.text("Relatório de Colaboradores", 14, 15);
    pdfDoc.save(`colaboradores_${new Date().getTime()}.pdf`);
  };
  
  const exportToExcel = () => {
    const worksheetData = sortedCollaborators.map(employee => ({
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
    XLSX.writeFile(workbook, `relatorio_flugo.xlsx`);
  };

  // Handler de Atualização Inline
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

  const handleSortClick = (property: SortKey) => {
    const isAsc = sortBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };
  
  return (
    <NavbarsLayout>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Box sx={{ flexGrow: 1, p: 4 }}>
          
          {/* Cards de Estatísticas */}
          <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <StatCard title="Total de Colaboradores" value={collaboratorTotal} color="#00c853" />
              <StatCard title="Média Salarial" value={averageSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} color="#0288d1" />
              <StatCard title="Maior Depto" value={getLargestDepartment()} color="#ffa000" />
          </Box>

          {/* Cabeçalho de Ações */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" fontWeight="bold">Colaboradores</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {selected.length > 0 && (
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteSelected}>
                  Excluir ({selected.length})
                </Button>
              )}
              <Button variant="outlined" color="error" startIcon={<PictureAsPdfIcon />} onClick={exportToPDF}>PDF</Button>
              <Button variant="outlined" color="primary" startIcon={<TableChartIcon />} onClick={exportToExcel}>Excel</Button>
              <Button variant="contained" onClick={onAddNew} sx={{ bgcolor: '#00c853', '&:hover': { bgcolor: '#00a844' } }}>
                Novo Colaborador
              </Button>
            </Box>
          </Box>        

          {/* Barra de Filtros e Sort */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #eee', alignItems: 'center' }}>
            <TextField
              label="Buscar por nome"
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <TextField
              select
              label="Filtrar por Departamento"
              variant="outlined"
              size="small"
              sx={{ minWidth: '200px' }}
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <MenuItem value="Todos">Todos os Departamentos</MenuItem>
              {dbDepartments.map((dept) => (
                <MenuItem key={dept.value} value={dept.value}>{dept.label}</MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderLeft: '1px solid #ddd', pl: 2 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select value={sortBy} label="Ordenar por" onChange={(e) => setSortBy(e.target.value as SortKey)}>
                  <MenuItem value="titulo">Nome</MenuItem>
                  <MenuItem value="email">E-mail</MenuItem>
                  <MenuItem value="cargo">Departamento</MenuItem>
                  <MenuItem value="nivel">Nível</MenuItem>
                  <MenuItem value="salario">Salário</MenuItem>
                </Select>
              </FormControl>

              <IconButton onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>
                <SwapVertIcon color={order === 'asc' ? 'primary' : 'secondary'} />
              </IconButton>
            </Box>
          </Box>
          
          {/* Tabela de Colaboradores (Componente Separado) */}
          <CollaboratorTable 
              collaborators={sortedCollaborators}
              selected={selected}
              sortBy={sortBy}
              order={order}
              dbDepartments={dbDepartments}
              levelOptions={LEVEL_OPTIONS} // Usando do arquivo de types
              onSortClick={handleSortClick}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
              onUpdateField={updateField}
              onDelete={deleteCollaborator}
          />
        </Box>
      </Box>
    </NavbarsLayout>
  );
};