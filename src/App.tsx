import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
// Importe seus componentes existentes da Parte 1
// Exemplo:
// import { DashboardPage } from './pages/DashboardPage';
// import { RegisterColaboradorPage } from './pages/RegisterColaboradorPage';
// import { NotFoundPage } from './pages/NotFoundPage'; // Você precisa criar esta página

// Defina um tema básico se necessário
const theme = createTheme({
  palette: {
    primary: {
      main: '#00c853', // Verde Flugo
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<div>Dashboard Protegido (Substitua pelo seu componente)</div>} />
          </Route>

          <Route path="*" element={<div>Página 404 Customizada (Crie seu componente e importe aqui)</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;