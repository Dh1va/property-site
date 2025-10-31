import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import Buy from './pages/Buy'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import PropertyDetails from './pages/PropertyDetails'
import PropertyListPage from './pages/PropertyListPage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <> 
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Home / Buy pages */}
        <Route path="/" element={<Buy />} />
        <Route path="/buy" element={<Buy />} />

        {/* Property Details */}
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* Property List by city or type */}
        <Route path="/properties/:category" element={<PropertyListPage />} />

        {/* Contact */}
        <Route path="/contact" element={<Contact />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="p-8 text-center text-lg text-gray-600">
              404 — Page Not Found
            </div>
          }
        />
      </Routes>
      <Footer />
    </>
  )
}

export default App
