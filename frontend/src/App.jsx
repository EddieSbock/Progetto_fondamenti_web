import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Esporta_contesto } from './contesto/AuthContext'
import Navbar from './componenti/Navbar'
import Home from './pagine/Home'
import Login from './pagine/Login'
import Registrazione from './pagine/Registrazione'
import ModificaPost from './pagine/ModificaPost'
import VisualizzaPost from './pagine/VisualizzaPost'
import Profilo from './pagine/Profilo'
import { Footer } from './componenti/Footer'
import { ProtezioneRotte } from './utility/ProtezioneRotte'
import { ElencoRichieste } from './pagine/ElencoRichieste'
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

    <Esporta_contesto>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registrazione" element={<Registrazione />} />
          <Route path="/post/:id" element={<VisualizzaPost />} />
          <Route element={<ProtezioneRotte/>}>
            <Route path="/modifica-post" element={<ModificaPost />} />
            <Route path="/modifica-post/:id" element={<ModificaPost />} />
            <Route path="/profile" element={<Profilo/>}/>
            <Route path="/ElencoRichieste" element={<ElencoRichieste/>}/>
          </Route>
        </Routes>

        <Footer/>
      </Router>   
    </Esporta_contesto>
  )
}
export default App
