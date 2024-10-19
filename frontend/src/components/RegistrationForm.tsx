// src/components/RegistrationForm.tsx
import React, { useState } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import { formatISO } from 'date-fns';
import Notification from './Notification';

interface Registration {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<Registration>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();

  // Validation Function
  const validate = (): boolean => {
    const newErrors: Errors = {};

    // Name Validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format.';
      }
    }

    // Phone Validation (assuming 10 digits)
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits.';
      }
    }

    // Date of Birth Validation
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of Birth is required.';
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error for the field being edited
    setErrors({
      ...errors,
      [e.target.name]: undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setNotification({
        open: true,
        message: 'Please fix the errors in the form.',
        severity: 'error',
      });
      return; // Stop submission if validation fails
    }

    // Format date_of_birth before sending
    const formattedData = {
      ...formData,
      date_of_birth: formatISO(new Date(formData.date_of_birth)),
    };

    axios
      .post('/registrations', formattedData)
      .then(() => {
        setNotification({
          open: true,
          message: 'Registration created successfully!',
          severity: 'success',
        });
        // Redirect to the registrations list page after a short delay
        setTimeout(() => navigate('/registrations'), 1500);
      })
      .catch((error) => {
        console.error(error);
        setNotification({
          open: true,
          message: 'Failed to create registration.',
          severity: 'error',
        });
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            {/* Name Field */}
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* Phone Field */}
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            {/* Date of Birth Field */}
            <Grid item xs={12}>
              <TextField
                label="Date of Birth"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                fullWidth
                required
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date_of_birth}
                helperText={errors.date_of_birth}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Notification Snackbar */}
      <Notification
        open={notification.open}
        onClose={() =>
          setNotification({ ...notification, open: false })
        }
        message={notification.message}
        severity={notification.severity}
      />
    </Container>
  );
};

export default RegistrationForm;