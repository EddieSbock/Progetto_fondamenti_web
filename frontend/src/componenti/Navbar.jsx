import {Link, useNavigate} from "react-router-dom";
import { Contesto } from "../contesto/AuthContext.jsx"
import { useContext } from "react";
import './Navbar.css'

export default function Navbar() {

    const { token, elimina_contesto }= useContext(Contesto)
    const navigate = useNavigate()

    const handleLogout=() => {
        elimina_contesto();
        navigate("/login")
    };


    return (
        <nav className="navbar">

            <Link className="navbar-link" to="/">Home</Link>
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