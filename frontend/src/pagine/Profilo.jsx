import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Contesto} from '../contesto/AuthContext'
import axios from 'axios';
import './Login.css';

export default function Profilo() {

    const {token} = React.useContext(Contesto);

    const [nome, setNome] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [mostraPassword, setMostraPassword] = React.useState(false);

    const navigate = useNavigate();

React.useEffect(() => {
    const recuperaProfilo = async () => {

        if(!token) return;

        try {
            const risposta = await axios.get("http://localhost:3000/api/profile",
                {headers: {Authorization: `Bearer ${token}`}}
            )
            
            console.log(risposta.data.message);
            setNome(risposta.data.user.nome)
            setEmail(risposta.data.user.email)
        } catch (errore) {
            console.error(errore);
        }
    };
    recuperaProfilo();

}, [token])

const modificaProfilo = async (e) => {
    e.preventDefault();

        try {
            await axios.patch("http://localhost:3000/api/profile",
                {nome,email},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            navigate("/")
        } catch(errore) {
            console.log(errore)
        }   
    }

const modificaPassword = async (e) => {
    e.preventDefault();

        try {
            await axios.patch("http://localhost:3000/api/profile/password",
                {password},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            navigate("/")
        } catch(errore) {
            console.log(errore)
        }   
    }

    return (

        <div className="login-container">
            <h1 className="titolo-form">Profilo</h1>

            <form className="form-login" onSubmit={modificaProfilo && modificaPassword}>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="nome"
                        placeholder=" "
                        id="Nome"
                        value = {nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />
                    <label htmlFor="email" className="login-label">
                        Username
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="email"
                        placeholder=" "
                        id="Email"
                        value = {email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="login-label">
                        Email
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type={mostraPassword? "text":"password"}
                        placeholder=" "
                        id="password"
                        value = {password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="login-label">
                        Nuova Password
                    </label>
                    <button 
                        className='occhio-password' 
                        onClick={() => setMostraPassword(!mostraPassword)}
                    >
                        Occhio
                    </button>
                </div>

                <button className="bottone-form" type="submit">Modifica</button>
            </form>
        </div>
    )}