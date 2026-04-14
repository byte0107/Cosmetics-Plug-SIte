import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import BontleChat from './pages/BontleChat';
import Club from './pages/Club';
import Admin from './pages/Admin';
import AdminGuard from './components/AdminGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin — completely separate, no Layout wrapper */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        />

        {/* Public site — all inside Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="bontle" element={<BontleChat />} />
          <Route path="club" element={<Club />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}