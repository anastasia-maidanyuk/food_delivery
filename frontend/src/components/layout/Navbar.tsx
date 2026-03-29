import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Badge, Box, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import { useCartStore } from '../../store/cartStore';

interface NavbarProps {
  onMenuOpen?: () => void;
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuOpen }: NavbarProps) {
  const navigate = useNavigate();
  const { totalCount } = useCartStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="sticky" sx={{ bgcolor: '#d32f2f', boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && onMenuOpen && (
            <IconButton color="inherit" onClick={onMenuOpen} sx={{ mr: 0.5 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <StorefrontIcon fontSize="large" />
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.5px' }}>
              FoodDelivery
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <Button
            color="inherit"
            startIcon={<LocalOfferIcon />}
            onClick={() => navigate('/coupons')}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              fontWeight: 700,
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            Coupons
          </Button>
          <Button
            color="inherit"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/orders')}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              fontWeight: 700,
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            Orders
          </Button>
          <Button
            color="inherit"
            variant="contained"
            startIcon={
              <Badge badgeContent={totalCount()} color="warning">
                <ShoppingCartIcon />
              </Badge>
            }
            onClick={() => navigate('/cart')}
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
              fontWeight: 700,
              px: { xs: 1.5, sm: 3 },
            }}
          >
            {isMobile ? 'Cart' : 'Shopping Cart'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}