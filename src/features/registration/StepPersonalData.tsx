import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import React from 'react';

// 1. Definição das regras de validação (Schema)
const personalSchema = z.object({
  nome: z.string().min(1, "O nome completo é obrigatório"),
  email: z.string().email("Introduza um e-mail válido").min(1, "O e-mail é obrigatório"),
  cpf: z.string().min(11, "O CPF deve ter pelo menos 11 dígitos"),
  telefone: z.string().min(1, "O telefone é obrigatório"),
});

// Extração do tipo através do Schema
type PersonalFormData = z.infer<typeof personalSchema>;

interface StepProps {
  onNext: (data: PersonalFormData) => void;
  data: Partial<PersonalFormData>; // Para persistir dados se o utilizador voltar
}

export const StepPersonalData = ({ onNext, data }: StepProps) => {
  // 2. Configuração do formulário
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: data, // Preenche com dados já existentes, se houver
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Dados Pessoais
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            {...register('nome')}
            label="Nome Completo"
            fullWidth
            required
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('email')}
            label="E-mail"
            type="email"
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('cpf')}
            label="CPF"
            fullWidth
            required
            error={!!errors.cpf}
            helperText={errors.cpf?.message}
            inputProps={{ maxLength: 14 }} // Opcional: máscara de CPF simplificada
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            {...register('telefone')}
            label="Telefone"
            fullWidth
            required
            error={!!errors.telefone}
            helperText={errors.telefone?.message}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ 
            bgcolor: '#00c853', 
            px: 4,
            '&:hover': { bgcolor: '#00a444' } 
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};