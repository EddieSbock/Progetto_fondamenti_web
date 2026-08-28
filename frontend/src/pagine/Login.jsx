import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

            console.log(risposta.data);
            navigate("/");
        } catch (errore) {
            console.error(errore);
            setErrore("Email o password errati");
        }
    };

    return (

        <div>
            <h1>Login</h1>

            <form className="formLogin" onSubmit={handleSubmit}>

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
                <button type="submit">Accedi</button>
            </form>
            {errore && <p>{errore}</p>}
        </div>
    )}