import { useState } from 'react'
import { Dashboard } from './features/registration/Dashboard'
import React from 'react';
import { MultiStepForm } from './features/registration/MultiStepForm';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="App">
      {isFormOpen ? (
        <MultiStepForm onCancel={() => setIsFormOpen(false)} />
      ) : (
        <Dashboard onAddNew={() => setIsFormOpen(true)} />
      )}
    </div>
  );
}

export default App;