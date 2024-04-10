const { now } = require('mongoose');
const mongoose = require('mongoose');

var db = mongoose.createConnection(
    "mongodb+srv://Huynh:la3Htbdpp8vrEtBK@appbanhang.zsp1fr6.mongodb.net/BusStationM?retryWrites=true&w=majority"
    );

const { Schema, model } = mongoose;

const RouteSchema = new Schema({
    busId: {type: Schema.Types.ObjectId, ref: 'Bus'},
    routeName: String,
    start: String,
    end: String,
    distance : Number,
    fare: Number,
    departureDayTime: {type: Date, default: now},
    fuelInit: {type: Number, default: 0},
    fuelCost: {type: Number, default: 0},
    createdAt: {type: Date, default: now},
    status: {type: Number, default: 1}
});

const Route = db.model('Route', RouteSchema);
module.exports = Route;