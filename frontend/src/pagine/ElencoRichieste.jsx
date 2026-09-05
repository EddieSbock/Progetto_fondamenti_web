import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Contesto } from '../contesto/AuthContext';
import "./ElencoRichieste.css"


export function ElencoRichieste() {

    const { token } = useContext(Contesto)
    const [richieste, setRichieste] = useState([]);

useEffect(() => {
    const handleRichieste = async () => {
        try {
            const risposta = await axios.get("http://localhost:3000/api/richieste", 
                {headers: {Authorization: `Bearer ${token}`}}
            )
            setRichieste(risposta.data.richieste);

        } catch(errore) {
            console.error(errore)
        }
    }
    handleRichieste()
}, [token])

const handleApprova = async (richiesta) => {
    try {
        await axios.patch(`http://localhost:3000/api/richieste/${richiesta._id}`,{},
            {headers: {Authorization: `Bearer ${token}`}}
        )
        await axios.delete(`http://localhost:3000/api/richieste/${richiesta._id}`,
            {headers: {Authorization: `Bearer ${token}`}}
        )
        setRichieste((precedenti) => precedenti.filter((e) => e._id !== richiesta._id))
        console.log("Approvato con successo")
    } catch(errore) {
        console.error(errore)
    }
}

return (
    <div className="elenco-contenitore">
    {richieste.length === 0 && (<h2 className='richieste-vuoto'>Non ci sono richieste attive</h2>)}
    {richieste.map((richiesta) => (
        <div key={richiesta._id}>
            <p className="richiesta-nome richista-item">Nome: {richiesta.user.nome}</p>
            <p className="richiesta-email richista-item">Email: {richiesta.user.email}</p>
            <p className="richiesta-Motivo richista-item">Motivo: {richiesta.motivo}</p>

            <button onClick={() => handleApprova(richiesta)}>
                Approva
            </button>
        </div>
    ))}
</div>
)
}