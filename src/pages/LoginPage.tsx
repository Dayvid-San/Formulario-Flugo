import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth'; // Importado para criação de conta
import { auth } from '../services/firebase';
import { 
  Box, Typography, TextField, Button, 
  InputAdornment, IconButton, Link, Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LogoFlugo from '../../public/logo-flugo.png'; 

export const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar Telas
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegistering) {
        // Lógica de Criação de Conta
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Lógica de Login
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Erro na autenticação:", err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este e-mail já está em uso.');
          break;
        case 'auth/weak-password':
          setError('A senha deve ter pelo menos 6 caracteres.');
          break;
        case 'auth/invalid-credential':
          setError('E-mail ou senha incorretos.');
          break;
        default:
          setError('Erro ao processar solicitação. Verifique os dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <Grid container sx={{ width: '100%' }}>
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

        {/* Lado Direito: Formulário Dinâmico */}
        <Grid item xs={12} md={6} sx={{ 
          bgcolor: 'white', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          p: { xs: 3, md: 6 } 
        }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '400px', width: '100%' }}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="#546e7a" gutterBottom>
              {isRegistering ? 'Criar Conta' : 'Bem-vindo de volta!'}
            </Typography>
            <Typography variant="body1" color="#78909c" sx={{ mb: 4 }}>
              {isRegistering ? 'Preencha os dados abaixo.' : 'Acesse sua conta Flugo.'}
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 3 }}>
              <Link 
                component="button" 
                type="button"
                variant="body2" 
                color="#78909c" 
                onClick={() => setIsRegistering(!isRegistering)}
                sx={{ textDecoration: 'none', fontWeight: 'bold' }}
              >
                {isRegistering ? 'Já tenho uma conta' : 'Criar uma conta'}
              </Link>
              {!isRegistering && (
                <Link href="#" variant="body2" color="#78909c" underline="hover">
                  Esqueceu a senha?
                </Link>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                bgcolor: '#00c853', 
                '&:hover': { bgcolor: '#00a844' }, 
                textTransform: 'none', 
                fontWeight: 'bold', 
                fontSize: '1.1rem',
                borderRadius: '8px' 
              }}
            >
              {loading ? 'Aguarde...' : (isRegistering ? 'Cadastrar' : 'Entrar')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};