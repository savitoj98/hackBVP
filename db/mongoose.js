var mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://meghansh:hack-bvp123@ds215563.mlab.com:15563/hack-users')

module.exports = {
    mongoose
}