import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const jobSchema = z.object({
  department: z.string().min(1, "O departamento é obrigatório"),
  level: z.enum(["Júnior", "Pleno", "Sênior", "Gestor"]),
  salary: z.number().min(1, "O salário é obrigatório"),
  admissionDate: z.string().min(1, "A data de admissão é obrigatória"),
  responsibleManager: z.string().min(1, "O gestor responsável é obrigatório"),
});

type JobFormData = z.infer<typeof jobSchema>;

export const StepJobData = ({ onNext, onBack, data, departments }: any) => {
  const [managers, setManagers] = useState<{ id: string, name: string }[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      department: data?.department || "",
      level: data?.level || "Júnior",
      salary: data?.salary || undefined,
      admissionDate: data?.admissionDate || "",
      responsibleManager: data?.responsibleManager || "",
    }
  });

  const departmentValue = watch('department');

  useEffect(() => {
    const managersQuery = query(collection(db, "colaboradores"), where("nivel", "==", "Gestor"));
    const unsubscribe = onSnapshot(managersQuery, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().titulo || doc.data().name
      }));
      setManagers(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (data?.department) {
        setValue('department', data.department);
    }
  }, [data, setValue]);

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
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <TextField 
                    select
                    fullWidth 
                    label="Departamento" 
                    {...register('department')}
                    error={!!errors.department}
                    helperText={errors.department?.message}
                    sx={greenInputStyle}
                    value={departmentValue} // Control the component
                >
                    {departments.map((dept: any) => (
                    <MenuItem key={dept.id} value={dept.nome}>{dept.nome}</MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                select
                fullWidth 
                label="Nível"
                {...register('level')}
                defaultValue="Júnior"
                sx={greenInputStyle}
              >
                {["Júnior", "Pleno", "Sênior", "Gestor"].map(l => (
                  <MenuItem key={l} value={l}>{l}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth 
                type="number"
                label="Salário"
                {...register('salary', { valueAsNumber: true })}
                error={!!errors.salary}
                helperText={errors.salary?.message}
                sx={greenInputStyle}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField 
                fullWidth
                type="date"
                label="Data de Admissão"
                {...register('admissionDate')}
                error={!!errors.admissionDate}
                helperText={errors.admissionDate?.message}
                InputLabelProps={{ shrink: true }}
                sx={greenInputStyle}
              />
            </Grid>

            <Grid item xs={12}>
                <TextField 
                    select
                    fullWidth 
                    label="Gestor Responsável"
                    {...register('responsibleManager')}
                    error={!!errors.responsibleManager}
                    helperText={errors.responsibleManager?.message}
                    sx={greenInputStyle}
                    defaultValue=""
                >
                    <MenuItem value="" disabled>Selecione um gestor</MenuItem>
                    {managers.map(m => (
                      <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>
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
            sx={{ bgcolor: '#00c853', color: '#ffffff', px: 4, borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
          >
            Concluir
          </Button>
        </Box>
      </Box>
    </Box>
  );
};