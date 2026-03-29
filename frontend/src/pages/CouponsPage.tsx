import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Container,
  Paper, Grid, Chip, CircularProgress, Button, Snackbar, Alert, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getCoupons } from '../api';
import { Coupon } from '../types';

export default function CouponsPage() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState(false);

  useEffect(() => {
    getCoupons()
      .then(setCoupons)
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setSnackbar(true);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const formatExpiry = (date: string | null) => {
    if (!date) return 'No expiry';
    const d = new Date(date);
    const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Expired';
    if (diff === 1) return 'Expires tomorrow';
    return `Expires in ${diff} days`;
  };

  const discountColor = (pct: number) => {
    if (pct >= 20) return '#d32f2f';
    if (pct >= 10) return '#f57c00';
    return '#388e3c';
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#d32f2f' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <LocalOfferIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={700}>Coupons & Discounts</Typography>
          </Box>
          <Button
            color="inherit"
            startIcon={<ShoppingCartIcon />}
            onClick={() => navigate('/cart')}
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', fontWeight: 700 }}
          >
            Cart
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box mb={3}>
            <Typography variant="h5" fontWeight={800}>Available Coupons</Typography>
            <Typography color="text.secondary">
              Copy a code and apply it at checkout to save on your order.
            </Typography>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress color="error" />
            </Box>
          ) : coupons.length === 0 ? (
            <Box textAlign="center" py={8}>
              <LocalOfferIcon sx={{ fontSize: 64, color: '#ddd', mb: 1 }} />
              <Typography color="text.secondary" fontWeight={600}>No coupons available</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {coupons.map((coupon) => (
                <Grid size={{ xs: 12, sm: 6 }} key={coupon.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: `2px dashed ${discountColor(coupon.discount_percent)}`,
                      overflow: 'hidden',
                      transition: '0.2s',
                      '&:hover': { boxShadow: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: discountColor(coupon.discount_percent),
                        px: 2, py: 1,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <Typography color="#fff" fontWeight={800} fontSize={22}>
                        -{coupon.discount_percent}%
                      </Typography>
                      <Chip
                        label={formatExpiry(coupon.expires_at)}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }}
                      />
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Typography fontWeight={700} mb={0.5}>{coupon.description}</Typography>

                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          bgcolor: '#f5f5f5', borderRadius: 2, px: 2, py: 1, mt: 1,
                        }}
                      >
                        <Typography
                          fontWeight={900}
                          letterSpacing={2}
                          fontSize={16}
                          color={discountColor(coupon.discount_percent)}
                        >
                          {coupon.code}
                        </Typography>
                        <Tooltip title={copiedCode === coupon.code ? 'Copied!' : 'Copy code'}>
                          <IconButton
                            size="small"
                            onClick={() => handleCopy(coupon.code)}
                            sx={{ color: discountColor(coupon.discount_percent) }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate('/cart')}
                        sx={{
                          mt: 2, fontWeight: 700, borderRadius: 2,
                          bgcolor: discountColor(coupon.discount_percent),
                          '&:hover': { filter: 'brightness(0.9)' },
                        }}
                      >
                        Use this coupon
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Snackbar
        open={snackbar}
        autoHideDuration={2000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ fontWeight: 700, borderRadius: 3 }}>
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}