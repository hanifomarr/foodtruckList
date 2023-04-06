const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const foodtruckSchema = new Schema({
  name: String,
  location: String,
  img: String,
  desc: String,
  price: Number,
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

foodtruckSchema.post("findOneAndDelete", async function (data) {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

module.exports = mongoose.model("Foodtruck", foodtruckSchema);
