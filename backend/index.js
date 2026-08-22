import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Sono il backend)")
});
app.listen(port, () => {
    console.log(`Server in ascolto su ${port}`)
})