import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User.js";

dotenv.config(); //carica le variabili in .env

const app = express();
const port = 3000;

mongoose.connect(process.env['db-uri']) //connette mongoose al db
    .catch(error => console.error('errore di connessione al db')) 

const db = mongoose.connection;  //connessione al db con mongoose
db.once('open', () => {console.log('Connessione avvenuta con mongoose')});

app.use(cors());
app.use(express.json());


app.get("/api/hello", (req, res) => {
    res.send("Sono il backend")
});

app.post("/api/register", async (req, res) => {
    try {
        const {nome, email, password} = req.body;
        const registrato = await User.findOne({email});
        if (registrato) {
            return res.status(400).send("Utente già registrato");
        }else {
            const user = new User({nome, email, password, ruolo: 'user'});
            await user.save();
            res.status(201).send("Utente registrato con successo");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore di registrazione riprova");
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if (user && await user.verificaPassword(password)) {
            res.status(200).send("Login effettuato con successo");
        } else {
            res.status(400).send("Email o password errati");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore di login riprova");
    }
});





app.listen(port, () => {
    console.log(`Server in ascolto su ${port}`)
})
