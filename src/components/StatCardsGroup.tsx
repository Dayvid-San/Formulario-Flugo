import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// Sub-componente interno para manter o arquivo organizado
const StatCard = ({ title, value, color }: { title: string, value: string | number, color: string }) => (
  <Paper sx={{ 
    p: 3, 
    flex: 1, 
    minWidth: '200px', 
    borderRadius: 3, 
    borderLeft: `6px solid ${color}`, 
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
      {title}
    </Typography>
    <Typography variant="h4" fontWeight="bold" sx={{ mt: 1, color: '#263238' }}>
      {value}
    </Typography>
  </Paper>
);

interface StatCardsGroupProps {
  totalCollaborators: number;
  averageSalary: number;
  largestDepartment: string;
}

export const StatCardsGroup = ({ 
  totalCollaborators, 
  averageSalary, 
  largestDepartment 
}: StatCardsGroupProps) => {
  
  // Formatação de moeda local
  const formattedSalary = averageSalary.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  return (
    <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
      <StatCard 
        title="Total de Colaboradores" 
        value={totalCollaborators} 
        color="#00c853" // Verde Flugo
      />
      <StatCard 
        title="Média Salarial" 
        value={formattedSalary} 
        color="#0288d1" // Azul
      />
      <StatCard 
        title="Maior Depto" 
        value={largestDepartment || "Nenhum"} 
        color="#ffa000" // Laranja
      />
    </Box>
  );
};
