import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box } from '@mui/material';
import React from 'react';

// Esquema de validação: Tudo é 'required' 
const schema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  cpf: z.string().min(11, "CPF deve ter pelo menos 11 dígitos"),
});

type FormData = z.infer<typeof schema>;

export const StepPersonalData = ({ onNext, data }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data // Para manter os dados se o usuário voltar
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        {...register('nome')}
        label="Nome Completo"
        error={!!errors.nome}
        helperText={errors.nome?.message}
        fullWidth
      />
      <TextField
        {...register('email')}
        label="E-mail"
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />
      <TextField
        {...register('cpf')}
        label="CPF"
        error={!!errors.cpf}
        helperText={errors.cpf?.message}
        fullWidth
      />
      <Button type="submit" variant="contained" size="large" sx={{ mt: 2, bgcolor: '#00c853' }}>
        Próximo Passo
      </Button>
    </Box>
  );
};