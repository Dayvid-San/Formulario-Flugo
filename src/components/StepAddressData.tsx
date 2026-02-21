import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TextField, Button, Box, Grid, Typography } from '@mui/material';
import React from 'react';

const addressSchema = z.object({
  zipCode: z.string().min(8, "Invalid ZIP code"),
  street: z.string().min(1, "Street is required"),
  number: z.string().min(1, "Number is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

export const StepAddressData = ({ onNext, onBack, data }: any) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: data
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)}>
      <Typography variant="h6" sx={{ mb: 3 }}>Address</Typography>
      
      <Grid container spacing={2}>
        
      <Grid size={{ xs: 12, sm: 4 }}>
          <TextField {...register('zipCode')} label="ZIP Code" fullWidth error={!!errors.zipCode} helperText={errors.zipCode?.message} />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField {...register('street')} label="Street" fullWidth error={!!errors.street} helperText={errors.street?.message} />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField {...register('number')} label="Number" fullWidth error={!!errors.number} helperText={errors.number?.message} />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 5 }}>
          <TextField {...register('city')} label="City" fullWidth error={!!errors.city} helperText={errors.city?.message} />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField {...register('state')} label="State" fullWidth error={!!errors.state} helperText={errors.state?.message} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button onClick={onBack}>Back</Button>
        <Button type="submit" variant="contained" sx={{ bgcolor: '#00c853' }}>Next</Button>
      </Box>
    </Box>
  );
};