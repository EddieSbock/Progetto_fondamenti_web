import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Contesto } from "../contesto/AuthContext.jsx"
import { useEffect } from "react";
import "./ChatCommenti.css"

const socketCommenti = io("http://localhost:3000")

export function ChatCommenti({postId}) {

    const [commenti, setCommenti]=React.useState([])
    const [inserito, setInserito]=React.useState("")
    const [isAdmin, setIsAdmin] = React.useState(false)

    const { token }=React.useContext(Contesto)

useEffect(() => {
    const caricaCommenti = async () => {
        try {
            const precedenti = await axios.get(`http://localhost:3000/api/commento/${postId}`)
            setCommenti(precedenti.data.commenti || [])
        } catch(errore){
            console.error(errore)
        }
    }
    caricaCommenti()

    socketCommenti.emit("ingresso_pagina", postId)

    socketCommenti.on("ricevi_commento", (nuovoCommento) => {
        setCommenti((prev) => [...prev, nuovoCommento])
    })
    socketCommenti.on("elimina_commento", (eliminato) => {
      setCommenti((prev) => prev.filter((c) => c._id !== eliminato))
    })

    return () => {
        socketCommenti.emit("uscita_pagina", postId)
        socketCommenti.off("ricevi_commento")
        socketCommenti.off("elimina_commento")
        socketCommenti.disconnect()
    }
    }, [postId])


    const handleChange = (e) => {
        setInserito(e.target.value)
    }

    const inviaCommenti = async (e) => {
        e.preventDefault();
        try {
            const inviato= await axios.post("http://localhost:3000/api/commento", {contenuto: inserito, postId: postId}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setInserito("")
            setCommenti((prev) => [...prev, inviato.data.commentoPostato])
        } catch(errore) {
            console.error(errore)
        }
    }

    const eliminaCommenti = async (id) => {

      try {
        await axios.delete(`http://localhost:3000/api/commento/${id}`,
          {headers: {Authorization: `Bearer ${token}`}}
        )
        setCommenti((prev) => prev.filter((c) => c._id !== id))
      } catch(errore) {
        console.error(errore)
      }
    } 

   
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

    <div className="commenti-container">
      <h3 className="chat-titolo">Commenti</h3>

      <div className="commenti-lista">
        { commenti.map((commento) => (
            <div key={commento._id} className="singolo-commento">
              <div className="commento-header">
                <span className="commento-autore">{commento.autore?.nome || "Utente"}</span>
                <span className="commento-dati">
                  {new Date(commento.dataCreazione).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isAdmin && <button
                className="elimina-commenti"
                type="button"
                onClick={() => eliminaCommenti(commento._id)}
                >
                  X
                </button>}
              </div>
              <p className="commento-testo">{commento.contenuto}</p>
            </div>
          )
        )}
      </div>

      {token ? (
        <form onSubmit={inviaCommenti} className="chat-form">
          <div className="commenti-input">
            <textarea
              type="text"
              placeholder="Scrivi la tua opinione"
              value={inserito}
              rows={1}
              onChange={handleChange}
              className="input-inserito"
            />
            <button 
              type="submit" 
              className="bottone-commenti"
            >
              INVIA
            </button>
          </div>
        </form>
      ) : (
        <div className="avviso-login">
          <p>Effettua l'accesso per commentare</p>
        </div>
      )}
    </div>
  );
}