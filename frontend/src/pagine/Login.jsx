import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//import { crea_contesto } from '../contesto/AuthContext.jsx'
import './Login.css';

export default function Login() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errore, setErrore] = React.useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const risposta = await axios.post("http://localhost:3000/api/login", {
                email,
                password
            });

            console.log(risposta.data.message);
            //crea_contesto(risposta.data.token);

            navigate("/");
        } catch (errore) {
            console.error(errore);
            setErrore("Email o password errati");
        }
    };

    return (

        <div className="login-container">
            <h1 className="titolo-form">Login</h1>

            <form className="form-login" onSubmit={handleSubmit}>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="email"
                        placeholder=" "
                        id="email"
                        value = {email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email" className="login-label">
                        Email
                    </label>
                </div>

                <div className="login-gruppo">
                    <input
                        className="login-input"
                        type="password"
                        placeholder=" "
                        id="password"
                        value = {password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password" className="login-label">
                        Password
                    </label>
                </div>

                <button className="bottone-form" type="submit">Accedi</button>
            </form>
            {errore && <p className="messaggio-errore">{errore}</p>}
        </div>
    )}