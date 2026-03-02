import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { 
  Box, Typography, TextField, Button, 
  InputAdornment, IconButton, Link, Alert, Grid
} from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LogoFlugo from '../../public/logo-flugo.png'; 

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Define para onde redirecionar após o login (padrão é o dashboard '/')
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Erro no login:", err);
      // Mensagens de erro mais amigáveis baseadas no código do Firebase
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('E-mail ou senha incorretos.');
          break;
        case 'auth/invalid-email':
          setError('Formato de e-mail inválido.');
          break;
        default:
          setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <Grid container>
        {/* Lado Esquerdo: Branding */}
        <Grid item xs={12} md={6} sx={{ 
          bgcolor: '#f5f5f5', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: 4,
          borderRight: { md: '1px solid #e0e0e0' }
        }}>
          <img src={LogoFlugo} alt="Flugo Logo" style={{ width: '150px', marginBottom: '32px' }} />
          <Typography variant="h5" color="#666" fontWeight="bold">Gestão de Talentos</Typography>
          <Typography variant="body1" color="#999" sx={{ mt: 1 }}>Simplificando seu RH.</Typography>
        </Grid>

        {/* Lado Direito: Formulário */}
        <Grid item xs={12} md={6} sx={{ 
          bgcolor: 'white', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: { xs: 3, md: 6 } 
        }}>
          <Box component="form" onSubmit={handleLogin} sx={{ maxWidth: '400px', width: '100%' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="#546e7a" gutterBottom>
              Bem-vindo de volta!
            </Typography>
            <Typography variant="body1" color="#78909c" sx={{ mb: 4 }}>
              Acesse sua conta Flugo.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <TextField
              label="E-mail"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
              // Mantém o estilo de input do MUI
              sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#00c853' } }} 
            />

            <TextField
              label="Senha"
              variant="outlined"
              fullWidth
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: '#00c853' } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
              <Link href="#" variant="body2" color="#78909c" underline="hover">
                Esqueceu a senha?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              // Mantém o estilo de botão verde do MUI
              sx={{ 
                bgcolor: '#00c853', 
                '&:hover': { bgcolor: '#00a844' }, 
                textTransform: 'none', 
                fontWeight: 'bold', 
                fontSize: '1.1rem',
                borderRadius: '8px' 
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};