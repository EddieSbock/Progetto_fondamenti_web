import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SchemaUser = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    ruolo: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})


export const User = mongoose.model('User', SchemaUser)