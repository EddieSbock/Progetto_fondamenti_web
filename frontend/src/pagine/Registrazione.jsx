import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Registrazione.css'


export default function Registrazione() {

    const [nome, setNome] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errore, setErrore] = React.useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
            e.preventDefault();

        try {
            const risposta = await axios.post("http://localhost:3000/api/register", {
                nome,
                email,
                password
            });
            
            console.log(risposta.data);
            navigate("/login");
        } catch (error) {
            setErrore(error);
        }
    };

    return (
        <div className="registrazione-container">
            <h1 className="titolo-form">Registrazione</h1>

            <form className="form-registrazione" onSubmit={handleSubmit}>
                <div className="registrazione-gruppo">
                    <input 
                        className="registrazione-input"
                        type="text"
                        placeholder=" "
                        id="nome"
                        value = {nome}
                        onChange={e => setNome(e.target.value)}
                    />
                    <label htmlFor="nome" className="registrazione-label">
                        Nome Utente
                    </label>
                </div>

                <div className="registrazione-gruppo">                   
                    
                    <input
                        className="registrazione-input"
                        type="email"
                        placeholder=" "
                        id="email"
                        value = {email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label htmlFor="email" className="registrazione-label">
                        Email
                    </label>
                </div>

                <div className="registrazione-gruppo">   
                    
                    <input
                        className="registrazione-input"
                        type="password"
                        placeholder=" "
                        id="password"
                        value = {password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label htmlFor="password" className="registrazione-label">
                        Password
                    </label>
                </div>

                <button className="bottone-form" type="submit">Registrati</button>
            </form>
            {errore && <p className="messaggio-errore">{errore}</p>}
        </div>

    )
}