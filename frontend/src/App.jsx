import { useState } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './componenti/Navbar'
import Home from './pagine/Home'
import Login from './pagine/Login'
import Registrazione from './pagine/Registrazione'
import './App.css'

function App() {

  const response = axios.get('http://localhost:3000/api/hello')
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.error(error)
    })
  

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registrazione" element={<Registrazione />} />
      </Routes>
    </Router>
    
    
  )
}
export default App
