import { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../services/firebase";

const steps = ['Personal Data', 'Address', 'Position and Salary'];

export const MultiStepForm = ({ onCancel }: { onCancel: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNextStep = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setActiveStep((prev) => prev + 1);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleFinalSubmit = async (finalData: any) => {
    const completeEmployee = {
      ...formData,
      ...finalData,
      status: 'Active', 
      createdAt: new Date().toISOString()
    };
  
    try {
      const employeesRef = collection(db, "employees");
      
      await addDoc(employeesRef, completeEmployee);
      
      alert("Employee registered successfully!");
      
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving employee.");
    }

    const finalizeRegistration = async (completeData: any) => {
      try {
        await addDoc(collection(db, "employees"), {
          ...completeData,
          createdAt: new Date().toISOString()
        });
        alert("Employee saved to Firebase!");
      } catch (e) {
        console.error("Error saving: ", e);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8, p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" mb={4} fontWeight="bold">Employee Registration</Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 200, mb: 4 }}>
          {activeStep === 0 && <Typography>Here goes the form for Step 1...</Typography>}
          {activeStep === 1 && <Typography>Here goes the form for Step 2...</Typography>}
          {activeStep === 2 && <Typography>Here goes the form for Step 3...</Typography>}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={activeStep === 0 ? onCancel : handleBack} variant="text">
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNext}
            sx={{ bgcolor: '#00c853', '&:hover': { bgcolor: '#00a444' } }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};