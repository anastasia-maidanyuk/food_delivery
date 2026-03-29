import { Box, Typography, Chip, CircularProgress, Button, Divider } from '@mui/material';
import { Shop } from '../../types';
import RatingFilter from './RatingFilter';
import ShopCard from './ShopCard';

interface ShopSidebarProps {
  shops: Shop[];
  loading: boolean;
  selectedShop: Shop | null;
  ratingFilter: { min: number; max: number } | null;
  onRatingChange: (r: { min: number; max: number } | null) => void;
  onSelectShop: (shop: Shop) => void;
}

export default function ShopSidebar({
  shops, loading, selectedShop, ratingFilter, onRatingChange, onSelectShop,
}: ShopSidebarProps) {
  const filtered = ratingFilter
    ? shops.filter((s) => (s.rating || 0) >= ratingFilter.min && (s.rating || 0) <= ratingFilter.max)
    : shops;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <RatingFilter selected={ratingFilter} onChange={onRatingChange} />

      <Divider />

      <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
        Shops
        {ratingFilter && (
          <Chip
            label={`${filtered.length} found`}
            size="small" color="error"
            sx={{ ml: 1, fontWeight: 700 }}
          />
        )}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress color="error" />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No shops match this rating filter.
          </Typography>
          <Button size="small" color="error" onClick={() => onRatingChange(null)} sx={{ mt: 1 }}>
            Clear filter
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              isSelected={selectedShop?.id === shop.id}
              onClick={() => onSelectShop(shop)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}