import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import React from 'react';

const addressSchema = z.object({
  cep: z.string().min(8, "CEP inválido"),
  logradouro: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "UF é obrigatória"),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const StepAddressData = ({ onNext, onBack, data }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: data
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)}>
      <Typography variant="h6" sx={{ mb: 3 }}>Endereço</Typography>
      
      <Grid container spacing={2}>
        
        <Grid item xs={12} sm={4}>
          <TextField {...register('cep')} label="CEP" fullWidth error={!!errors.cep} helperText={errors.cep?.message} />
        </Grid>
        
        <Grid item xs={12} sm={8}>
          <TextField {...register('logradouro')} label="Rua" fullWidth error={!!errors.logradouro} helperText={errors.logradouro?.message} />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField {...register('numero')} label="Número" fullWidth error={!!errors.numero} helperText={errors.numero?.message} />
        </Grid>
        
        <Grid item xs={12} sm={5}>
          <TextField {...register('cidade')} label="Cidade" fullWidth error={!!errors.cidade} helperText={errors.cidade?.message} />
        </Grid>
        
        <Grid item xs={12} sm={3}>
          <TextField {...register('estado')} label="UF" fullWidth error={!!errors.estado} helperText={errors.estado?.message} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack}>Voltar</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: '#00c853' }}>Próximo</Button>
      </Box>
    </Box>
  );
};