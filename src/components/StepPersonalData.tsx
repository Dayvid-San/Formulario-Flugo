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


const personalSchema = z.object({
  titulo: z.string().min(1, "O título (nome) é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  ativo: z.boolean(),
});

type PersonalFormData = z.infer<typeof personalSchema>;

export const StepPersonalData = ({ onNext, data, onCancel }: any) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      titulo: data?.titulo || "",
      email: data?.email || "",
      ativo: data?.ativo ?? true,
    }
  });

  const greenInputStyle = {
    '& label.Mui-focused': { color: '#00c853' },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: '#00c853', borderWidth: '2px' },
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '75vh', bgcolor: '#ffffff' }}>
      <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#546e7a' }}>
          Informações Básicas
        </Typography>
        
        <Grid container spacing={2} sx={{ flexGrow: 1 }}> 
          <Grid item xs={12}>
            <TextField 
              {...register('titulo')} label="Título" fullWidth placeholder="João da Silva"
              error={!!errors.titulo} helperText={errors.titulo?.message}
              InputLabelProps={{ shrink: true }} sx={greenInputStyle}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField 
              {...register('email')} label="E-mail" fullWidth placeholder="e.g. john@gmail.com"
              error={!!errors.email} helperText={errors.email?.message} 
              InputLabelProps={{ shrink: true }} sx={greenInputStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="ativo" control={control}
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} 
                      sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#00c853' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00c853' } }}
                    />
                  )}
                />
              }
              label={<Typography sx={{ color: '#546e7a', fontSize: '0.9rem' }}>Ativar ao criar</Typography>}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4, 
          pt: 2,
          borderTop: '1px solid #f0f0f0' 
         }}>
          <Button onClick={onCancel} sx={{ color: '#9e9e9e', textTransform: 'none', fontWeight: 'bold' }}>
            Voltar
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#00c853', color: '#ffffff', '&:hover': { bgcolor: '#00a844' }, textTransform: 'none', fontWeight: 'bold', px: 4, borderRadius: 2 }}>
            Próximo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};