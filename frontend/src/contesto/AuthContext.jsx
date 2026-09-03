import { useState, createContext, useEffect } from "react";

export const Contesto = createContext()

export const Esporta_contesto = ({children}) => { 
    
    const [token, setToken]=useState(null)

    useEffect(() => {
        const Recuperato = localStorage.getItem("token")
        if(Recuperato){setToken(Recuperato)}
    }, [])

    const crea_contesto = (login_token) => {
        localStorage.setItem("token", login_token)
        setToken(login_token)
    }

    const elimina_contesto = () => {
        localStorage.removeItem("token")
        setToken(null)
    }

    return (
        <Contesto.Provider value={{token, crea_contesto, elimina_contesto}}>
            {children}
        </Contesto.Provider>
    )
}