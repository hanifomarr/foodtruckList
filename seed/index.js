const mongoose = require("mongoose");
const Foodtruck = require("../models/foodtruck");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");
mongoose.connect("mongodb://127.0.0.1:27017/foodtruck");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Foodtruck.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 35) + 10;
    const newFoodtruck = new Foodtruck({
      author: "6447b97412e207680f892526",
      name: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random].city}, ${cities[random].state}`,
      geometry: { type: "Point", coordinates: [101.645559, 2.933891] },
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, eligendi!",
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/dq5gkn64d/image/upload/v1681462405/foodtrucks/qpbtjvdqmgfmrleio9to.jpg",
          filename: "foodtrucks/qpbtjvdqmgfmrleio9to",
        },
        {
          url: "https://res.cloudinary.com/dq5gkn64d/image/upload/v1681462405/foodtrucks/fzgokk94plkniqxk8jok.jpg",
          filename: "foodtrucks/fzgokk94plkniqxk8jok",
        },
      ],
    });
    await newFoodtruck.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
