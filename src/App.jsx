import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout'

import Home from './pages/Home'
import Opportunities from './pages/Opportunities'
import OpportunityDetails from './pages/OpportunityDetails'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="opportunities/:id" element={<OpportunityDetails />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="account" element={<Account />} />
          <Route path="about" element={<About />} />
          <Route path="qase" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App