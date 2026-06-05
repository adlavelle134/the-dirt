import { Routes, Route } from 'react-router-dom'
import Background from './components/Background'
import Home from './pages/Home'
import Course from './pages/Course'
import Timer from './pages/Timer'
import Scoreboard from './pages/Scoreboard'
import Admin from './pages/Admin'

export default function App() {
  return (
    <>
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course" element={<Course />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}
