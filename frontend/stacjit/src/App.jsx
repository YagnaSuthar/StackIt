
import React, { useState } from 'react'
import Navbar from './Components/Navbar.jsx'
import HomePage from './Pages/HomePage.jsx'
import { Home } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <HomePage />
    </>
  )
}

export default App
