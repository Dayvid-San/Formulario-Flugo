import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography, MenuItem } from '@mui/material';
import React from 'react';


const jobSchema = z.object({
  cargo: z.string().min(1, "O cargo é obrigatório"),
});

type JobFormData = z.infer<typeof jobSchema>;

export const StepJobData = ({ onNext, onBack, data }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      cargo: data?.cargo || "",
    }
  });

  const greenInputStyle = {
    '& label.Mui-focused': { color: '#00c853' },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: '#00c853', borderWidth: '2px' },
    }
  };

  const opcoesCargos = [
    { value: "TI", label: "TI" },
    { value: "Marketing", label: "Marketing" },
    { value: "Design", label: "Design" },
    { value: "Produto", label: "Produto" },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#546e7a' }}>
        Informações Profissionais
      </Typography>
      
      <Grid container spacing={4} sx={{ flexGrow: 1 }}>
        <Grid size={{ xs: 12 }}>
          <TextField 
            select
            {...register('cargo')} 
            label="Selecione um departamento/cargo" 
            fullWidth 
            error={!!errors.cargo} 
            helperText={errors.cargo?.message} 
            InputLabelProps={{ shrink: true }} 
            sx={greenInputStyle}
          >
            <MenuItem value="" disabled>
              <em>Selecione...</em>
            </MenuItem>
            
            {opcoesCargos.map((opcao) => (
              <MenuItem key={opcao.value} value={opcao.value}>
                {opcao.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
        <Button onClick={onBack} sx={{ color: '#9e9e9e', textTransform: 'none', fontWeight: 'bold' }}>
          Voltar
        </Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: '#00c853', '&:hover': { bgcolor: '#00a844' }, textTransform: 'none', fontWeight: 'bold', px: 4, borderRadius: 2 }}>
          Concluir
        </Button>
      </Box>
    </Box>
  );
};