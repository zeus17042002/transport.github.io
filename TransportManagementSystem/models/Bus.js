const mongoose = require('mongoose');


var db = mongoose.createConnection(
    "mongodb+srv://Huynh:la3Htbdpp8vrEtBK@appbanhang.zsp1fr6.mongodb.net/BusStationM?retryWrites=true&w=majority"
    );
//mongodb+srv://Huynh:la3Htbdpp8vrEtBK@appbanhang.zsp1fr6.mongodb.net/
const { Schema, model } = mongoose;

const BusSchema = new Schema({
    licensePlate: String,
    _model: String,
    capacity: Number,
    desc: {type: String, default: 'This is a bus'},
    img: {type: String, default: 'img.png'},
    createdAt: {type: Date, default: Date.now},
    status: {type: Number, default: 1},
});

const Bus = db.model('Bus', BusSchema);
module.exports = Bus;
