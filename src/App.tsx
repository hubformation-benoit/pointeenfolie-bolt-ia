import { Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './LanguageContext'
import { CartProvider } from './CartContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import OrderPage from './pages/OrderPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/fr/" replace />} />
          <Route path=":lang" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/fr/" replace />} />
        </Routes>
      </CartProvider>
    </LanguageProvider>
  )
}
