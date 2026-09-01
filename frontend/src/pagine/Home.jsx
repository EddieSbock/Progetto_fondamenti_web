import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Contesto } from "../contesto/AuthContext";
import "./Home.css";
import terminator from "../assets/terminator.png"
import "../componenti/PostCard"
import { PostCard } from "../componenti/PostCard";

export default function Home() {

    const [post, setPost]= React.useState([])
    const [errore, setErrore] = React.useState(null)
    const [ricerca, setRicerca] = React.useState("")
    const [categoria, setCategoria] = React.useState("")
    const [topPost, setTopPost] = React.useState([])

    const categorie_home = ['azione', 'commedia', 'drammatico', 
        'fantascienza', 'horror', 'romantico', 'thriller', 'animazione', 
        'documentario', 'avventura', 'fantasy', 'storico','grottesco']


React.useEffect(() => {
    const handlePost = async () => {
        try {

            const HomePost = await axios.get("http://localhost:3000/api/post",{
                    params: {
                        categoria: categoria || undefined,
                        ricerca: ricerca || undefined,
                    }
                })

            console.log(HomePost.data.message)
            setPost(HomePost.data.postati)
        } catch (errore) {
            console.log(errore)
            setErrore("Problema col recuperare i post")
        }
    };
    handlePost();
}, [ricerca, categoria]);

React.useEffect(() => {
    const handleTopPost = async () => {
        try {
            const TopPost = await axios.get("http://localhost:3000/api/post/top")
            setTopPost(TopPost.data.miglioriPost)
        } catch (errore) {
            console.error(errore)
            setErrore("Problema col recuperare i migliori post")
        }
    };
    handleTopPost();
}, []);

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
                    <span className="utility-numPost">{post.length} Post</span>
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
                        <section className="sezione-categorie">
                            
                            {categorie_home.map((scelta) => (
                            <button
                            type="button"
                            key={scelta}
                            className={categoria === scelta ? "categoria selezionata" : "categoria"}
                            onClick={() => setCategoria(scelta === categoria ? "" : scelta)}
                            >
                            {scelta}
                            </button>
                            ))}
                        </section>
                    </div>

                    <div className="sidebar-sezione">
                        <h3>Top Recensioni</h3>
                        <section className="sezione-topPost">
                            {topPost.map((post) => (
                                <Link to={`/post/${post._id}`} key={post._id} className="topPost-link">
                                    <div className="topPost-card">
                                        <h4 className="topPost-titolo">{post.titolo}</h4>
                                        <span className="topPost-voto">Voto: {post.voto}</span>
                                    </div>
                                </Link>
                            ))}
                        </section>
                    </div>
                    <div className="sidebar-sezione-img">
                        <img className="sidebar-img" src={terminator}/>
                    </div>
                </aside>
            </div>
            
        </div>
    )
}