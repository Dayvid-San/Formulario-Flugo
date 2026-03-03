import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Dashboard } from './features/registration/Dashboard';
import { RegisterColaboradorPage } from './pages/RegisterCollaboratorPage';
import { DepartmentsPage } from './pages/DepartamentsPage';


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

const DashboardWrapper = () => {
  const navigate = useNavigate();

  const handleAddNew = () => {
    navigate('/cadastrar');
  };

  return <Dashboard onAddNew={handleAddNew} />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        <Routes>
          {/* Rota Pública */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/cadastrar" element={<RegisterColaboradorPage />} />
            <Route path="/departamentos" element={<DepartmentsPage />} />
          </Route>

          {/* Rota 404 para URLs que não existem */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
