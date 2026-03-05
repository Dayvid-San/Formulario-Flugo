import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const jobSchema = z.object({
  department: z.string().min(1, "Department is required"),
  level: z.enum(["Júnior", "Pleno", "Sênior", "Gestor"], { message: "Please select a valid level"}),
  salary: z.number({ message: "Salary is required" }).min(1, "Salary must be greater than 0"),
  admissionDate: z.string().min(1, "Date is required"),
  responsibleManager: z.string().optional().or(z.literal("")),
});

type JobFormData = z.infer<typeof jobSchema>;

export const StepJobData = ({ onNext, onBack, data, departments }: any) => {
  const [managers, setManagers] = useState<{ id: string, name: string }[]>([]);
  console.log("Departamentos recebidos:", departments)

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

  const onSubmit: SubmitHandler<JobFormData> = (formData) => {
    onNext(formData);
  };
  const greenInputStyle = {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        Informações Profissionais
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Departamento"
            {...register('department')}
            error={!!errors.department}
            helperText={errors.department?.message}
            value={departmentValue}
            onChange={(e) => setValue('department', e.target.value, { shouldValidate: true })}
            sx={greenInputStyle}
          >
            {departments.map((dept: any) => (
              <MenuItem key={dept.id} value={dept.name || dept.nome}>
                {dept.name || dept.nome}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Senioridade"
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
            label="Salario"
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
            label="Dia de Adimissão"
            InputLabelProps={{ shrink: true }}
            {...register('admissionDate')}
            error={!!errors.admissionDate}
            helperText={errors.admissionDate?.message}
            sx={greenInputStyle}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Gestor"
            {...register('responsibleManager')}
            error={!!errors.responsibleManager}
            helperText={errors.responsibleManager?.message}
            sx={greenInputStyle}
          >
            {managers.map(manager => (
              <MenuItem key={manager.id} value={manager.name}>{manager.name}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button variant="contained" sx={{ color: '#ffffff' }} onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" sx={{ color: '#ffffff' }} variant="contained">
          Próximo
        </Button>
      </Box>
    </Box>
  );
};