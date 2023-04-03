const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodtruckSchema = new Schema({
  name: String,
  location: String,
  img: String,
  desc: String,
  price: Number,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = mongoose.model("Foodtruck", foodtruckSchema);
