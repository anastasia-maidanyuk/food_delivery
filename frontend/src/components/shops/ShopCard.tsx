import { Card, CardMedia, CardContent, Typography, Chip } from '@mui/material';
import { Shop } from '../../types';

interface ShopCardProps {
  shop: Shop;
  isSelected: boolean;
  onClick: () => void;
}

export default function ShopCard({ shop, isSelected, onClick }: ShopCardProps) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer', borderRadius: 4,
        border: isSelected ? '2px solid #d32f2f' : '2px solid transparent',
        transition: 'all 0.3s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 5 },
        position: 'relative', overflow: 'hidden',
      }}
    >
      <Chip
        label={`⭐ ${Number(shop.rating || 0).toFixed(1)}`}
        size="small"
        sx={{
          position: 'absolute', top: 10, right: 10,
          bgcolor: 'rgba(255,255,255,0.95)', fontWeight: 800,
          color: '#333', boxShadow: 1, zIndex: 1,
        }}
      />
      <CardMedia component="img" height="110" image={shop.image_url} alt={shop.name} />
      <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
        <Typography fontWeight={700} fontSize={15} noWrap>{shop.name}</Typography>
        <Typography variant="body2" color="text.secondary" noWrap>{shop.description}</Typography>
      </CardContent>
    </Card>
  );
}