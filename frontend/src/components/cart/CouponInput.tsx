import { Box, Typography, TextField, Button, CircularProgress, Tooltip } from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useState } from 'react';
import { applyCoupon } from '../../api';
import { useCartStore } from '../../store/cartStore';

export default function CouponInput() {
  const { couponCode, discountPercent, applyCoupon: applyToStore, removeCoupon } = useCartStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await applyCoupon(input.trim());
      applyToStore(data.code, data.discountPercent);
      setInput('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  if (couponCode) {
    return (
      <Box
        sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: '#e8f5e9', border: '1.5px solid #4caf50', borderRadius: 2, px: 2, py: 1,
        }}
      >
        <Box>
          <Typography fontWeight={800} color="success.main" letterSpacing={1}>{couponCode}</Typography>
          <Typography variant="caption" color="success.dark">-{discountPercent}% discount applied!</Typography>
        </Box>
        <Tooltip title="Remove coupon">
          <Button size="small" color="error" onClick={removeCoupon} sx={{ fontWeight: 700, minWidth: 'auto' }}>
            Remove
          </Button>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="body2" fontWeight={700} mb={1} display="flex" alignItems="center" gap={0.5}>
        <LocalOfferIcon fontSize="small" color="error" />
        Coupon Code
      </Typography>
      <Box display="flex" gap={1}>
        <TextField
          size="small" placeholder="e.g. SAVE20"
          value={input}
          onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(null); }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          error={!!error} helperText={error} color="error"
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <Button
          variant="outlined" color="error"
          onClick={handleApply}
          disabled={loading || !input.trim()}
          sx={{ fontWeight: 700, borderRadius: 2, minWidth: 90, alignSelf: 'flex-start' }}
        >
          {loading ? <CircularProgress size={16} color="inherit" /> : 'Apply'}
        </Button>
      </Box>
    </Box>
  );
}