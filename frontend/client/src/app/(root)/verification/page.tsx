"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  TextField, 
  Typography, 
  Box, 
  IconButton, 
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { 
  Upload as UploadIcon, 
  X as XIcon, 
  Image as ImageIcon 
} from 'lucide-react';
import axiosInstance from "../../../apicalls/axiosInstance";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { categoryBrands } from '../../../constants';

interface FormData {
  title: string;
  description: string;
  category: string;
  brand: string;
  startingPrice: number;
  startTime: string;
  endTime: string;
  frontImage: string;
  additionalImages: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof FormData, string>>;
}

const validateForm = (data: FormData): ValidationResult => {
  const errors: Partial<Record<keyof FormData, string>> = {};

  if (!data.frontImage) {
    errors.frontImage = "Main product image is required";
  }

  if (!data.title.trim()) {
    errors.title = "Product title is required";
  }

  if (data.additionalImages.length > 5) {
    errors.additionalImages = "You can upload a maximum of 5 additional images";
  }

  if (data.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters long";
  }

  if (!data.startingPrice || data.startingPrice <= 0) {
    errors.startingPrice = "Please enter a valid starting price";
  }

  if (!data.endTime) {
    errors.endTime = "Please set an end time for the auction";
  } else {
    const endDateTime = new Date(data.endTime);
    const now = new Date();
    if (endDateTime <= now) {
      errors.endTime = "End time must be in the future";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:image/[type];base64, prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      }
    };
    reader.onerror = error => reject(error);
  });
};

const ProductAuctionPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    brand: '',
    startingPrice: 0,
    startTime: new Date().toISOString(),
    endTime: '',
    frontImage: '',
    additionalImages: []
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    if (formData.category) {
      setAvailableBrands(categoryBrands[formData.category as keyof typeof categoryBrands] || []);
      setFormData(prev => ({ ...prev, brand: '' }));
    }
  }, [formData.category]);

  const handleMainImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        setFormData(prev => ({ ...prev, frontImage: base64String }));
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
    }
  };

  const handleAdditionalImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + formData.additionalImages.length > 5) {
      setErrors(prev => ({
        ...prev,
        additionalImages: "Maximum 5 images allowed"
      }));
      return;
    }

    try {
      const base64Promises = files.map(file => fileToBase64(file));
      const base64Results = await Promise.all(base64Promises);
      
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...base64Results]
      }));
    } catch (error) {
      console.error('Error converting images to base64:', error);
    }
  };

  const removeAdditionalImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?._id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const validation = validateForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startingPrice: formData.startingPrice,
        startTime: formData.startTime,
        endTime: formData.endTime,
        frontImage: formData.frontImage,
        additionalImages: formData.additionalImages
      };

      await axiosInstance.post('/auctions', payload);
      alert('Auction created successfully');
      router.push('/home');
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error);
        const axiosError = error as { response?: { data?: { message: string }, message: string } };
        alert(axiosError.response?.data?.message || "An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box maxWidth="lg" sx={{ mx: 'auto', p: 3 }}>
      <Card>
        <CardHeader title="Create New Auction" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Main Product Image */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Main Product Image
                </Typography>
                <Box sx={{ 
                  border: 2, 
                  borderStyle: 'dashed', 
                  borderColor: errors.frontImage ? 'error.main' : 'grey.300', 
                  borderRadius: 2, 
                  p: 2 
                }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="mainImage"
                    onChange={handleMainImageUpload}
                  />
                  {formData.frontImage ? (
                    <Box sx={{ position: 'relative' }}>
                      <img 
                        src={`data:image/jpeg;base64,${formData.frontImage}`}
                        alt="Main Product" 
                        style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => setFormData(prev => ({ ...prev, frontImage: '' }))}
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          bgcolor: 'error.main', 
                          color: 'white',
                          '&:hover': { bgcolor: 'error.dark' }
                        }}
                      >
                        <XIcon size={16} />
                      </IconButton>
                    </Box>
                  ) : (
                    <label htmlFor="mainImage" style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 400,
                      cursor: 'pointer' 
                    }}>
                      <ImageIcon size={40} />
                      <Typography color="textSecondary" sx={{ mt: 1 }}>
                        Upload Main Product Image
                      </Typography>
                    </label>
                  )}
                </Box>
                {errors.frontImage && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.frontImage}
                  </Typography>
                )}
              </Grid>

              {/* Additional Images */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Additional Images (Max 5)
                </Typography>
                <Box sx={{ 
                  border: 2, 
                  borderStyle: 'dashed', 
                  borderColor: errors.additionalImages ? 'error.main' : 'grey.300', 
                  borderRadius: 2, 
                  p: 2 
                }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    id="additionalImages"
                    onChange={handleAdditionalImagesUpload}
                  />
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                    {formData.additionalImages.map((base64Image, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <img 
                          src={`data:image/jpeg;base64,${base64Image}`}
                          alt={`Additional ${index + 1}`} 
                          style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 8 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeAdditionalImage(index)}
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            bgcolor: 'error.main', 
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' }
                          }}
                        >
                          <XIcon size={16} />
                        </IconButton>
                      </Box>
                    ))}
                    {formData.additionalImages.length < 5 && (
                      <label htmlFor="additionalImages" style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: 150,
                        border: '2px dashed #ccc',
                        borderRadius: 8,
                        cursor: 'pointer'
                      }}>
                        <UploadIcon size={24} />
                        <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                          Add More
                        </Typography>
                      </label>
                    )}
                  </Box>
                </Box>
                {errors.additionalImages && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.additionalImages}
                  </Typography>
                )}
              </Grid>

              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  error={!!errors.title}
                  helperText={errors.title}
                />
              </Grid>

              {/* Category and Brand Selection */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category (Optional)</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category (Optional)"
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {Object.keys(categoryBrands).map((category) => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Brand (Optional)</InputLabel>
                  <Select
                    value={formData.brand}
                    label="Brand (Optional)"
                    disabled={!formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  >
                    {availableBrands.map((brand) => (
                      <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField 
                  fullWidth
                  multiline
                  rows={4}
                  label="Product Description"
                  placeholder="Provide detailed description of your product"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Grid>

              {/* Price and Times */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Starting Price"
                  type="number"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, startingPrice: parseFloat(e.target.value) }))}
                  error={!!errors.startingPrice}
                  helperText={errors.startingPrice}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
              <TextField
                    fullWidth
                    label="End Time"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    error={!!errors.endTime}
                    helperText={errors.endTime}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    disabled={isSubmitting}
                    sx={{ 
                      mt: 2,
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    {isSubmitting ? 'Creating Auction...' : 'Create Auction'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
};

export default ProductAuctionPage;