import { Box, Typography, Divider, Paper } from '@mui/material';
import { useCartStore } from '../../store/cartStore';

export default function CartSummary() {
  const { totalPrice, discountedPrice, couponCode, discountPercent } = useCartStore();
  const final = discountedPrice();
  const hasDiscount = discountPercent > 0;

  return (
    <Paper elevation={0} sx={{ mt: 2, p: 2.5, borderRadius: 3, border: '1px solid #eee', bgcolor: '#fff' }}>
      {hasDiscount && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body1" color="text.secondary" fontWeight={600}>Subtotal</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${totalPrice().toFixed(2)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body1" color="success.main" fontWeight={700}>
              Coupon ({couponCode}) −{discountPercent}%
            </Typography>
            <Typography variant="body1" color="success.main" fontWeight={700}>
              −${(totalPrice() - final).toFixed(2)}
            </Typography>
          </Box>
          <Divider sx={{ mb: 1 }} />
        </>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={600} color="text.secondary">Total</Typography>
        <Typography variant="h5" fontWeight={900} color="error.main">${final.toFixed(2)}</Typography>
      </Box>
    </Paper>
  );
}