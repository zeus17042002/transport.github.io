const { now } = require('mongoose');
const mongoose = require('mongoose');
const Bus = require("./Bus")
const Route = require("./Route")
var db = mongoose.createConnection(
    "mongodb+srv://anhuynh290102:k9JOV9O4Rgw4t1up@busstationmanagement.znyfcrr.mongodb.net/BusStationM?retryWrites=true&w=majority"
    );

const { Schema, model } = mongoose;

const ScheduleSchema = new Schema({
    busId: {type: Schema.Types.ObjectId, ref: 'Bus'},
    routeId: {type: Schema.Types.ObjectId, ref: 'Route'},
    departureTime: Date,
    arriveTime: Date,
    createdAt: {type: Date, default: now},
    status: {type: Number, default: 1},
});

const Schedule = db.model('Schedule', ScheduleSchema);
module.exports = Schedule;