const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({

    role: {
        type: String,
        default: 'Admin'
    },
    username: {
        type: String,
        required: [true, 'Please provide username']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    authentication: {
        type: String,
        required: [true, 'Please provide authentication']
    }
});

adminSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

adminSchema.methods.createJWT = function () {
    return jwt.sign({ adminId: this._id, name: this.username, role: this.role},
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME, })
}

adminSchema.methods.comparePassword = async function (entryPassword) {
    const isMatch = await bcrypt.compare(entryPassword, this.password)
    return isMatch
}

module.exports = mongoose.model('Admin', adminSchema)