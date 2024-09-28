const { type } = require('@testing-library/user-event/dist/type');
const mongoose = require('mongoose');
const {Schema} = mongoose

const NotesSchema = new Schema({
    user:{
        //foren key User only see his own notes
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    tital:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true,
    },
    tag:{
        type: String,
        default: 'Genral'
    },
    date:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('notes',NotesSchema)