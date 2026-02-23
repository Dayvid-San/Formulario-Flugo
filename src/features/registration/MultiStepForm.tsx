import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Typography, LinearProgress, Breadcrumbs, Link } from '@mui/material';
import React from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; 
import { StepPersonalData } from '../../components/StepPersonalData';
import { StepAddressData } from '../../components/StepAddressData';
import { StepJobData } from '../../components/StepJobData';

const steps = ['Infos Básicas', 'Endereço', 'Cargo e Salário'];

export const MultiStepForm = ({ onCancel }: { onCancel: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNextStep = (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    // Se for a última etapa (2), salva no banco. Senão, avança.
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
        status: allData.ativo !== undefined ? (allData.ativo ? 'Ativo' : 'Inativo') : 'Ativo',
        createdAt: new Date().toISOString()
      });
      
      alert("Colaborador cadastrado com sucesso!");
      onCancel(); 
      
    } catch (error) {
      // É AQUI que você coloca o código de log detalhado
      console.error("ERRO DETALHADO DO FIREBASE:", error); 
      alert("Erro ao salvar o colaborador.");
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', pt: 4 }}>
      {/* Barra de progresso verde no topo */}
      <LinearProgress 
        variant="determinate" 
        value={(activeStep / (steps.length - 1)) * 100} 
        sx={{ 
          position: 'fixed', top: 0, left: 0, right: 0, height: 4, 
          bgcolor: '#eee', '& .MuiLinearProgress-bar': { bgcolor: '#00c853' } 
        }} 
      />

      <Box sx={{ maxWidth: 800, mx: 'auto', px: 3 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            sx={{ cursor: 'pointer' }} 
            onClick={() => onCancel()}
          >
            Colaboradores
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 'bold' }}>
            Cadastrar Colaborador
          </Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' }}>
          <Stepper 
            activeStep={activeStep} 
            sx={{ mb: 5, '& .MuiStepIcon-root.Mui-active, & .MuiStepIcon-root.Mui-completed': { color: '#00c853' } }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 300 }}>
            {/* ETAPA 0: DADOS PESSOAIS */}
            {activeStep === 0 && (
              <StepPersonalData 
                onNext={handleNextStep} 
                data={formData} 
              />
            )}
            
            {/* ETAPA 1: ENDEREÇO (Agora usando o seu componente!) */}
            {activeStep === 1 && (
              <StepAddressData 
                onNext={handleNextStep} 
                onBack={handleBack} 
                data={formData} 
              />
            )}

            {/* ETAPA 2: CARGO E SALÁRIO (Agora usando o seu componente!) */}
            {activeStep === 2 && (
              <StepJobData 
                onNext={handleNextStep} 
                onBack={handleBack} 
                data={formData} 
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};