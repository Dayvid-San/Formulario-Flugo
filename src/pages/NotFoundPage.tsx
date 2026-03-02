import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redireciona para a raiz (que vai pro Dashboard se estiver logado, ou Login se não estiver)
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5', // Fundo cinza claro para manter a consistência com o app
        textAlign: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        {/* Ícone de erro amigável */}
        <ErrorOutlineIcon sx={{ fontSize: 100, color: '#00c853', mb: 2 }} />

        {/* Tipografia de Impacto */}
        <Typography 
          variant="h1" 
          fontWeight="bold" 
          sx={{ color: '#546e7a', fontSize: { xs: '4rem', md: '6rem' } }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight="bold" color="#666" gutterBottom>
          Ops! Página não encontrada.
        </Typography>

        <Typography variant="body1" color="#999" sx={{ mb: 4 }}>
          A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
        </Typography>

        {/* Botão de resgate */}
        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          sx={{
            bgcolor: '#00c853',
            '&:hover': { bgcolor: '#00a844' },
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            px: 4,
            py: 1.5
          }}
        >
          Voltar para o Início
        </Button>
      </Container>
    </Box>
  );
};