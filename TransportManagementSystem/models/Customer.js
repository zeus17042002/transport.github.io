
const { now } = require("mongoose");
const mongoose = require("mongoose");
var db = mongoose.createConnection(
  "mongodb+srv://Huynh:la3Htbdpp8vrEtBK@appbanhang.zsp1fr6.mongodb.net/BusStationM?retryWrites=true&w=majority"
);
const { Schema, model } = mongoose;

const CustomerSchema = new Schema({
  phone: String,
  name: String,
  address: String,
  createdAt: { type: Date, default: now },
  status: { type: Number, default: 1 },
});


const Customer = db.model("Customer", CustomerSchema);
module.exports = Customer;
