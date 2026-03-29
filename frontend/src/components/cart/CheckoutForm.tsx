import {
  Box, TextField, Button, CircularProgress, Divider,
  Typography, Paper
} from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useState } from 'react';
import { FormErrors } from '../../types';
import { useCartStore } from '../../store/cartStore';
import CouponInput from './CouponInput';

interface CheckoutFormProps {
  onSubmit: (data: { email: string; phone: string; address: string }) => Promise<void>;
  submitting: boolean;
  errors: FormErrors;
  onErrorClear: (field: keyof FormErrors) => void;
  finalPrice: number;
}

export default function CheckoutForm({
  onSubmit, submitting, errors, onErrorClear, finalPrice,
}: CheckoutFormProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const { items, totalPrice, discountedPrice, discountPercent } = useCartStore();

  const hasDiscount = discountPercent > 0;
  const final = discountedPrice();

  const handleSubmit = () => onSubmit({ email, phone, address });

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #eee', bgcolor: '#fff' }}>
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <LocalShippingOutlinedIcon color="error" />
        <Typography variant="h6" fontWeight={700}>Delivery details</Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={2.5}>
        <TextField
          label="Email" type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); onErrorClear('email'); }}
          error={!!errors.email} helperText={errors.email}
          placeholder="you@example.com" fullWidth required color="error"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          label="Phone" type="tel" value={phone}
          onChange={(e) => { setPhone(e.target.value); onErrorClear('phone'); }}
          error={!!errors.phone} helperText={errors.phone}
          placeholder="+1 302 543 20 12" fullWidth required color="error"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          label="Delivery Address" value={address}
          onChange={(e) => { setAddress(e.target.value); onErrorClear('address'); }}
          error={!!errors.address} helperText={errors.address}
          placeholder="123 Main St, City, Country"
          fullWidth required multiline rows={3} color="error"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />

        <CouponInput />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ bgcolor: '#fafafa', borderRadius: 2, p: 2, mb: 3, display: { xs: 'none', md: 'block' } }}>
        {items.map((item) => (
          <Box key={item.product.id} display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '65%' }}>
              {item.product.name} × {item.quantity}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 1 }} />
        {hasDiscount ? (
          <>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                ${totalPrice().toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2" color="success.main" fontWeight={700}>
                Coupon −{discountPercent}%
              </Typography>
              <Typography variant="body2" color="success.main" fontWeight={700}>
                −${(totalPrice() - final).toFixed(2)}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={900} color="error.main">${final.toFixed(2)}</Typography>
            </Box>
          </>
        ) : (
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={700}>Total</Typography>
            <Typography fontWeight={900} color="error.main">${totalPrice().toFixed(2)}</Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="contained" color="error" fullWidth size="large"
        onClick={handleSubmit} disabled={submitting}
        sx={{
          fontWeight: 800, borderRadius: 2, py: 1.8,
          fontSize: 16, letterSpacing: 0.5,
          mb: { xs: 2, md: 0 },
        }}
      >
        {submitting
          ? <CircularProgress size={24} color="inherit" />
          : `Place order · $${finalPrice.toFixed(2)}`}
      </Button>
    </Paper>
  );
}