import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Collaborator } from '../types/collaborator';

interface DashboardHeaderProps {
  title: string;
  onAddNew: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  dataToExport: Collaborator[];
}

export const DashboardHeader = ({ 
  title, 
  onAddNew, 
  selectedCount, 
  onDeleteSelected, 
  dataToExport 
}: DashboardHeaderProps) => {

  const exportToPDF = () => {
    const pdfDoc = new jsPDF();
    const tableColumn = ["Nome", "Email", "Departamento", "Nível", "Salário", "Status"];
    const tableRows = dataToExport.map(employee => [
      employee.titulo || '',
      employee.email || '',
      employee.cargo || '',
      employee.nivel || '',
      `R$ ${Number(employee.salario || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      employee.status || 'Ativo'
    ]);
  
    autoTable(pdfDoc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [0, 200, 83] } // Verde Flugo
    });
  
    pdfDoc.text("Relatório de Colaboradores", 14, 15);
    pdfDoc.save(`relatorio_colaboradores_${new Date().getTime()}.pdf`);
  };
  
  const exportToExcel = () => {
    const worksheetData = dataToExport.map(employee => ({
      Nome: employee.titulo,
      Email: employee.email,
      Departamento: employee.cargo,
      Nivel: employee.nivel,
      Salario: employee.salario,
      Status: employee.status
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Colaboradores");
    XLSX.writeFile(workbook, `relatorio_flugo_${new Date().getTime()}.xlsx`);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 4, 
      flexWrap: 'wrap', 
      gap: 2 
    }}>
      <Typography variant="h5" fontWeight="bold" color="#263238">
        {title}
      </Typography>
      
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap', gap: { xs: 1, md: 0 } }}>
        {selectedCount > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDeleteSelected}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Excluir ({selectedCount})
          </Button>
        )}

        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<PictureAsPdfIcon />} 
          onClick={exportToPDF}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          PDF
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<TableChartIcon />} 
          onClick={exportToExcel}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          Excel
        </Button>

        <Button 
          variant="contained" 
          onClick={onAddNew}
          sx={{ 
            bgcolor: '#00c853', 
            color: '#ffffff', 
            px: 3,
            '&:hover': { bgcolor: '#00a844' }, 
            textTransform: 'none', 
            fontWeight: 'bold',
            boxShadow: 'none'
          }}
        >
          Novo Colaborador
        </Button>
      </Stack>
    </Box>
  );
};