import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Contesto } from "../contesto/AuthContext";
import axios from "axios";
import "./VisualizzaPost.css";
import { ChatCommenti } from "../componenti/ChatCommenti"

export default function VisualizzaPost() {

    const navigate = useNavigate();

    const { id } = useParams();
    const { token } = React.useContext(Contesto);

    const [post, setPost] = React.useState(null);
    const [isAdmin, setIsAdmin] = React.useState(false);

React.useEffect(() => {
    const handlePost = async () => {
        try {
            const risposta = await axios.get(`http://localhost:3000/api/post/${id}`);
            setPost(risposta.data.post);
        } catch (errore) {
            console.error(errore);
        }
    }
    handlePost()
}, [id]);
    
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

    const handleDelete = async () => {

        try {
            await axios.delete(`http://localhost:3000/api/post/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Post eliminato con successo");
            navigate("/");
        } catch (errore) {
            console.error(errore);
        }
    }

    return (
        <div className="visualizza-post">
            <div className="post-container">
            <div className="post-header">
                {post && (
                    <div className="post-cover">
                        <img className="post-cover-img" src={post.immagine} alt={post.titolo} />
                    </div>
                )}
                {post && (
                    <aside className="post-info">
                        <h1 className="post-titolo">{post.titolo}</h1>
                        <p className="post-registi">Registi: {post.registi}</p>
                        <p className="post-cast">Cast: {post.cast}</p>
                        <p className="post-categorie">Categorie:
                            {post.categorie.map((categoria) => (
                                <span key={categoria} className="post-categorie-item">
                                    {categoria}
                                </span>
                            ))}
                        </p>
                        <p className="post-voto">Voto: {post.voto}</p>
                    </aside>
                )}
            </div>
            <div className="post-principale">
            
            {post && (
                <div>
                    <section className="post-dettagli">
                        <h2>Dettagli del post</h2>
                        <p className="post-autore">Scritto da: {post.autore.nome}</p>
                    </section>
                    <p className="post-corpo">{post.corpo}</p>
                </div>
                )}
                <section className="post-modifica">
                    {isAdmin && (
                    <div>
                        <Link to={`/modifica-post/${id}`} className="modifica-link">
                            Modifica Post
                        </Link>
                        <button className="elimina-link" onClick={handleDelete}>
                            Elimina Post
                        </button>
                    </div>
                )}
                </section>
            
            </div>
            </div>
            <aside className="chat-container">
                <ChatCommenti postId={id} />
            </aside>
        </div>
    )
}