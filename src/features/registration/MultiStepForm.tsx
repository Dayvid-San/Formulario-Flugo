import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Typography, LinearProgress, Breadcrumbs, Link } from '@mui/material';
import React from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; 
import { StepPersonalData } from './StepPersonalData';

const steps = ['Infos Básicas', 'Endereço', 'Cargo e Salário'];

export const MultiStepForm = ({ onCancel }: { onCancel: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNextStep = (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (activeStep === steps.length - 1) {
      handleFinalSubmit(updatedData);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinalSubmit = async (allData: any) => {
    try {
      const colaboradoresRef = collection(db, "colaboradores");
      await addDoc(colaboradoresRef, {
        ...allData,
        status: allData.ativo ? 'Ativo' : 'Inativo',
        createdAt: new Date().toISOString()
      });
      
      alert("Colaborador cadastrado com sucesso!");
      onCancel();
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o colaborador.");
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', pt: 4 }}>
      <LinearProgress 
        variant="determinate" 
        value={(activeStep / (steps.length - 1)) * 100} 
        sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 4, bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#00c853' } }} 
      />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: 3 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/" onClick={(e) => { e.preventDefault(); onCancel(); }}>
            Colaboradores
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>Cadastrar Colaborador</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <Stepper activeStep={activeStep} sx={{ mb: 5, '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': { color: '#00c853' } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 300 }}>
            {activeStep === 0 && (
              <StepPersonalData 
                onNext={handleNextStep} 
                data={formData} 
              />
            )}
            
            {activeStep === 1 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#455a64' }}>Endereço</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={handleBack} sx={{ color: '#90a4ae' }}>Voltar</Button>
                  <Button variant="contained" onClick={() => handleNextStep({})} sx={{ bgcolor: '#00c853' }}>Próximo</Button>
                </Box>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#455a64' }}>Cargo e Salário</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button onClick={handleBack} sx={{ color: '#90a4ae' }}>Voltar</Button>
                  <Button variant="contained" onClick={() => handleNextStep({})} sx={{ bgcolor: '#00c853' }}>Finalizar</Button>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};