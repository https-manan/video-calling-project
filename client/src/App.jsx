import './App.css'
import { Routes, Route } from 'react-router-dom'
import Auth from './pages/auth/Auth'
function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Auth type="signin" />} />
        <Route path="/login" element={<Auth type="login" />} />

      </Routes>
    </>
  )
}

export default App
