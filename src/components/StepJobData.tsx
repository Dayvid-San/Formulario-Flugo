import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography, MenuItem } from '@mui/material';
import { NavbarsLayout } from './NavbarsLayout';


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
    <Box sx={{ width: '100%', bgcolor: '#ffffff' }}>
      <Box 
        component="form" 
        onSubmit={handleSubmit(onNext)} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '400px',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold', color: '#546e7a' }}>
            Informações Profissionais
          </Typography>
          
          <Grid container spacing={2}>
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
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 4,
          pt: 2,
          borderTop: '1px solid #f0f0f0'
        }}>
          <Button onClick={onBack} sx={{ color: '#9e9e9e', textTransform: 'none', fontWeight: 'bold' }}>
            Voltar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ bgcolor: '#00c853', color: '#ffffff', px: 4, borderRadius: 2, fontWeight: 'bold' }}
          >
            Concluir
          </Button>
        </Box>
      </Box>
    </Box>
  );
};