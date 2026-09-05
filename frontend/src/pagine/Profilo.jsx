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
    const [nuovaPassword, setNuovaPassword] = React.useState("");
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

const modificaProfilo = async () => {

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

const modificaPassword = async () => {
        try {
            await axios.patch("http://localhost:3000/api/profile/password",
                {password, nuovaPassword},
                {headers: {Authorization: `Bearer ${token}`}}
            );
        } catch(errore) {
            console.log(errore)
        }   
    }

const inviaForm = async(e) => {
    e.preventDefault();

    if (nuovaPassword !== "") {
        await modificaPassword()
    }
    await modificaProfilo();

}
    return (

        <div className="login-container">
            <h1 className="titolo-form">Profilo</h1>

            <form className="form-login" onSubmit={inviaForm}>

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
                    />
                    <label htmlFor="password" className="login-label">
                        Password
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type={mostraPassword? "text":"password"}
                        placeholder=" "
                        id="password"
                        value = {nuovaPassword}
                        onChange={e => setNuovaPassword(e.target.value)}
                    />
                    <label htmlFor="password" className="login-label">
                        Nuova Password
                    </label>
                </div>
                <button 
                        type= "button"
                        className='occhio-password' 
                        onClick={() => setMostraPassword(!mostraPassword)}
                    >
                        {mostraPassword === true? "Nascondi" : "Mostra"}
                    </button>
                <button className="bottone-form" type="submit">Modifica</button>
            </form>
        </div>
    )}