// src/components/RegistrationsList.tsx
import React, { useEffect, useState } from 'react';
import axios from '../api';
import {
  Container,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

const RegistrationsList: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    axios
      .get('/registrations')
      .then((response) => {
        setRegistrations(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to fetch registrations.');
      });
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ marginTop: 4 }}>
        All Registrations
      </Typography>
      <Paper>
      <List>
          {registrations.map((reg) => (
            <ListItemButton
              key={reg.id}
              component={Link}
              to={`/registrations/${reg.id}`}
            >
              <ListItemText
                primary={reg.name}
                secondary={reg.email}
              />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default RegistrationsList;