import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import React from 'react';

const jobSchema = z.object({
  cargo: z.string().min(1, "O cargo é obrigatório"),
  salario: z.string().min(1, "O salário é obrigatório"),
});

type JobFormData = z.infer<typeof jobSchema>;

export const StepJobData = ({ onNext, onBack, data }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: data
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#455a64' }}>
        Cargo e Salário
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField 
            {...register('cargo')} 
            label="Cargo (Ex: Desenvolvedor Front-end)" 
            fullWidth 
            error={!!errors.cargo} 
            helperText={errors.cargo?.message} 
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField 
            {...register('salario')} 
            label="Salário (Ex: R$ 5.000,00)" 
            fullWidth 
            error={!!errors.salario} 
            helperText={errors.salario?.message} 
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 10 }}>
        <Button onClick={onBack} sx={{ color: '#90a4ae', textTransform: 'none' }}>
          Voltar
        </Button>
        {/* Como é a última etapa, o botão muda para Finalizar */}
        <Button type="submit" variant="contained" sx={{ bgcolor: '#00c853', px: 4, py: 1, textTransform: 'none' }}>
          Finalizar
        </Button>
      </Box>
    </Box>
  );
};