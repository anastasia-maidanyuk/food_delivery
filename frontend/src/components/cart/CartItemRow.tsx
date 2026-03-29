import { Box, Paper, Avatar, Typography, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CartItem } from '../../types';
import { useCartStore } from '../../store/cartStore';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex', alignItems: 'center',
        gap: { xs: 1.5, sm: 2 }, p: { xs: 1.5, sm: 2 },
        borderRadius: 3, border: '1px solid #eee', bgcolor: '#fff',
        transition: '0.2s', '&:hover': { boxShadow: 3 },
      }}
    >
      <Avatar
        src={item.product.image_url}
        alt={item.product.name}
        variant="rounded"
        sx={{ width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, borderRadius: 2, flexShrink: 0 }}
      />
      <Box flex={1} minWidth={0}>
        <Typography fontWeight={700} fontSize={{ xs: 13, sm: 15 }} noWrap>{item.product.name}</Typography>
        <Typography variant="body2" color="text.secondary" fontSize={{ xs: 11, sm: 13 }}>
          ${Number(item.product.price).toFixed(2)} each
        </Typography>
        {item.product.category && (
          <Chip label={item.product.category} size="small"
            sx={{ mt: 0.5, height: 18, fontSize: 10, bgcolor: '#f5f5f5' }} />
        )}
      </Box>

      <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }} flexShrink={0}>
        <IconButton
          size="small"
          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          sx={{
            border: '1.5px solid #d32f2f', color: '#d32f2f',
            width: { xs: 26, sm: 32 }, height: { xs: 26, sm: 32 },
            '&:hover': { bgcolor: '#d32f2f', color: '#fff' },
          }}
        >
          <RemoveIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
        </IconButton>
        <Typography fontWeight={800} fontSize={{ xs: 14, sm: 16 }} minWidth={24} textAlign="center">
          {item.quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          sx={{
            border: '1.5px solid #d32f2f', color: '#d32f2f',
            width: { xs: 26, sm: 32 }, height: { xs: 26, sm: 32 },
            '&:hover': { bgcolor: '#d32f2f', color: '#fff' },
          }}
        >
          <AddIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
        </IconButton>
      </Box>

      <Typography
        fontWeight={800} fontSize={{ xs: 13, sm: 16 }} color="error.main"
        minWidth={{ xs: 50, sm: 70 }} textAlign="right" flexShrink={0}
      >
        ${(Number(item.product.price) * item.quantity).toFixed(2)}
      </Typography>

      <IconButton
        onClick={() => removeItem(item.product.id)}
        sx={{ color: '#ccc', flexShrink: 0, '&:hover': { color: '#d32f2f' }, display: { xs: 'none', sm: 'flex' } }}
      >
        <DeleteOutlineIcon />
      </IconButton>
    </Paper>
  );
}