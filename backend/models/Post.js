import mongoose from "mongoose"

const SchemaPost = new mongoose.Schema({
    titolo: {
        type: String,
        required: true
    },
    corpo: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000,
    },

    //implementare poi degli array per registri e cast
    registi: {
        type : String,
        default: ""
    },
    cast: {
        type : String,
        default: ""    
    },
    riassunto: {
        type : String,
        default: ""
    },
    autore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dataCreazione: {
        type: Date,
        default: Date.now
    },
    voto: {
        type: Number,
        default: 0,
    },
    categorie: [{
        type: String,
        enum: ['azione', 'commedia', 'drammatico', 'fantascienza', 'horror', 'romantico', 'thriller', 'animazione', 'documentario', 'avventura', 'fantasy', 'storico','grottesco'],
        required: true
    }]
})

export const Post = mongoose.model('Post', SchemaPost)