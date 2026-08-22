import { useState } from 'react'
import axios from 'axios'
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
    <div className="App">
      <h1>Test comunicazione</h1>
    </div>
    
  )
}
export default App
