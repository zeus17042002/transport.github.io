const { now } = require('mongoose');
const mongoose = require('mongoose');

var db = mongoose.createConnection(
    "mongodb+srv://anhuynh290102:k9JOV9O4Rgw4t1up@busstationmanagement.znyfcrr.mongodb.net/BusStationM?retryWrites=true&w=majority"
    );

const { Schema, model } = mongoose;

const ParkSchema = new Schema({
    location: String,
    capacity: Number,
    availableSpace: Number,
    createdAt: {type: Date, default: now},
    status: {type: Number, default: 1},
});

const Park = db.model('Park', ParkSchema);
module.exports = Park;