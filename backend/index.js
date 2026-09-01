import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { verificaJWT, verificaRuolo } from "./middleware/auth.js";
import { User } from "./models/User.js";
import { Post } from "./models/Post.js";
import { Comment } from "./models/Comment.js";


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

            const token = jwt.sign(
                {data: user._id, ruolo: user.ruolo},
                process.env['JWT_SECRET'],
                { expiresIn: '2h' });

        res.status(200).json({ message: "Login effettuato", token });
        } else {
            console.error("Email o password errati");
            res.status(400).json({ message: "Email o password errati" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Errore di login riprova");
    }
});

app.get("/api/profile", verificaJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({ message: "Profilo utente", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore nel recupero del profilo" });
    }
});
app.patch("/api/profile", verificaJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        const { nome, email } = req.body;

        if (nome) user.nome = nome;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ message: "Profilo aggiornato", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.patch("/api/profile/password", verificaJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { password , nuovaPassword } = req.body;

        if (await user.verificaPassword(password)) {
            user.password = nuovaPassword;
            await user.save();
            res.status(200).json({ message: "Password aggiornata" });
        } else {
            res.status(400).json({ message: "Password errata" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});

app.post("/api/post", verificaJWT, verificaRuolo('admin'), async (req, res) => {
    try {
        const { titolo, corpo, categorie, registi, cast, riassunto, voto } = req.body;
        const autore = req.user._id;

        const post = new Post({ 
            titolo, 
            corpo,
            registi,
            cast,
            riassunto,
            categorie, 
            autore, 
            voto, 
            dataCreazione: new Date() 
        });
        await post.save();
        res.status(201).json({ message: "Post creato", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.get("/api/post", async (req, res) => {
    try {

        const {categoria, ricerca} = req.query;
        const query = {};

        if (categoria) {
            query.categorie = categoria;
        }

        if (ricerca) {
            query.$or = [
                { titolo: { $regex: ricerca, $options: 'i' } },
                { corpo: { $regex: ricerca, $options: 'i' } }
            ];
        }
        const postati = await Post.find(query).populate("autore", "nome");
        res.status(200).json({ message: "Post recuperati", postati });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.patch("/api/post/:id", verificaJWT, verificaRuolo('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { titolo, corpo, categorie, voto } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post inesistente" });
        }

        if (titolo) post.titolo = titolo;
        if (corpo) post.corpo = corpo;
        if (categorie) post.categorie = categorie;
        if (voto !== undefined) post.voto = voto;

        await post.save();
        res.status(200).json({ message: "Post aggiornato", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.delete("/api/post/:id", verificaJWT, verificaRuolo('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post eliminato" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});

app.get("/api/commento/:postId", verificaJWT, async (req, res) => {
    try {

        const commenti = await Comment.find({post: req.params.postId}).populate("autore", "nome");
        res.status(200).json({ message: "Commenti recuperati", commenti });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.post("/api/commento", verificaJWT, async (req, res) => {
    try {
        const { contenuto, postId } = req.body;
        const autore = req.user._id;

        const commento = new Comment({ 
            contenuto, 
            post: postId, 
            autore, 
            dataCreazione: new Date() 
        });
        await commento.save();
        res.status(201).json({ message: "Commento creato", commento });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.delete("/api/commento/:id", verificaJWT, verificaRuolo('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: "Commento eliminato" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});

app.listen(port, () => {
    console.log(`Server in ascolto su ${port}`)
})
