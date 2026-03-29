import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Chip, Button, Box, Divider
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  isAdded: boolean;
  onAdd: () => void;
}

export default function ProductCard({ product, isAdded, onAdd }: ProductCardProps) {
  return (
    <Card
      sx={{
        height: '100%', borderRadius: 4,
        display: 'flex', flexDirection: 'column',
        transition: '0.3s', '&:hover': { boxShadow: 8 },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="170" image={product.image_url} alt={product.name} />
        <Chip
          label={product.category}
          size="small"
          sx={{
            position: 'absolute', bottom: 8, left: 8,
            bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', fontWeight: 600,
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>{product.name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 36 }}>
          {product.description}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={900} color="error.main">
          ${Number(product.price).toFixed(2)}
        </Typography>
        <Button
          variant={isAdded ? 'contained' : 'outlined'}
          color={isAdded ? 'success' : 'error'}
          startIcon={isAdded ? <CheckIcon /> : <AddShoppingCartIcon />}
          onClick={onAdd}
          sx={{ borderRadius: 2, fontWeight: 700 }}
          size="small"
        >
          {isAdded ? 'Added' : 'Add'}
        </Button>
      </CardActions>
    </Card>
  );
}