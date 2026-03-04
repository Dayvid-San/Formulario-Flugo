import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  FormControlLabel, 
  Switch 
} from '@mui/material';
import Grid from '@mui/material/Grid';

const personalSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  active: z.boolean(),
});

type PersonalFormData = z.infer<typeof personalSchema>;

export const StepPersonalData = ({ onNext, data, onCancel }: any) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      active: data?.active ?? true,
    }
  });

  const greenInputStyle = {
    '& label.Mui-focused': { color: '#00c853' },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: '#00c853', borderWidth: '2px' },
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#546e7a' }}>
          Informações Básicas
        </Typography>
        
        <Grid container spacing={3} sx={{ flexGrow: 1 }}> 
          <Grid item xs={12}>
            <TextField 
              {...register('name')} 
              label="Nome Completo" 
              fullWidth 
              placeholder="João da Silva"
              error={!!errors.name} 
              helperText={errors.name?.message}
              InputLabelProps={{ shrink: true }} 
              sx={greenInputStyle}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField 
              {...register('email')} 
              label="E-mail Corporativo" 
              fullWidth 
              placeholder="e.g. joao@empresa.com"
              error={!!errors.email} 
              helperText={errors.email?.message} 
              InputLabelProps={{ shrink: true }} 
              sx={greenInputStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Controller
                  name="active" 
                  control={control}
                  render={({ field }) => (
                    <Switch 
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      sx={{ 
                        '& .MuiSwitch-switchBase.Mui-checked': { color: '#00c853' }, 
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#00c853' } 
                      }}
                    />
                  )}
                />
              }
              label={<Typography sx={{ color: '#546e7a', fontSize: '0.9rem' }}>Colaborador ativo no sistema</Typography>}
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
          <Button 
            onClick={onCancel} 
            sx={{ color: '#9e9e9e', textTransform: 'none', fontWeight: 'bold' }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              bgcolor: '#00c853', 
              color: '#ffffff', 
              '&:hover': { bgcolor: '#00a844' }, 
              textTransform: 'none', 
              fontWeight: 'bold', 
              px: 4, 
              borderRadius: 2 
            }}
          >
            Próximo
          </Button>
        </Box>
      </Box>
    </Box>
  );
};