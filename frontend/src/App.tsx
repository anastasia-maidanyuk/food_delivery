import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopsPage from './pages/ShopsPage';
import CartPage from './pages/CardPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CouponsPage from './pages/CouponsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShopsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
      </Routes>
    </BrowserRouter>
  );
}