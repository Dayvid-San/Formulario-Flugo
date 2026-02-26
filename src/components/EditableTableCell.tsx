import React, { useState } from 'react';
import { TableCell, TextField, Typography } from '@mui/material';

interface EditableTableCellProps {
  initialValue: string;
  onSave: (newValue: string) => void;
}

export const EditableTableCell = ({ initialValue, onSave }: EditableTableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  // Ativa o modo de edição
  const handleClick = () => {
    setIsEditing(true);
  };

  // Salva e sai do modo de edição quando o usuário clica fora
  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      onSave(value); // Chama a função para atualizar no banco
    }
  };

  // Permite salvar com "Enter" ou cancelar com "Esc"
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setValue(initialValue); // Reverte para o valor original
    }
  };

  return (
    <TableCell onClick={handleClick} sx={{ cursor: 'pointer', height: '56px' }}>
      {isEditing ? (
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus // Já foca no campo automaticamente ao clicar
          variant="standard" // Fica sem borda, mais discreto na tabela
          size="small"
          fullWidth
        />
      ) : (
        <Typography variant="body2">{value}</Typography>
      )}
    </TableCell>
  );
};