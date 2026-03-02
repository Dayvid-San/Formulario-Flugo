import React, { useState } from 'react';
import { TableCell, TextField, Typography } from '@mui/material';

interface EditableTableCellProps {
  initialValue: string;
  onSave: (newValue: string) => void;
}

export const EditableTableCell = ({ initialValue, onSave }: EditableTableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleClick = () => {
    setIsEditing(true);
  };

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
    <TableCell onClick={handleClick} sx={{ cursor: 'pointer', height: '56px' }}>
      {isEditing ? (
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          variant="standard"
          size="small"
          fullWidth
        />
      ) : (
        <Typography variant="body2">{value}</Typography>
      )}
    </TableCell>
  );
};