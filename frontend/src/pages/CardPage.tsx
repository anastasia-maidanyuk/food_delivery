import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Box,
  Container, Chip, Alert, Button, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { useCartStore } from '../store/cartStore';
import { createOrder } from '../api';
import { FormErrors } from '../types';
import CartItemRow from '../components/cart/CartItemRow';
import CartSummary from '../components/cart/CartSummary';
import CheckoutForm from '../components/cart/CheckoutForm';

const validate = (
  email: string,
  phone: string,
  address: string,
  itemsCount: number
): FormErrors => {
  const errors: FormErrors = {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Please enter a valid email';
  if (!phone || !/^\+?[\d\s\-().]{7,20}$/.test(phone))
    errors.phone = 'Please enter a valid phone number';
  if (!address || address.trim().length < 5)
    errors.address = 'Address must be at least 5 characters';
  if (itemsCount === 0)
    errors.items = 'Your cart is empty';
  return errors;
};

export default function CartPage() {
  const navigate = useNavigate();
  const { items, clearCart, discountedPrice, couponCode } = useCartStore();

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);

  const finalPrice = discountedPrice();

  const handleSubmit = async (formData: { email: string; phone: string; address: string }) => {
    const newErrors = validate(formData.email, formData.phone, formData.address, items.length);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    try {
      const result = await createOrder({
        ...formData,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        couponCode: couponCode || undefined,
      });
      setSuccess(result.orderId);
      clearCart();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ items: 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  if (success) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
        <Paper elevation={4} sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, textAlign: 'center', maxWidth: 420, mx: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 88, color: '#2e7d32', mb: 2 }} />
          <Typography variant="h4" fontWeight={800} gutterBottom>Order placed!</Typography>
          <Typography color="text.secondary" mb={4}>
            Order <strong>#{success}</strong> has been confirmed. We'll deliver it shortly!
          </Typography>
          <Button
            variant="contained" color="error" size="large"
            onClick={() => navigate('/')}
            sx={{ fontWeight: 700, borderRadius: 2, px: 4 }}
          >
            Back to shops
          </Button>
        </Paper>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <AppBar position="sticky" sx={{ bgcolor: '#d32f2f' }}>
          <Toolbar>
            <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>Your Cart</Typography>
          </Toolbar>
        </AppBar>
        <Box
          display="flex" flexDirection="column" alignItems="center"
          justifyContent="center" height="calc(100vh - 64px)"
          gap={2} bgcolor="#f5f5f5"
        >
          <ShoppingCartIcon sx={{ fontSize: 90, color: '#ddd' }} />
          <Typography variant="h6" color="text.secondary" fontWeight={600}>Your cart is empty</Typography>
          <Typography variant="body2" color="text.disabled">Add some delicious items first!</Typography>
          <Button
            variant="contained" color="error" onClick={() => navigate('/')}
            sx={{ fontWeight: 700, mt: 1, borderRadius: 2, px: 4 }}
          >
            Browse shops
          </Button>
        </Box>
      </>
    );
  }

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#d32f2f' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700}>Your Cart</Typography>
          </Box>
          <Chip
            label={`${items.length} item${items.length !== 1 ? 's' : ''}`}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 420px' },
            gap: 3,
            alignItems: 'flex-start',
          }}>

            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>Order Summary</Typography>

              {errors.items && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errors.items}</Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </Box>

              <CartSummary />
            </Box>

            <CheckoutForm
              onSubmit={handleSubmit}
              submitting={submitting}
              errors={errors}
              onErrorClear={clearError}
              finalPrice={finalPrice}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}