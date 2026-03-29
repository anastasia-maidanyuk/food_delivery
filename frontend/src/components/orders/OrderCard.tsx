import {
  Box, Typography, Chip, Button, Divider, CircularProgress,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReplayIcon from '@mui/icons-material/Replay';
import { useNavigate } from 'react-router-dom';
import { Order } from '../../types';

type StatusColor = 'default' | 'warning' | 'success' | 'error';

const statusColor = (status: string): StatusColor => {
  if (status === 'pending') return 'warning';
  if (status === 'completed') return 'success';
  if (status === 'cancelled') return 'error';
  return 'default';
};

interface OrderCardProps {
  order: Order;
  reordering: boolean;
  onReorder: () => void;
}

export default function OrderCard({ order, reordering, onReorder }: OrderCardProps) {
  const navigate = useNavigate();

  return (
    <Accordion
      elevation={0}
      sx={{
        mb: 2, borderRadius: '12px !important',
        border: '1px solid #eee', '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: 3 }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" width="100%">
          <Typography fontWeight={800} color="error.main">#{order.id}</Typography>
          <Chip
            label={order.status} size="small"
            color={statusColor(order.status)}
            sx={{ fontWeight: 700 }}
          />
          <Typography variant="body2" color="text.secondary">
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </Typography>
          <Typography fontWeight={800} color="error.main" sx={{ ml: 'auto', mr: 1 }}>
            ${Number(order.total_price).toFixed(2)}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 0 }}>
        <Divider sx={{ mb: 2 }} />

        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          {order.items.map((item, idx) => (
            <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" fontWeight={600}>{item.product_name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ${Number(item.product_price).toFixed(2)} × {item.quantity}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={700}>
                ${(Number(item.product_price) * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" mb={2}>
          📍 {order.address}
        </Typography>

        <Button
          variant="contained" color="error"
          startIcon={reordering ? <CircularProgress size={16} color="inherit" /> : <ReplayIcon />}
          onClick={onReorder}
          disabled={reordering}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          {reordering ? 'Adding to cart…' : 'Reorder'}
        </Button>

        <Button
          variant="outlined" color="error"
          sx={{ ml: 1, fontWeight: 700, borderRadius: 2 }}
          onClick={() => navigate('/cart')}
        >
          Go to Cart
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}