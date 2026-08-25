import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

export const verificaJWT = async (req, res, next) => {

    // Estrae il token dall'header lo divide in un array e prende il secondo elemento

    const token = req.headers.authorization?.split(' ')[1]; 
    try {
    if (!token) {
        return res.status(401).json({ message: "Non sei autorizzato" });
    }else{
        const decoded = jwt.verify(token, process.env["JWT_SECRET"]);
    if(decoded) {
        const user = await User.findById(decoded.data);
            if (user){
                req.user = user; // Aggiunge l'utente alla richiesta
                next();
            }else{
                res.status(403).json({ error: true, message: "Utente non trovato" });
                }
            }
        }  
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Errore di login riprova" });
    }
};



export const verificaRuolo = (ruoloValido) => {
    return (req, res, next) => {
        if (req.user && req.user.ruolo === ruoloValido) {
            next();
        } else {
            res.status(403).json({ error: true, message: "Accesso negato" });
        }
    }
};