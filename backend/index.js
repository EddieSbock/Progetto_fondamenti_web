import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import http from "http";
import { initSocket, socketMiddlewere } from "./middleware/socket.js";
import { verificaJWT, verificaRuolo } from "./middleware/auth.js";
import { User } from "./models/User.js";
import { Post } from "./models/Post.js";
import { Comment } from "./models/Comment.js";
import { Richieste } from "./models/Richieste.js"


dotenv.config(); //carica le variabili in .env

const app = express();
const port = 3000;

mongoose.connect(process.env['db-uri']) //connette mongoose al db
    .catch(error => console.error('errore di connessione al db')) 

const db = mongoose.connection;  //connessione al db con mongoose
db.once('open', () => {console.log('Connessione avvenuta con mongoose')});

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
initSocket(server);
app.use(socketMiddlewere);

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

        const { nome, email } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id,
            { nome, email },
            { new: true}
        ).select("-password");
        
        res.status(200).json({ message: "Profilo aggiornato", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.get("/api/profile/password", verificaJWT, async (req,res) => {
    try {
        const password = await User.findById(req.user._id).select("password");
        res.status(200).json({password})
    } catch(errore) {
        console.error(errore);
        res.status(500).json({ message: "Errore riprova" });
    }
})
app.patch("/api/profile/password", verificaJWT, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { password, nuovaPassword } = req.body;

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
        const { titolo, corpo, categorie, registi, cast, riassunto, voto, cover } = req.body;
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
            cover, 
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
app.get("/api/post/top", async (req, res) => {
    try {
        const miglioriPost = await Post.find().sort({ voto: -1}).limit(5).select("titolo voto id");
        
        res.status(200).json({ message: "Migliori post recuperati", miglioriPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
})
app.get("/api/post/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("autore", "nome");

        res.status(200).json({ message: "Post recuperato", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
});
app.patch("/api/post/:id", verificaJWT, verificaRuolo('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { titolo, corpo, categorie, registi, cast, riassunto, voto, cover } = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post inesistente" });
        }

        if (titolo) post.titolo = titolo;
        if (corpo) post.corpo = corpo;
        if (categorie) post.categorie = categorie;
        if (voto !== undefined) post.voto = voto;
        if (registi) post.registi = registi;
        if (cast) post.cast = cast;
        if (riassunto) post.riassunto = riassunto;
        if (cover) post.cover = cover;

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

app.get("/api/commento/:postId", async (req, res) => {
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

        const commentoPostato = await Comment.findById(commento._id).populate("autore", "nome")
        req.SocketCommenti.to(postId).emit("ricevi_commento", commentoPostato)
        res.status(201).json({ message: "Commento creato", commentoPostato });
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

app.get("/api/richieste", verificaJWT, verificaRuolo('admin'),async (req, res) => {
    try {
        const richieste = await Richieste.find().populate("user", "nome email");
        res.status(200).json({ message: "Richieste recuperati", richieste });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Errore riprova" });
    }
})
app.post("/api/richieste", verificaJWT, async (req, res) => {
   
    try {
        const { motivo } = req.body;
        const user= req.user._id;
        const richiesta = new Richieste({
            user,
            motivo
        })

        await richiesta.save();
        res.status(201).json({ message: "Richiesta inviata" });
        } catch (error) {
        res.status(500).json({ message: "Errore" });
    }
})
app.patch("/api/richieste/:id", verificaJWT, verificaRuolo("admin"), async (req,res) => {
    try {
        const richiesta = await Richieste.findById(req.params.id)

        await User.findByIdAndUpdate(richiesta.user,
            {ruolo: "admin"},{new: true})
        res.status(201).json({ message: "Richiesta Approvata" });
    } catch(error) {
        res.status(500).json({ message: "Errore" });
    }
})
app.delete("/api/richieste/:id", verificaJWT, verificaRuolo("admin"), async (req,res) => {
    try {
        const { id } = req.params
        await Richieste.findByIdAndDelete(id);
        res.status(201).json({ message: "Richiesta Eliminata" });
    } catch(error) {
        res.status(500).json({ message: "Errore" });
    }
})



server.listen(port, () => {
    console.log(`Server in ascolto su ${port}`)
})
