import {
  Box, Paper, Typography, Button, TextField, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { FormErrors } from '../../types';

interface OrderSearchFormProps {
  loading: boolean;
  onSearch: (params: { email?: string; phone?: string; orderId?: number }) => void;
}

export default function OrderSearchForm({ loading, onSearch }: OrderSearchFormProps) {
  const [searchMode, setSearchMode] = useState<'emailPhone' | 'orderId'>('emailPhone');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<FormErrors & { orderId?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (searchMode === 'orderId') {
      if (!orderId || isNaN(parseInt(orderId)))
        newErrors.orderId = 'Please enter a valid order ID';
    } else {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = 'Please enter a valid email';
      if (!phone || !/^\+?[\d\s\-().]{7,20}$/.test(phone))
        newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (!validate()) return;
    const params = searchMode === 'orderId'
      ? { orderId: parseInt(orderId) }
      : { email, phone };
    onSearch(params);
  };

  const switchMode = (mode: 'emailPhone' | 'orderId') => {
    setSearchMode(mode);
    setErrors({});
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #eee', mb: 3 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>Find your orders</Typography>

      <Box display="flex" gap={1} mb={3}>
        <Button
          variant={searchMode === 'emailPhone' ? 'contained' : 'outlined'}
          color="error" size="small"
          onClick={() => switchMode('emailPhone')}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Email + Phone
        </Button>
        <Button
          variant={searchMode === 'orderId' ? 'contained' : 'outlined'}
          color="error" size="small"
          onClick={() => switchMode('orderId')}
          sx={{ borderRadius: 2, fontWeight: 700 }}
        >
          Order ID
        </Button>
      </Box>

      {searchMode === 'emailPhone' ? (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email" type="email" value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
            error={!!errors.email} helperText={errors.email}
            placeholder="you@example.com" fullWidth color="error"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="Phone" type="tel" value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
            error={!!errors.phone} helperText={errors.phone}
            placeholder="+1 302 543 20 12" fullWidth color="error"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Box>
      ) : (
        <TextField
          label="Order ID" type="number" value={orderId}
          onChange={(e) => { setOrderId(e.target.value); setErrors((p) => ({ ...p, orderId: undefined })); }}
          error={!!errors.orderId} helperText={errors.orderId}
          placeholder="e.g. 42" fullWidth color="error"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      )}

      <Button
        variant="contained" color="error" fullWidth size="large"
        onClick={handleSearch} disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
        sx={{ mt: 3, fontWeight: 800, borderRadius: 2, py: 1.5 }}
      >
        {loading ? 'Searching…' : 'Search Orders'}
      </Button>
    </Paper>
  );
}