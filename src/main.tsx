import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'

// Podes personalizar as cores da Flugo aqui (ex: o verde do botão)
const theme = createTheme({
  palette: {
    primary: {
      main: '#00c853', // Verde da Flugo
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* O CssBaseline remove margens padrão e aplica estilos base do MUI */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)