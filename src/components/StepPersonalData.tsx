import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box } from '@mui/material';
import React from 'react';

// Validation schema: Everything is 'required'
const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  document: z.string().min(11, "Document must have at least 11 digits"),
});

type FormData = z.infer<typeof schema>;

export const StepPersonalData = ({ onNext, data }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data // To keep the data if the user goes back
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        {...register('fullName')}
        label="Full Name"
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
        fullWidth
      />
      <TextField
        {...register('email')}
        label="Email"
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />
      <TextField
        {...register('document')}
        label="Document"
        error={!!errors.document}
        helperText={errors.document?.message}
        fullWidth
      />
      <Button type="submit" variant="contained" size="large" sx={{ mt: 2, bgcolor: '#00c853' }}>
        Next Step
      </Button>
    </Box>
  );
};