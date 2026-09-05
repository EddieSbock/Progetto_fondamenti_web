import mongoose from "mongoose";

const SchemaRichiesta = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    motivo: {
        type: String,
        default: ""
    }
})

export const Richieste = mongoose.model('Richieste', SchemaRichiesta)