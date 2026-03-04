      import { useForm, SubmitHandler } from 'react-hook-form';
      import { zodResolver } from '@hookform/resolvers/zod';
      import * as z from 'zod';
      import { TextField, Button, Box, Grid, Typography, MenuItem } from '@mui/material';
      import { useEffect, useState } from 'react';
      import { collection, query, where, onSnapshot } from "firebase/firestore";
      import { db } from "../services/firebase";

      const jobSchema = z.object({
       department: z.string().min(1, "Department is required"),
       level: z.enum(["Júnior", "Pleno", "Sênior", "Gestor"]),
       salary: z.number().min(1, "Salary is required"),
       admissionDate: z.string().min(1, "Date is required"),
       responsibleManager: z.string().optional(),
     });

     type JobFormData = z.infer<typeof jobSchema>;

     export const StepJobData = ({ onNext, onBack, data, departments }: any) => {
       const [managers, setManagers] = useState<{ id: string, name: string }[]>([]);
       console.log("Departamentos recebidos:", departments)

       const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<JobFormData>({
         resolver: zodResolver(jobSchema),
         defaultValues: {
           department: data?.department || "",
           level: data?.level || "Júnior",
           salary: data?.salary || undefined,
           admissionDate: data?.admissionDate || "",
           responsibleManager: data?.responsibleManager || "",
         }
       });

       const departmentValue = watch('department');

       useEffect(() => {
         const managersQuery = query(collection(db, "colaboradores"), where("nivel", "==", "Gestor"));
         const unsubscribe = onSnapshot(managersQuery, (snapshot) => {
           const list = snapshot.docs.map(doc => ({
             id: doc.id,
             name: doc.data().titulo || doc.data().name
           }));
           setManagers(list);
         });
         return () => unsubscribe();
       }, []);

       const onSubmit: SubmitHandler<JobFormData> = (formData) => {
         onNext(formData);
       };

       // Estilo para inputs
       const greenInputStyle = {
         '& .MuiOutlinedInput-root': {
           '&.Mui-focused fieldset': {
             borderColor: 'green',
           },
         },
       };

       return (
         <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
           <Typography variant="h6" gutterBottom>
             Job Data
           </Typography>
           <Grid container spacing={2}>
             <Grid item xs={12}>
               <TextField
                 select
                 fullWidth
                 label="Department"
                 {...register('department')}
                 error={!!errors.department}
                 helperText={errors.department?.message}
                 value={departmentValue}
                 onChange={(e) => setValue('department', e.target.value, { shouldValidate: true })}
                 sx={greenInputStyle}
               >
                 <MenuItem value="">
                   <em>(Primeiro Colaborador/CEO)</em>
                 </MenuItem>
                 {departments.map((dept: any) => (
                    <MenuItem key={dept.id} value={dept.name || dept.nome}>
                      {dept.name || dept.nome}
                    </MenuItem>
                  ))}
               </TextField>
             </Grid>


                 {/* Level */}
                 <Grid item xs={12} md={6}>
                   <TextField
                     select
                     fullWidth
                     label="Level"
                     {...register('level')}
                     defaultValue="Júnior"
                     sx={greenInputStyle}
                   >
                     {["Júnior", "Pleno", "Sênior", "Gestor"].map(l => (
                       <MenuItem key={l} value={l}>{l}</MenuItem>
                     ))}
                   </TextField>
                 </Grid>

                 {/* Salary */}
                 <Grid item xs={12} md={6}>
                   <TextField
                     fullWidth
                     type="number"
                     label="Salary"
                     {...register('salary', { valueAsNumber: true })}
                     error={!!errors.salary}
                     helperText={errors.salary?.message}
                     sx={greenInputStyle}
                   />
                 </Grid>

                 {/* Admission Date */}
                 <Grid item xs={12} md={6}>
                   <TextField
                     fullWidth
                     type="date"
                     label="Admission Date"
                     InputLabelProps={{ shrink: true }}
                     {...register('admissionDate')}
                     error={!!errors.admissionDate}
                     helperText={errors.admissionDate?.message}
                     sx={greenInputStyle}
                   />
                 </Grid>

             {/* Responsible Manager */}
             <Grid item xs={12} md={6}>
               <TextField
                 select
                 fullWidth
                 label="Responsible Manager"
                 {...register('responsibleManager')}
                 error={!!errors.responsibleManager}
                 helperText={errors.responsibleManager?.message}
                 sx={greenInputStyle}
               >
                 {managers.map(manager => (
                   <MenuItem key={manager.id} value={manager.name}>{manager.name}</MenuItem>
                 ))}
               </TextField>
             </Grid>

           </Grid>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
             <Button variant="contained" onClick={onBack}>
               Back
             </Button>
             <Button type="submit" variant="contained">
               Next
             </Button>
           </Box>
         </Box>
       );
     };