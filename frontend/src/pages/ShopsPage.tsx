import { useEffect, useState, useMemo } from 'react';
import { Box, Container, Grid, Drawer, IconButton, Typography, Snackbar, Alert, CircularProgress, Button, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useMediaQuery, useTheme } from '@mui/material';

import Navbar from '../components/layout/Navbar';
import ShopSidebar from '../components/shops/ShopSidebar';
import ProductGrid from '../components/shops/ProductGrid';
import { getShops, getShop } from '../api';
import { Shop, Product, Pagination } from '../types';
import { useCartStore } from '../store/cartStore';
import { useSnackbar } from '../hooks/useSnackbar';

const PRODUCTS_PER_PAGE = 6;

export default function ShopsPage() {
  const { addItem } = useCartStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const snackbar = useSnackbar();

  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<(Shop & { products: Product[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name-az');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<{ min: number; max: number } | null>(null);

  useEffect(() => {
    getShops().then(setShops).finally(() => setLoading(false));
  }, []);

  const handleSelectShop = async (shop: Shop) => {
    setProductsLoading(true);
    setSelectedCategories([]);
    setCurrentPage(1);
    if (isMobile) setDrawerOpen(false);
    try {
      const data = await getShop(shop.id, 1, PRODUCTS_PER_PAGE);
      setSelectedShop({ ...data, products: data.products });
      setPagination(data.pagination);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!selectedShop || !pagination?.hasMore || loadingMore) return;
    const nextPage = currentPage + 1;
    setLoadingMore(true);
    try {
      const data = await getShop(selectedShop.id, nextPage, PRODUCTS_PER_PAGE);
      setSelectedShop((prev) => prev ? { ...prev, products: [...prev.products, ...data.products] } : prev);
      setPagination(data.pagination);
      setCurrentPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAdd = (product: Product) => {
    addItem(product);
    setAddedId(product.id);
    snackbar.show();
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') return setSelectedCategories([]);
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const categories = useMemo(() => {
    if (!selectedShop) return [];
    return Array.from(new Set(selectedShop.products.map((p) => p.category).filter(Boolean)));
  }, [selectedShop]);

  const displayedProducts = useMemo(() => {
    if (!selectedShop) return [];
    let result = [...selectedShop.products];
    if (selectedCategories.length > 0) result = result.filter((p) => selectedCategories.includes(p.category));
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [selectedShop, selectedCategories, sortBy]);

  const drawerPaperSx = { width: 300, p: 2, pt: 1 };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Navbar onMenuClick={() => setDrawerOpen(true)} />

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: drawerPaperSx } }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={700}>Browse Shops</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <ShopSidebar
          shops={shops} loading={loading} selectedShop={selectedShop}
          ratingFilter={ratingFilter} onRatingChange={setRatingFilter}
          onSelectShop={handleSelectShop}
        />
      </Drawer>

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
        <Grid container spacing={3}>
          {!isMobile && (
            <Grid size={{ md: 3 }}>
              <ShopSidebar
                shops={shops} loading={loading} selectedShop={selectedShop}
                ratingFilter={ratingFilter} onRatingChange={setRatingFilter}
                onSelectShop={handleSelectShop}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 9 }}>
            {!selectedShop && !productsLoading && (
              <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#fff', borderRadius: 5, border: '2px dashed #ddd' }}>
                <StorefrontIcon sx={{ fontSize: 80, color: '#eee', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                  {isMobile ? 'Tap ☰ to browse shops' : 'Pick a shop to start your order'}
                </Typography>
                {isMobile && (
                  <Button variant="contained" color="error"
                    sx={{ mt: 2, fontWeight: 700, borderRadius: 2 }}
                    onClick={() => setDrawerOpen(true)}>
                    Browse Shops
                  </Button>
                )}
              </Box>
            )}

            {selectedShop && (
              <Box mb={2} display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Typography variant="h5" fontWeight={800}>{selectedShop.name}</Typography>
                <Chip label={`${pagination?.total ?? displayedProducts.length} items`} color="error" variant="filled" sx={{ fontWeight: 700 }} />
                {selectedCategories.length > 0 && (
                  <Button size="small" color="error" onClick={() => setSelectedCategories([])} sx={{ textTransform: 'none', fontWeight: 600 }}>
                    Clear filters
                  </Button>
                )}
              </Box>
            )}

            {productsLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <CircularProgress color="error" size={60} />
              </Box>
            ) : selectedShop ? (
              <ProductGrid
                products={displayedProducts}
                categories={categories}
                selectedCategories={selectedCategories}
                sortBy={sortBy}
                addedId={addedId}
                pagination={pagination}
                loadingMore={loadingMore}
                onCategoryClick={handleCategoryClick}
                onSortChange={setSortBy}
                onAdd={handleAdd}
                onLoadMore={handleLoadMore}
              />
            ) : null}
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={snackbar.hide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" sx={{ fontWeight: 700, borderRadius: 3 }}>
          Yummy! Item added to your cart.
        </Alert>
      </Snackbar>
    </Box>
  );
}