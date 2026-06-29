import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import AccountAnalyzer from './pages/AccountAnalyzer'
import Recommender from './pages/Recommender'
import Network from './pages/Network'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="analizador" element={<AccountAnalyzer />} />
          <Route path="recomendador" element={<Recommender />} />
          <Route path="red" element={<Network />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
