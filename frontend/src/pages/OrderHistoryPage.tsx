import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Box,
  Container, Snackbar, Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { searchOrders, getReorderItems } from '../api';
import { Order } from '../types';
import { useCartStore } from '../store/cartStore';
import OrderSearchForm from '../components/orders/OrderSearchForm';
import OrderCard from '../components/orders/OrderCard';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean; message: string; severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleSearch = async (params: { email?: string; phone?: string; orderId?: number }) => {
    setLoading(true);
    setSearched(false);
    try {
      const data = await searchOrders(params);
      setOrders(data.orders);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response?.status === 404) {
        setOrders([]);
      } else {
        setSnackbar({ open: true, message: 'Failed to search orders', severity: 'error' });
      }
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const handleReorder = async (order: Order) => {
    setReorderingId(order.id);
    try {
      const data = await getReorderItems(order.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.items.forEach(({ product, quantity }: { product: any; quantity: number }) => {
        addItem(product, quantity);
      });
      setSnackbar({
        open: true,
        message: `${data.items.length} item(s) added to cart!`,
        severity: 'success',
      });
    } catch {
      setSnackbar({ open: true, message: 'Failed to reorder', severity: 'error' });
    } finally {
      setReorderingId(null);
    }
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#d32f2f' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <ReceiptLongIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight={700}>Order History</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <OrderSearchForm loading={loading} onSearch={handleSearch} />

          {searched && orders.length === 0 && (
            <Box textAlign="center" py={6}>
              <ReceiptLongIcon sx={{ fontSize: 64, color: '#ddd', mb: 1 }} />
              <Typography color="text.secondary" fontWeight={600}>No orders found</Typography>
              <Typography variant="body2" color="text.disabled">Try different search criteria</Typography>
            </Box>
          )}

          {orders.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                {orders.length} order{orders.length !== 1 ? 's' : ''} found
              </Typography>
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  reordering={reorderingId === order.id}
                  onReorder={() => handleReorder(order)}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ fontWeight: 700, borderRadius: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}