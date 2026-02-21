import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Typography } from '@mui/material';
import React from 'react';

// Definimos os nomes das etapas
const steps = ['Dados Pessoais', 'Endereço', 'Cargo e Salário'];

export const MultiStepForm = ({ onCancel }: { onCancel: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNextStep = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setActiveStep((prev) => prev + 1);
  };

  const handleNext = () => {
    // Aqui entrará a validação do React Hook Form antes de mudar o estado
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" mb={4} fontWeight="bold">Cadastro de Funcionário</Typography>
        
        {/* Indicador visual das etapas */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Conteúdo Dinâmico conforme a etapa */}
        <Box sx={{ minHeight: 200, mb: 4 }}>
          {activeStep === 0 && <Typography>Aqui vai o formulário da Etapa 1...</Typography>}
          {activeStep === 1 && <Typography>Aqui vai o formulário da Etapa 2...</Typography>}
          {activeStep === 2 && <Typography>Aqui vai o formulário da Etapa 3...</Typography>}
        </Box>

        {/* Botões de Navegação */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={activeStep === 0 ? onCancel : handleBack} variant="text">
            {activeStep === 0 ? 'Cancelar' : 'Voltar'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNext}
            sx={{ bgcolor: '#00c853', '&:hover': { bgcolor: '#00a444' } }}
          >
            {activeStep === steps.length - 1 ? 'Finalizar' : 'Próximo'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};