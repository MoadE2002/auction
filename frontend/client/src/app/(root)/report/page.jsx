"use client";
// pages/report.js

import React, { useState } from 'react';
import axiosInstance from '../../../apicalls/axiosInstance';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert
} from '@mui/material';
import { useAuthContext } from '../../../hooks/useAuthContext';

const ReportForm = () => {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuthContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Add validation checks
    if (!content || !user._id) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const response = await axiosInstance.post('/reports/create', {
        userId: user._id,
        content,
      });

      setMessage('Report submitted successfully. You will be contacted via email soon.');
      setContent('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error submitting report');
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Submit a Report
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Description"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            disabled={!content}
          >
            Submit Report
          </Button>
        </form>
        {message && (
          <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default ReportForm;
