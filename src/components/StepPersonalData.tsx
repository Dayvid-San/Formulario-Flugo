import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Typography, 
  FormControlLabel, 
  Switch 
} from '@mui/material';
import React from 'react';

// Validação com Zod
const personalSchema = z.object({
  titulo: z.string().min(1, "O título (nome) é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  ativo: z.boolean(),
});

type PersonalFormData = z.infer<typeof personalSchema>;

export const StepPersonalData = ({ onNext, data }: any) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      titulo: data?.titulo || "",
      email: data?.email || "",
      ativo: data?.ativo ?? true,
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#455a64' }}>
        Informações Básicas
      </Typography>
      
      <Grid container spacing={3}>
        {/* Campo Título */}
        <Grid size={{ xs: 12 }}>
          <TextField 
            {...register('titulo')} 
            label="Título" 
            fullWidth 
            placeholder="João da Silva"
            error={!!errors.titulo} 
            helperText={errors.titulo?.message}
            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#00c853' } }}
          />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <TextField 
            {...register('email')} 
            label="E-mail" 
            fullWidth 
            placeholder="e.g. john@gmail.com"
            error={!!errors.email} 
            helperText={errors.email?.message} 
            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#00c853' } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Controller
                name="ativo"
                control={control}
                render={({ field }) => (
                  <Switch 
                    {...field} 
                    checked={field.value} 
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#00c853' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00c853' } }}
                  />
                )}
              />
            }
            label="Ativar ao criar"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button 
          type="submit" 
          variant="contained" 
          sx={{ 
            bgcolor: '#00c853', 
            '&:hover': { bgcolor: '#00a444' },
            textTransform: 'none',
            px: 4
          }}
        >
          Próximo
        </Button>
      </Box>
    </Box>
  );
};