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
        required: true
    },
    categorie: {
        type: [String],
        required: true
    }
})

export const Post = mongoose.model('Post', SchemaPost)