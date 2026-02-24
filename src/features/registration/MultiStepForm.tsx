import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Typography, LinearProgress, Breadcrumbs, Link, Dialog, DialogContent } from '@mui/material';
import React from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; 
import { StepPersonalData } from '../../components/StepPersonalData';
import { StepAddressData } from '../../components/StepAddressData';
import { StepJobData } from '../../components/StepJobData';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const steps = ['Infos Básicas', 'Endereço', 'Cargo e Salário'];

export const MultiStepForm = ({ onCancel }: { onCancel: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [openSuccess, setOpenSuccess] = useState(false);

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
      console.log("Iniciando salvamento no Firebase...");
      const colaboradoresRef = collection(db, "colaboradores");
      await addDoc(colaboradoresRef, {
        ...allData,
        status: allData.ativo !== undefined ? (allData.ativo ? 'Ativo' : 'Inativo') : 'Ativo',
        createdAt: new Date().toISOString()
      });
      
      console.log("Sucesso! Abrindo Modal..."); 
      setOpenSuccess(true); 
      
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
            {activeStep === 0 && (
              <StepPersonalData 
                onNext={handleNextStep} 
                data={formData} 
              />
            )}
            
            {activeStep === 1 && (
              <StepAddressData 
                onNext={handleNextStep} 
                onBack={handleBack} 
                data={formData} 
              />
            )}

            {activeStep === 2 && (
              <StepJobData 
                onNext={handleNextStep} 
                onBack={handleBack} 
                data={formData} 
              />
            )}
          </Box>
        </Paper>
        <Box>
          <Dialog 
            open={openSuccess} 
            PaperProps={{ sx: { borderRadius: 3, p: 2, textAlign: 'center', maxWidth: 400 } }}
          >
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#00c853' }} />
                
                <Typography variant="h6" fontWeight="bold">
                  Colaborador cadastrado com sucesso!
                </Typography>

                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => {
                    setOpenSuccess(false);
                    onCancel(); // Volta para a listagem
                  }}
                  sx={{ 
                    bgcolor: '#00c853', 
                    '&:hover': { bgcolor: '#00a844' },
                    mt: 2,
                    textTransform: 'none',
                    borderRadius: 2,
                    fontWeight: 'bold'
                  }}
                >
                  OK
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      </Box>
      
    </Box>
  );
};