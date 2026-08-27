import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Registrazione() {

    const [nome, setNome] = React.useState(" ");
    const [email, setEmail] = React.useState(" ");
    const [password, setPassword] = React.useState(" ");
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
        <div>
            <h1>Registrazione</h1>

            <form className="formRegistrazione" onSubmit={handleSubmit}>
                <input 
                type="text"
                placeholder="Nome utente"
                value = {nome}
                onChange={e => setNome(e.target.value)}
                />
                <input
                type="email"
                placeholder="Email"
                value = {email}
                onChange={e => setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value = {password}
                onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Registrati</button>
            </form>
            {errore && <p>{errore}</p>}
        </div>

    )
}