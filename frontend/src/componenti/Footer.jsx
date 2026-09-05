import React, { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Contesto } from "../contesto/AuthContext";
import axios from "axios";
import "./Footer.css"
import kill_bill from "../assets/kill_bill.png"

export function Footer() {

    const navigate = useNavigate()

    const { token } = React.useContext(Contesto)
    const [isAdmin, setIsAdmin]= useState(false)
    const [nome, setNome]=useState("")
    const [email, setEmail]=useState("")
    const [motivo, setMotivo]=useState("")

useEffect(() => {

    if(!token) return;

    const handleFooter = async () => {
        try {
            const utente = await axios.get("http://localhost:3000/api/profile", {
                headers: {Authorization: `Bearer ${token}`}
            })
            setNome(utente.data.user.nome);
            setEmail(utente.data.user.email)
            if (utente && utente.data.user.ruolo === "admin") {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch(errore) {
            console.error(errore)
        }
    }
    handleFooter()
    
}, [token])

const handleForm = async (e) => {
    e.preventDefault()
        try {
            await axios.post("http://localhost:3000/api/richieste", {motivo}, {
                headers: {Authorization: `Bearer ${token}`}
            })
            setMotivo("")
            navigate("/")
        } catch(errore) {
            console.error(errore)
        }
    }

return(
    <footer className="footer-container">
        <div className="footer-gruppo">
            <img className="footer-img" src= {kill_bill} />
            <div className="sezione-autore">
                <h4>Diventa un autore</h4>
                <form className="form-autore" onSubmit={handleForm}>
                    <input 
                    type="nome"
                    id="Nome"
                    placeholder="Nome"
                    value={nome}
                    readOnly
                    />
                    <input 
                    type="email"
                    id="Email"
                    placeholder="Email"
                    value={email}
                    readOnly
                    />
                    <textarea
                    className="autore-motivo"
                    type="text"
                    placeholder="Perchè vorresti diventare autore"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    required
                    />
                    <button type="submit" className="footer-bottone">Invia</button>
                </form>
            </div>

            <div className="Social">
                    <h4>Seguici anche qui</h4>

            </div>
        </div>
    </footer>
)}