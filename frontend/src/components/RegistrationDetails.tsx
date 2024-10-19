// src/components/RegistrationDetails.tsx
import React, { useEffect, useState } from 'react';
import axios from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
} from '@mui/material';
import { format } from 'date-fns';

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

const RegistrationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/registrations/${id}`)
      .then((response) => {
        setRegistration(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to fetch registration details.');
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      axios
        .delete(`/registrations/${id}`)
        .then(() => {
          alert('Registration deleted successfully.');
          navigate('/registrations');
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to delete registration.');
        });
    }
  };

  if (!registration) {
    return <div>Loading...</div>;
  }

  // Format date_of_birth
  const formattedDOB = registration.date_of_birth
    ? format(new Date(registration.date_of_birth), 'MMMM do, yyyy')
    : 'N/A';

    return (
      <Container maxWidth="sm">
        <Paper sx={{ padding: 4, marginTop: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Registration Details
          </Typography>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="body1">
              <strong>Name:</strong> {registration.name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {registration.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {registration.phone}
            </Typography>
            <Typography variant="body1">
              <strong>Date of Birth:</strong> {formattedDOB}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/registrations/${registration.id}/edit`)}
            sx={{ marginRight: 2 }}
          >
            Edit
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Paper>
      </Container>
    );
};

export default RegistrationDetails;