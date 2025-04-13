import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Layout from './routes/Layout';
import DriverDetail from './components/DriverDetail'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index={true} element={<App />} />
        <Route path="/driver/:driverId" element={<DriverDetail />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
