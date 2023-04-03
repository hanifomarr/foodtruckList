const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodtruckSchema = new Schema({
  name: String,
  location: String,
  img: String,
  desc: String,
  price: Number,
});

module.exports = mongoose.model("Foodtruck", foodtruckSchema);
