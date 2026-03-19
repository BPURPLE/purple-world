import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import EraPage from './pages/EraPage'
import SearchPage from './pages/SearchPage'
import SongPage from './pages/SongPage'
import MoodPage from './pages/MoodPage'
import MemoryWall from './pages/MemoryWall'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/era/:eraId"  element={<EraPage />} />
        <Route path="/search"      element={<SearchPage />} />
        <Route path="/song/:songId" element={<SongPage />} />
        <Route path="/mood"        element={<MoodPage />} />
        <Route path="/wall"        element={<MemoryWall />} />
      </Routes>
    </BrowserRouter>
  )
}