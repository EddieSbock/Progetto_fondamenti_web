import mongoose from 'mongoose';

const SchemaComment = new mongoose.Schema({
    contenuto: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 400
    },
    autore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    dataCreazione: {
        type: Date,
        default: Date.now
    }
})

export const Comment = mongoose.model('Comment', SchemaComment);