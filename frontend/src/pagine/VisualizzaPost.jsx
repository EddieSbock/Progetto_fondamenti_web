import React from "react";
import { Link, useParams } from "react-router-dom";
import { Contesto } from "../contesto/AuthContext";
import axios from "axios";
import "./VisualizzaPost.css";

export default function VisualizzaPost() {

    const { id } = useParams();
    const { utente, token } = React.useContext(Contesto);

    const [post, setPost] = React.useState(null);

React.useEffect(() => {
    const handlePost = async () => {
        try {
            const risposta = await axios.get(`http://localhost:3000/api/post/${id}`);
            setPost(risposta.data.post);
        } catch (errore) {
            console.error(errore);
        }
    };
    handlePost();
}, [id]);
    
const Admin = utente && utente.ruolo === "admin";

    return (
        <div className="visualizza-post">
            <h1>Visualizza Post</h1>
            <h2>Dettagli del post</h2>
            {post && (
                <div>
                    <h3>{post.titolo}</h3>
                    <p>{post.corpo}</p>
                </div>
            )}
        </div>
    )
}