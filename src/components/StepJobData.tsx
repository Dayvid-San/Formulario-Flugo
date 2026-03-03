import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography, MenuItem } from '@mui/material';

const jobSchema = z.object({
  departamento: z.string().min(1, "O departamento é obrigatório"),
  nivel: z.enum(["Júnior", "Pleno", "Sênior", "Gestor"]),
  salario: z.number().min(1, "Informe o salário"),
  dataAdmissao: z.string().min(1, "Informe a data"),
});

type JobFormData = z.infer<typeof jobSchema>;

export const StepJobData = ({ onNext, onBack, data, departamentos }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      departamento: data?.departamento || "",
      nivel: data?.nivel || "Júnior",
      salario: data?.salario || 0,
      dataAdmissao: data?.dataAdmissao || "",
    }
  });

  const greenInputStyle = {
    '& label.Mui-focused': { color: '#00c853' },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': { borderColor: '#00c853', borderWidth: '2px' },
    }
  };


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
            <Grid item xs={12}>
              <TextField 
                select
                fullWidth 
                label="Departamento" 
                {...register('departamento')}
                error={!!errors.departamento}
                helperText={errors.departamento?.message}
                sx={greenInputStyle}
              >
                {departamentos.map((dept: any) => (
                  <MenuItem key={dept.id} value={dept.nome}>{dept.nome}</MenuItem>
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