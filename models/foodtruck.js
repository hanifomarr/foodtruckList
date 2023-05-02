const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const foodtruckSchema = new Schema({
  name: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: [imageSchema],
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
