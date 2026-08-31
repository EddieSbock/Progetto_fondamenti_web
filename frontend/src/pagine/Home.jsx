import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Contesto } from "../contesto/AuthContext";
import "./Home.css";
import "../componenti/PostCard"
import { PostCard } from "../componenti/PostCard";

export default function Home() {

    const [post, setPost]= React.useState([])
    const [errore, setErrore] = React.useState(null)
    const [ricerca, setRicerca] = React.useState("")

React.useEffect(() => {
    const handlePost = async () => {
        try {
            const HomePost = await axios.get("http://localhost:3000/api/post?limit=10")

            console.log(HomePost.data.message)
            setPost(HomePost.data.postati)
        } catch (errore) {
            console.log(errore)
            setErrore("Problema col recuperare i post")
        }
    };
    handlePost();
}, [])



    return (
        <div className="home">
            <header className="barra-home">
                <div className="barra-ricerca">
                    <input
                        className="ricerca-input" 
                        type="text"
                        placeholder="Cerca..."
                        value={ricerca}
                        onChange={(e)=> setRicerca(e.target.value)}
                    />
                </div>
                <div className="barra-utility">
                    <span>{post.length} Post</span>
                </div>
            </header>
            <div className="corpo-home">
                <div className="corpo-post">
                {post.map((post) => (
                    <PostCard key={post._id} post={post}/>)
                )}
                </div>
                <aside className="corpo-sidebar">
                    <div className="sidebar-sezione">
                        <h3>Categorie</h3>
                    </div>

                    <div className="sidebar-sezione">
                        <h3>Top Recensioni</h3>
                    </div>
                </aside>
            </div>
            
        </div>
    )
}