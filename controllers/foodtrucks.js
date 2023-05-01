const Foodtruck = require("../models/foodtruck");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocodingService = mbxGeocoding({ accessToken: mbxToken });

module.exports.index = async (req, res) => {
  const foodtrucks = await Foodtruck.find({});
  res.render("foodtrucks/index", { foodtrucks });
};

module.exports.createFormFoodtruck = (req, res) => {
  res.render("foodtrucks/new");
};

module.exports.createFoodtruck = async (req, res, next) => {
  const geoData = await geocodingService
    .forwardGeocode({
      query: req.body.foodtruck.location,
      limit: 1,
    })
    .send();
  res.send(geoData.body.features[0].geometry.coordinates);

  // const newFoodtruck = new Foodtruck(req.body.foodtruck);
  // newFoodtruck.images = req.files.map((f) => ({
  //   url: f.path,
  //   filename: f.filename,
  // }));
  // newFoodtruck.author = req.user._id;
  // await newFoodtruck.save();
  // console.log(newFoodtruck);
  // req.flash("success", "Successfully added");
  // res.redirect(`/foodtruck/${newFoodtruck._id}`);
};

module.exports.getFoodtruck = async (req, res) => {
  const { id } = req.params;
  const foodtruck = await Foodtruck.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!foodtruck) {
    req.flash("error", "Foodtruck not found");
    return res.redirect("/foodtruck");
  }
  res.render("foodtrucks/show", { foodtruck });
};

module.exports.showEditFoodtruck = async (req, res) => {
  const { id } = req.params;
  const foodtruck = await Foodtruck.findById(id);
  if (!foodtruck) {
    req.flash("error", "Foodtruck Not found");
    return res.redirect(`/foodtruck`);
  }
  res.render("foodtrucks/edit", { foodtruck });
};

module.exports.editFoodtruck = async (req, res) => {
  const { id } = req.params;
  const updateFoodtruck = await Foodtruck.findByIdAndUpdate(id, {
    ...req.body.foodtruck,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  updateFoodtruck.images.push(...imgs);
  await updateFoodtruck.save();
  if (req.body.deletedImages) {
    for (let filename of req.body.deletedImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updateFoodtruck.updateOne({
      $pull: { images: { filename: { $in: req.body.deletedImages } } },
    });
  }
  req.flash("success", "Successfully updated");
  res.redirect(`/foodtruck/${id}`);
};

module.exports.deleteFoodtrucks = async (req, res) => {
  const { id } = req.params;
  await Foodtruck.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted");
  res.redirect("/foodtruck");
};
