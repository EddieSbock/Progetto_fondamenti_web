import React from "react";
import "./PostCard.css";
import { Link } from "react-router-dom";


export function PostCard({ post }) {
    return (
        <Link to={`/post/${post._id}`} className="post-card">
            <div className="post-card-cover">
                <img src={post.cover} alt={post.title}></img>
            </div>
            <div className="post-card-info">
                <span className="post-card-titolo"> {post.titolo} </span>
                <p className="post-card-dati">{post.dataCreazione} - {post.autore.nome}</p>
                <p className="post-card-descrizione">
                    {post.descrizione || "Clicca per visualizzare i dettagli dell'articolo."}
                </p>
            </div>
        </Link>
    );
}