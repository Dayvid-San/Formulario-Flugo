import React from 'react';
import { Box } from '@mui/material';

// Layout e Hooks
import { NavbarsLayout } from '../../components/NavbarsLayout';
import { useDashboardData } from '../../hooks/useDashboardData';
import { LEVEL_OPTIONS } from '../../types/collaborator';

// Sub-componentes Refatorados
import { StatCardsGroup } from '../../components/StatCardsGroup';
import { DashboardHeader } from '../../components/DashboardHeader';
import { FilterBar } from '../../components/FilterBar';
import { CollaboratorTable } from '../../components/CollaboratorTable';

interface DashboardProps {
  onAddNew: () => void;
}

export const Dashboard = ({ onAddNew }: DashboardProps) => {
  // Extraímos tudo do nosso Custom Hook
  const {
    sortedCollaborators,
    dbDepartments,
    stats,
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    sortBy,
    setSortBy,
    order,
    toggleOrder,
    selected,
    setSelected,
    updateField,
    deleteCollaborator,
    deleteSelected
  } = useDashboardData();

  // Handlers locais para eventos da tabela
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? sortedCollaborators.map((c) => c.id) : []);
  };

  const handleSelectOne = (_: any, id: string) => {
    setSelected((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <NavbarsLayout>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          
          {/* 1. Indicadores Visuais */}
          <StatCardsGroup 
            totalCollaborators={stats.total}
            averageSalary={stats.avgSalary}
            largestDepartment={stats.largestDept}
          />

          {/* 2. Título e Ações Globais (Export/Add) */}
          <DashboardHeader 
            title="Colaboradores"
            onAddNew={onAddNew}
            selectedCount={selected.length}
            onDeleteSelected={deleteSelected}
            dataToExport={sortedCollaborators}
          />

          {/* 3. Filtros, Busca e Ordenação */}
          <FilterBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            departments={dbDepartments}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            order={order}
            onOrderToggle={toggleOrder}
          />
          
          {/* 4. A Tabela Principal */}
          <CollaboratorTable 
            collaborators={sortedCollaborators}
            selected={selected}
            sortBy={sortBy}
            order={order}
            dbDepartments={dbDepartments}
            levelOptions={LEVEL_OPTIONS}
            onSortClick={(property) => {
              if (sortBy === property) toggleOrder();
              else setSortBy(property);
            }}
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