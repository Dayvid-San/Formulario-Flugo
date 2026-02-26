import { useState } from 'react'
import { Dashboard } from './features/registration/Dashboard'
import { MultiStepForm } from './features/registration/MultiStepForm';
import { NavbarsLayout } from './components/NavbarsLayout';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <NavbarsLayout>
      {isFormOpen ? (
        <MultiStepForm onCancel={() => setIsFormOpen(false)} />
      ) : (
        <Dashboard onAddNew={() => setIsFormOpen(true)} />
      )}
    </NavbarsLayout>
  );
}

export default App;