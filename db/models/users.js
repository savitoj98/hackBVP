const mongoose = require('mongoose')

var users = mongoose.model('Users',{
    // text:{
    //     type: String,
    //     required: true,
    //     minlength: 1,
    //     trim: true,
    //     unique: true
    // },
    // completed: {
    //     type: Boolean,
    //     default: false
    // },
    // completedAt : {
    //     type: Number,
    //     default: null
    // }
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    email: {
        type: String,
        minlength: 1,
        required: true,
        unique: true
    },
    id: {
        type: String,
        minlength: 1,
        required: true,
        unique: true
    }
});

module.exports.users = users