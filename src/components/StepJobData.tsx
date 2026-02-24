import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography, MenuItem } from '@mui/material';
import React from 'react';

const jobSchema = z.object({
  cargo: z.string().min(1, "O cargo é obrigatório"),
  salario: z.string().min(1, "O salário é obrigatório"),
});

type JobFormData = z.infer<typeof jobSchema>;

export const StepJobData = ({ onNext, onBack, data }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      cargo: data?.cargo || "",
      salario: data?.salario || ""
    }
  });

  const greenInputStyle = {
    '& label.Mui-focused': { color: '#00c853' },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: '#00c853', borderWidth: '2px' },
    }
  };

  // Lista de cargos/departamentos para o Select
  const opcoesCargos = [
    { value: "Desenvolvedor Front-end", label: "Desenvolvedor Front-end" },
    { value: "Desenvolvedor Back-end", label: "Desenvolvedor Back-end" },
    { value: "Desenvolvedor Full-stack", label: "Desenvolvedor Full-stack" },
    { value: "Designer UI/UX", label: "Designer UI/UX" },
    { value: "Recursos Humanos", label: "Recursos Humanos" },
    { value: "Financeiro", label: "Financeiro" },
  ];

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#546e7a' }}>
        Informações Profissionais
      </Typography>
      
      <Grid container spacing={4} sx={{ flexGrow: 1 }}>
        <Grid size={{ xs: 12 }}>
          {/* Transformado em Select */}
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
            {/* Opção padrão desabilitada para forçar a escolha */}
            <MenuItem value="" disabled>
              <em>Selecione...</em>
            </MenuItem>
            
            {/* Mapeando as opções para criar a lista */}
            {opcoesCargos.map((opcao) => (
              <MenuItem key={opcao.value} value={opcao.value}>
                {opcao.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Botões - Voltar e Concluir */}
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