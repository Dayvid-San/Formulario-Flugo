import React, { useState, useRef } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Avatar, Chip, TextField, MenuItem, 
  IconButton, Checkbox, TableSortLabel, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Collaborator, SortKey, LEVEL_OPTIONS } from '../types/collaborator';




interface CollaboratorTableProps {
  collaborators: Collaborator[];
  selected: string[];
  sortBy: SortKey;
  order: 'asc' | 'desc';
  dbDepartments: { value: string, label: string }[];
  levelOptions: { value: string, label: string }[];
  onSortClick: (property: SortKey) => void;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  onUpdateField: (id: string, field: string, newValue: any) => void;
  onDelete: (id: string) => void;
}

const EditableAvatar = ({ name, imageUrl, onSave }: { name: string, imageUrl: string | undefined, onSave: (base64: string) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onSave(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
      <Avatar 
        {...(imageUrl ? { src: imageUrl } : {})} 
        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
        sx={{ bgcolor: '#00c853', width: 32, height: 32, cursor: 'pointer', transition: 'opacity 0.2s', '&:hover': { opacity: 0.7 } }}
      >
        {!imageUrl && name ? name.charAt(0).toUpperCase() : 'C'}
      </Avatar>
    </>
  );
};

const EditableTableCell = ({ initialValue, onSave, avatar, options }: { initialValue: string, onSave: (val: string) => void, avatar?: React.ReactNode, options?: { label: string, value: string }[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) onSave(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
    else if (e.key === 'Escape') { setIsEditing(false); setValue(initialValue); }
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
              if (options) { onSave(e.target.value); setIsEditing(false); }
            }}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus={!options}
            variant="standard"
            size="small"
            fullWidth
            sx={{ input: { color: '#00c853', fontWeight: 'bold' } }}
          >
            {options?.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
          </TextField>
        ) : (
          <Typography variant="body2">{value}</Typography>
        )}
      </Box>
    </TableCell>
  );
};

export const CollaboratorTable = ({
  collaborators,
  selected,
  sortBy,
  order,
  dbDepartments,
  levelOptions,
  onSortClick,
  onSelectAll,
  onSelectOne,
  onUpdateField,
  onDelete
}: CollaboratorTableProps) => {

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #eee', overflowX: 'auto'}}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: '#f8f9fa' }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < collaborators.length}
                  checked={collaborators.length > 0 && selected.length === collaborators.length}
                  onChange={onSelectAll}
              />
            </TableCell>
            
            <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>
              <TableSortLabel active={sortBy === 'titulo'} direction={sortBy === 'titulo' ? order : 'asc'} onClick={() => onSortClick('titulo')}>
                Nome
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>
              <TableSortLabel active={sortBy === 'email'} direction={sortBy === 'email' ? order : 'asc'} onClick={() => onSortClick('email')}>
                Email
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>
              <TableSortLabel active={sortBy === 'cargo'} direction={sortBy === 'cargo' ? order : 'asc'} onClick={() => onSortClick('cargo')}>
                Departamento
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>
              <TableSortLabel active={sortBy === 'nivel'} direction={sortBy === 'nivel' ? order : 'asc'} onClick={() => onSortClick('nivel')}>
                Nível
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>
              <TableSortLabel active={sortBy === 'salario'} direction={sortBy === 'salario' ? order : 'asc'} onClick={() => onSortClick('salario')}>
                Salário
              </TableSortLabel>
            </TableCell>

            <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: '#546e7a' }}></TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {collaborators.map((collaborator) => {
            const isItemSelected = selected.includes(collaborator.id);
            return (
            <TableRow key={collaborator.id} hover selected={isItemSelected}>
              <TableCell padding="checkbox">
                <Checkbox color="primary" checked={isItemSelected} onChange={(event) => onSelectOne(event, collaborator.id)} />
              </TableCell>
              
              <EditableTableCell 
                initialValue={collaborator.titulo || ''} 
                onSave={(newValue) => onUpdateField(collaborator.id, 'titulo', newValue)}
                avatar={
                  <EditableAvatar 
                    name={collaborator.titulo || ''} 
                    imageUrl={collaborator.avatarUrl}
                    onSave={(base64) => onUpdateField(collaborator.id, 'avatarUrl', base64)} 
                  />
                }
              />

              <EditableTableCell 
                initialValue={collaborator.email || ''} 
                onSave={(newValue) => onUpdateField(collaborator.id, 'email', newValue)}
              />

              <EditableTableCell 
                initialValue={collaborator.cargo || ''} 
                options={dbDepartments}
                onSave={(newValue) => onUpdateField(collaborator.id, 'cargo', newValue)}
              />

              <EditableTableCell 
                initialValue={collaborator.nivel || 'Júnior'} 
                options={levelOptions}
                onSave={(newValue) => onUpdateField( collaborator.id, 'nivel', newValue)}
              />
              
              <EditableTableCell 
                initialValue={collaborator.salario ? `R$ ${Number(collaborator.salario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00'} 
                onSave={(newValue) => {
                  const numericValue = newValue.replace(/\D/g, "");
                  onUpdateField(collaborator.id, 'salario', Number(numericValue) / 100);
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
                <IconButton onClick={() => onDelete(collaborator.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          )})}
          
          {collaborators.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#999' }}>
                Nenhum colaborador encontrado para esta busca.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};