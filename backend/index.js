import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.send("Sono il backend")
});
app.listen(port, () => {
    console.log(`Server in ascolto su ${port}`)
})

//connessione al db con mongoose
dotenv.config(); //carica le variabili in .env
mongoose.connect(process.env['db-uri']) //connette mongoose al db
.catch(error => console.error('errore di connessione al db')) 

const db = mongoose.connection;

db.once('open', () => {console.log('Connessione avvenuta con mongoose')});