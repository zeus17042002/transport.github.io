const { now } = require('mongoose');
const mongoose = require('mongoose');

var db = mongoose.createConnection(
    "mongodb+srv://anhuynh290102:k9JOV9O4Rgw4t1up@busstationmanagement.znyfcrr.mongodb.net/BusStationM?retryWrites=true&w=majority"
    );

const { Schema, model } = mongoose;

const RouteSchema = new Schema({
    routeName: String,
    start: String,
    end: String,
    distance : Number,
    duration: Number,
    fare: Number,
    createdAt: {type: Date, default: now},
    status: {type: Number, default: 1}
});

const Route = db.model('Route', RouteSchema);
module.exports = Route;