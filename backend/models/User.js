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

SchemaUser.pre('save', async function() { //non uso next perche restuisco una promise
    this.password = await bcrypt.hash(this.password, 10)
    .then(hash => {
        this.password = hash;
        return this.password;
    })
});

SchemaUser.methods.verificaPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model('User', SchemaUser)