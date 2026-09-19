import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './CartContext'
import { LanguageProvider } from './LanguageContext'
import { DataProvider } from './lib/DataContext'
import { AuthProvider } from './lib/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import OrderPage from './pages/OrderPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Public routes */}
          <Route path="/" element={<Navigate to="/fr/" replace />} />
          <Route path=":lang" element={
            <DataProvider>
              <LanguageProvider>
                <Layout />
              </LanguageProvider>
            </DataProvider>
          }>
            <Route index element={<Home />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/fr/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
