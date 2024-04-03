const mongoose = require('mongoose');


var db = mongoose.createConnection(
    "mongodb+srv://anhuynh290102:k9JOV9O4Rgw4t1up@busstationmanagement.znyfcrr.mongodb.net/BusStationM?retryWrites=true&w=majority"
    );

const { Schema, model } = mongoose;

const BusSchema = new Schema({
    liscent: String,
    _model: String,
    capacity: Number,
    desc: {type: String, default: 'This is a bus'},
    img: {type: String, default: 'img.png'},
    amount: Number,
    createdAt: {type: Date, default: Date.now},
    status: {type: Number, default: 1},
});

const Bus = db.model('Bus', BusSchema);
module.exports = Bus;
