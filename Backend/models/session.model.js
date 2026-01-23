const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    
})
const SessionModel = mongoose.model('Session', sessionSchema)
module.exports = SessionModel