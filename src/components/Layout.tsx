import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AlertBanner from './AlertBanner'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <AlertBanner />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
