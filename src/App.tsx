import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Dashboard } from './features/registration/Dashboard';
import { DepartmentsPage } from './pages/DepartamentsPage';
import { MultiStepForm } from './features/registration/MultiStepForm'; 


const theme = createTheme({
  palette: {
    primary: { main: '#00c853' },
    background: { default: '#f5f5f5' },
  },
  typography: { fontFamily: 'Roboto, Arial, sans-serif' },
});

const DashboardWrapper = () => {
  const navigate = useNavigate();
  return <Dashboard onAddNew={() => navigate('/cadastrar')} />;
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  return <MultiStepForm onCancel={() => navigate('/dashboard')} />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/departamentos" element={<DepartmentsPage />} />
            <Route path="/cadastrar" element={<RegisterWrapper />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;