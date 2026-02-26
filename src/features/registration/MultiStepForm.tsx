import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Typography, LinearProgress, Breadcrumbs, Link, Dialog, DialogContent, Grid } from '@mui/material';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase"; 
import { StepPersonalData } from '../../components/StepPersonalData';
import { StepJobData } from '../../components/StepJobData';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const stepsLabels = ['Infos Básicas', 'Infos Profissionais'];

export const MultiStepForm = ({ onCancel }: { onCancel: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleNextStep = (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (activeStep === stepsLabels.length - 1) { 
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
      setOpenSuccess(true); 
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o colaborador.");
    }
  };

  const progressValue = activeStep === 0 ? 0 : 50;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#ffffff', p: 4 }}>
      
      <Box sx={{ mb: 4, maxWidth: 1000 }}>
        <Breadcrumbs separator="•" sx={{ mb: 2, color: '#757575', fontSize: '0.9rem' }}>
          <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => onCancel()}>
            Colaboradores
          </Link>
          <Typography color="#9e9e9e">Cadastrar Colaborador</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={progressValue} 
            sx={{ 
              flexGrow: 1, 
              height: 4, 
              bgcolor: '#e0f2f1', 
              borderRadius: 2,
              '& .MuiLinearProgress-bar': { bgcolor: '#00c853' } 
            }} 
          />
          <Typography variant="caption" color="text.secondary">
            {progressValue}%
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ maxWidth: 1000 }}>
        
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {stepsLabels.map((label, index) => {
              const isPast = index < activeStep;
              const isActive = index === activeStep;
              
              return (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    sx={{ 
                      width: 28, height: 28, borderRadius: '50%', 
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      bgcolor: isPast || isActive ? '#00c853' : '#e0e0e0',
                      color: isPast || isActive ? 'white' : '#757575',
                      fontWeight: 'bold', fontSize: '0.9rem'
                    }}
                  >
                    {isPast ? <CheckCircleOutlineIcon fontSize="small" /> : index + 1}
                  </Box>
                  <Typography 
                    sx={{ 
                      fontWeight: isActive ? 'bold' : 'normal', 
                      color: isActive || isPast ? '#263238' : '#9e9e9e' 
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ minHeight: 400 }}>
            {activeStep === 0 && (
              <StepPersonalData onNext={handleNextStep} onCancel={onCancel} data={formData} />
            )}
            {activeStep === 1 && (
              <StepJobData onNext={handleNextStep} onBack={handleBack} data={formData} />
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openSuccess} PaperProps={{ sx: { borderRadius: 3, p: 2, textAlign: 'center', maxWidth: 400 } }}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#00c853' }} />
            <Typography variant="h6" fontWeight="bold">Colaborador cadastrado com sucesso!</Typography>
            <Button 
              variant="contained" fullWidth
              onClick={() => { setOpenSuccess(false); onCancel(); }}
              sx={{ bgcolor: '#00c853', '&:hover': { bgcolor: '#00a844' }, mt: 2, textTransform: 'none', borderRadius: 2, fontWeight: 'bold' }}
            >
              OK
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

    </Box>
  );
};