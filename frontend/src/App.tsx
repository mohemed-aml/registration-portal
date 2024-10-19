// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import RegistrationsList from './components/RegistrationsList';
import RegistrationDetails from './components/RegistrationDetails';
import EditRegistrationForm from './components/EditRegistrationForm';
import Navbar from './components/Navbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  // Customize your theme here
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/registrations" element={<RegistrationsList />} />
          <Route path="/registrations/:id" element={<RegistrationDetails />} />
          <Route path="/registrations/:id/edit" element={<EditRegistrationForm />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;