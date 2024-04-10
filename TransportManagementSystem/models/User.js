const { now } = require('mongoose');
const mongoose = require('mongoose');


var db = mongoose.createConnection(
    "mongodb+srv://Huynh:la3Htbdpp8vrEtBK@appbanhang.zsp1fr6.mongodb.net/BusStationM?retryWrites=true&w=majority"
    );

const { Schema, model } = mongoose;

// 0: admin, 1: employees
const UserSchema = new Schema({
    name: String,
    username: String,
    pass: String,
    gender: String,
    role: {type: Number, default: 1},
    birth: Date,
    address: String,
    email: String,
    phone: String,
    createdAt: {type: Date, default: now},
    status: {type: Number, default: 1},
    avatarPath: String,
});




const User = db.model('User', UserSchema);
module.exports = User;
