import React from 'react';
import { 
  Box, TextField, MenuItem, FormControl, 
  InputLabel, Select, IconButton 
} from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { SortKey, SelectOption } from '../types/collaborator';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: SelectOption[];
  sortBy: SortKey;
  onSortByChange: (value: SortKey) => void;
  order: 'asc' | 'desc';
  onOrderToggle: () => void;
}

export const FilterBar = ({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  sortBy,
  onSortByChange,
  order,
  onOrderToggle
}: FilterBarProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 3, 
      p: 2, 
      bgcolor: 'white', 
      borderRadius: 2, 
      border: '1px solid #eee', 
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {/* Busca por Nome */}
      <TextField
        label="Buscar por nome"
        variant="outlined"
        size="small"
        sx={{ flexGrow: 1, minWidth: '200px' }}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {/* Filtro por Departamento */}
      <TextField
        select
        label="Filtrar por Departamento"
        variant="outlined"
        size="small"
        sx={{ minWidth: '200px' }}
        value={departmentFilter}
        onChange={(e) => onDepartmentChange(e.target.value)}
      >
        <MenuItem value="Todos">Todos os Departamentos</MenuItem>
        {departments.map((dept) => (
          <MenuItem key={dept.value} value={dept.value}>
            {dept.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Ordenação */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        borderLeft: { xs: 'none', md: '1px solid #ddd' }, 
        pl: { xs: 0, md: 2 },
        ml: { xs: 0, md: 1 } 
      }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            label="Ordenar por"
            onChange={(e) => onSortByChange(e.target.value as SortKey)}
          >
            <MenuItem value="titulo">Nome</MenuItem>
            <MenuItem value="email">E-mail</MenuItem>
            <MenuItem value="cargo">Departamento</MenuItem>
            <MenuItem value="nivel">Nível</MenuItem>
            <MenuItem value="salario">Salário</MenuItem>
          </Select>
        </FormControl>

        <IconButton 
          onClick={onOrderToggle}
          sx={{ bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#eeeeee' } }}
        >
          <SwapVertIcon color={order === 'asc' ? 'primary' : 'secondary'} />
        </IconButton>
      </Box>
    </Box>
  );
};