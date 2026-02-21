import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import React from 'react';

const personalDataSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  document: z.string().min(11, "The document must have at least 11 digits"),
  phone: z.string().min(1, "Phone is required"),
});

type PersonalDataFormData = z.infer<typeof personalDataSchema>;

interface StepProps {
  onNext: (data: PersonalDataFormData) => void;
  data: Partial<PersonalDataFormData>; 
}

export const StepPersonalData = ({ onNext, data }: StepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalDataFormData>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: data,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Personal Data
      </Typography>

      <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
          <TextField
            {...register('fullName')}
            label="Full Name"
            fullWidth
            required
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            {...register('email')}
            label="Email"
            type="email"
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          sx={{ 
            bgcolor: '#00c853', 
            px: 4,
            '&:hover': { bgcolor: '#00a444' } 
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};