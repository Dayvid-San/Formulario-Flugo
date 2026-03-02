import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Box, Stepper, Step, StepLabel, Button, Typography, 
  TextField, MenuItem, FormControlLabel, Switch, Paper, CircularProgress 
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { colaboradorSchema, ColaboradorFormData } from '../schemas/colaboradorSchema';

const steps = ['Informações Básicas', 'Informações Profissionais'];

export const RegisterColaboradorPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, trigger, formState: { errors } } = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      nome: '',
      email: '',
      ativo: true,
      dataAdmissao: '',
      departamento: '',
      nivel: 'Júnior',
      salario: 0,
      gestor: ''
    }
  });

  // Função para avançar etapas validando apenas os campos da etapa atual
  const handleNext = async () => {
    const fieldsToValidate = activeStep === 0 
      ? ['nome', 'email'] as const 
      : ['dataAdmissao', 'departamento', 'nivel', 'salario'] as const;
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = async (data: ColaboradorFormData) => {
    setLoading(true);
    try {
      await addDoc(collection(db, "colaboradores"), {
        ...data,
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar colaborador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '800px', margin: '0 auto' }}>
      <Paper sx={{ p: 4, borderRadius: '12px' }}>
        <Typography variant="h5" fontWeight="bold" color="#546e7a" gutterBottom>
          Novo Colaborador
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4, '& .MuiStepIcon-root.Mui-active': { color: '#00c853' } }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller name="nome" control={control} render={({ field }) => (
                  <TextField {...field} label="Nome Completo" fullWidth error={!!errors.nome} helperText={errors.nome?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={8}>
                <Controller name="email" control={control} render={({ field }) => (
                  <TextField {...field} label="E-mail Profissional" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Controller name="ativo" control={control} render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} color="success" />} label="Colaborador Ativo" />
                )} />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller name="dataAdmissao" control={control} render={({ field }) => (
                  <TextField {...field} type="date" label="Data de Admissão" fullWidth slotProps={{ inputLabel: { shrink: true } }} error={!!errors.dataAdmissao} helperText={errors.dataAdmissao?.message} />
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="departamento" control={control} render={({ field }) => (
                  <TextField {...field} select label="Departamento" fullWidth error={!!errors.departamento} helperText={errors.departamento?.message}>
                    <MenuItem value="TI">TI</MenuItem>
                    <MenuItem value="RH">Recursos Humanos</MenuItem>
                    <MenuItem value="Financeiro">Financeiro</MenuItem>
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="nivel" control={control} render={({ field }) => (
                  <TextField {...field} select label="Nível Hierárquico" fullWidth>
                    {['Júnior', 'Pleno', 'Sênior', 'Gestor'].map((op) => (
                      <MenuItem key={op} value={op}>{op}</MenuItem>
                    ))}
                  </TextField>
                )} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller name="salario" control={control} render={({ field }) => (
                  <TextField {...field} type="number" label="Salário Base (R$)" fullWidth onChange={(e) => field.onChange(Number(e.target.value))} />
                )} />
              </Grid>
              <Grid item xs={12}>
                <Controller name="gestor" control={control} render={({ field }) => (
                  <TextField {...field} select label="Gestor Responsável (Opcional)" fullWidth>
                    <MenuItem value="">Nenhum</MenuItem>
                    <MenuItem value="ID_GESTOR_1">Carlos Silva (TI)</MenuItem>
                    <MenuItem value="ID_GESTOR_2">Ana Souza (RH)</MenuItem>
                  </TextField>
                )} />
              </Grid>
            </Grid>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
            <Button onClick={() => navigate('/dashboard')} disabled={loading}>Cancelar</Button>
            {activeStep !== 0 && <Button onClick={handleBack} disabled={loading}>Voltar</Button>}
            
            {activeStep === steps.length - 1 ? (
              <Button type="submit" variant="contained" color="success" disabled={loading} sx={{ minWidth: '120px' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Finalizar'}
              </Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleNext}>Próximo</Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
};