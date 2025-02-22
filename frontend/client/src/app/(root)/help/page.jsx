import React from 'react';
import Link from 'next/link';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Box 
} from '@mui/material';
import { 
  AddBox as AddProductIcon, 
  QuestionAnswer as FAQIcon, 
  Support as SupportIcon 
} from '@mui/icons-material';

export default function HelpPage() {
  return (
    <Container maxWidth="xl" className="py-12 bg-white">
      <Typography 
        variant="h2" 
        align="center" 
        gutterBottom 
        className="text-black font-bold mb-10"
      >
        Auction Platform Support
      </Typography>

      {/* Hero Section */}
      <Paper elevation={3} className="mb-12 p-8 bg-white border border-[#D4AF37]">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" className="text-black mb-4">
              Get Help With Your Auction Journey
            </Typography>
            <Typography variant="body1" paragraph className="text-black">
              Our platform makes buying and selling products easy. From product listing to bidding, we ensure that your auction experience is smooth and efficient.
            </Typography>
            <Box display="flex" gap={2} mt={3}>
              <Link href="/add-product" passHref>
                <Button 
                  variant="contained" 
                  className="bg-[#D4AF37] hover:bg-[#B58B2B] text-black font-semibold"
                  startIcon={<AddProductIcon />}
                  size="large"
                >
                  Add Product
                </Button>
              </Link>
              <Link href="/faq" passHref>
                <Button 
                  variant="outlined" 
                  className="border-[#D4AF37] text-[#D4AF37] font-semibold hover:bg-[#D4AF37] hover:text-white"
                  startIcon={<FAQIcon />}
                  size="large"
                >
                  Frequently Asked Questions
                </Button>
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box 
              component="img" 
              src="/assets/auction/auction1-removebg-preview.png" 
              alt="Auction Process" 
              className="w-full rounded-lg"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Service Cards */}
      <Grid container spacing={4}>
        {/* Product Listing Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={4} 
            className="h-full p-6 hover:shadow-2xl transition-shadow duration-300 bg-white border border-[#D4AF37]"
          >
            <Box display="flex" alignItems="center" mb={2}>
              <AddProductIcon className="text-[#D4AF37] mr-3" fontSize="large" />
              <Typography variant="h5" className="text-black">
                Product Listing
              </Typography>
            </Box>
            <Typography variant="body1" paragraph className="text-black">
              Easily list your product with a minimum price and description. Let buyers place bids and get notified when someone bids.
            </Typography>
            <Link href="/add-product" passHref>
              <Button 
                variant="contained" 
                className="bg-[#D4AF37] text-black hover:bg-[#B58B2B] fullWidth mt-4"
              >
                List Your Product
              </Button>
            </Link>
          </Paper>
        </Grid>

        {/* AI Estimate Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={4} 
            className="h-full p-6 hover:shadow-2xl transition-shadow duration-300 bg-white border border-[#D4AF37]"
          >
            <Box display="flex" alignItems="center" mb={2}>
              <FAQIcon className="text-[#D4AF37] mr-3" fontSize="large" />
              <Typography variant="h5" className="text-black">
                AI Price Estimate
              </Typography>
            </Box>
            <Typography variant="body1" paragraph className="text-black">
              Use our AI-powered assistant to get an estimated price for your product before listing it. Get instant feedback.
            </Typography>
            <Link href="/ai-estimate" passHref>
              <Button 
                variant="contained" 
                className="bg-[#D4AF37] text-black hover:bg-[#B58B2B] fullWidth mt-4"
              >
                Get Estimate
              </Button>
            </Link>
          </Paper>
        </Grid>

        {/* Support & Help Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={4} 
            className="h-full p-6 hover:shadow-2xl transition-shadow duration-300 bg-white border border-[#D4AF37]"
          >
            <Box display="flex" alignItems="center" mb={2}>
              <SupportIcon className="text-[#D4AF37] mr-3" fontSize="large" />
              <Typography variant="h5" className="text-black">
                24/7 Support
              </Typography>
            </Box>
            <Typography variant="body1" paragraph className="text-black">
              Our support team is available 24/7 to help you with any issues regarding your products, bids, or account.
            </Typography>
            <Link href="/contact" passHref>
              <Button 
                variant="contained" 
                className="bg-[#D4AF37] text-black hover:bg-[#B58B2B] fullWidth mt-4"
              >
                Contact Support
              </Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
