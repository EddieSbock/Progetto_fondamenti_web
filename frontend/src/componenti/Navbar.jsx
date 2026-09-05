import {Link, useNavigate} from "react-router-dom";
import { Contesto } from "../contesto/AuthContext.jsx"
import React from "react";
import axios from "axios";
import './Navbar.css'

export default function Navbar() {

    const { token, elimina_contesto }= React.useContext(Contesto)
    const navigate = useNavigate()

    const [isAdmin, setIsAdmin] = React.useState(false);

    const handleLogout=() => {
        elimina_contesto();
        navigate("/login")
    };

React.useEffect(() => {
    const handleAdmin = async () => {
        // senza questo if parte anche con token null
        if (!token) {
            setIsAdmin(false);
            return;
        }

        try {
            const utente = await axios.get("http://localhost:3000/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (utente && utente.data.user.ruolo === "admin") {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (errore) {
        console.error(errore);
        }   
    }
    handleAdmin();
}, [token]);

    return (
        <nav className="navbar">
            <div className="navbar-gruppo">
            <Link className="navbar-link" to="/">Home</Link>
            {isAdmin && (
                <Link className="navbar-link" to="/modifica-post">Crea Post</Link>
            )}
            </div>
            <div>
                <Link className="navbar-titolo">REFILM</Link>
            </div>
            <div>
                {token ? (
                    <>
                        <Link className="navbar-link" to="/profile">Profilo</Link>
                        <button className="bottone-navbar" onClick={handleLogout} >Logout</button>
                    </>

                ):(
                    <>
                        <Link className="navbar-link" to="/login">Login</Link>
                        <Link className="navbar-link" to="/registrazione">Registrati</Link>
                    </>
                )}
            </div>
        </nav>
    )}