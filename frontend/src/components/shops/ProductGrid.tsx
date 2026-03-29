import { Box, Grid, Chip, Button, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Product, Pagination } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: string[];
  selectedCategories: string[];
  sortBy: string;
  addedId: number | null;
  pagination: Pagination | null;
  loadingMore: boolean;
  onCategoryClick: (cat: string) => void;
  onSortChange: (val: string) => void;
  onAdd: (product: Product) => void;
  onLoadMore: () => void;
}

export default function ProductGrid({
  products, categories, selectedCategories, sortBy,
  addedId, pagination, loadingMore,
  onCategoryClick, onSortChange, onAdd, onLoadMore,
}: ProductGridProps) {
  return (
    <>
      <Box
        sx={{
          display: 'flex', flexWrap: 'wrap', gap: 2,
          justifyContent: 'space-between', alignItems: 'center',
          bgcolor: '#fff', p: 2, borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)', mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1, alignItems: 'center' }}>
          <FilterListIcon color="action" fontSize="small" />
          <Chip
            label="All"
            onClick={() => onCategoryClick('All')}
            variant={selectedCategories.length === 0 ? 'filled' : 'outlined'}
            color={selectedCategories.length === 0 ? 'error' : 'default'}
            sx={{ fontWeight: 700, fontSize: 13, cursor: 'pointer', borderRadius: 2 }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => onCategoryClick(cat)}
              variant={selectedCategories.includes(cat) ? 'filled' : 'outlined'}
              color={selectedCategories.includes(cat) ? 'error' : 'default'}
              sx={{ fontWeight: 700, fontSize: 13, cursor: 'pointer', borderRadius: 2 }}
            />
          ))}
        </Box>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortBy} label="Sort by" onChange={(e) => onSortChange(e.target.value)}>
            <MenuItem value="name-az">Name: A → Z</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {products.map((product) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
            <ProductCard
              product={product}
              isAdded={addedId === product.id}
              onAdd={() => onAdd(product)}
            />
          </Grid>
        ))}
      </Grid>

      {pagination?.hasMore && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="outlined" color="error" size="large"
            onClick={onLoadMore} disabled={loadingMore}
            startIcon={loadingMore ? <CircularProgress size={18} color="inherit" /> : <ExpandMoreIcon />}
            sx={{ fontWeight: 700, borderRadius: 3, px: 5, py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            {loadingMore
              ? 'Loading...'
              : `Load more (${pagination.total - products.length} remaining)`}
          </Button>
        </Box>
      )}

      {!pagination?.hasMore && products.length > 0 && (
        <Box textAlign="center" py={3}>
          <Typography variant="body2" color="text.disabled" fontWeight={600}>
            You've seen all {pagination?.total} items ✓
          </Typography>
        </Box>
      )}
    </>
  );
}