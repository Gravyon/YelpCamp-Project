import mongoose from "mongoose";
import cities from "./cities.js";
import { places, descriptors, images } from "./seedHelpers.js";
import Campground from "../models/campground.model.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // Clear existing data
  await Campground.deleteMany({});

  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const cityData = cities[random1000];
    const shuffledImages = images.sort(() => 0.5 - Math.random());
    const selectedImages = shuffledImages.slice(0, 2);
    const camp = new Campground({
      author: "695ea1d500c67383aed79947", // Ensure this User ID exists in your DB!
      location: `${cityData.city}, ${cityData.state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cityData.longitude, // Longitude comes FIRST in GeoJSON
          cityData.latitude,
        ],
      },
      images: selectedImages,
      description: `Nestled in the heart of ${cityData.state}, this campground offers a pristine escape into nature. Whether you enjoy hiking through dense forests or relaxing by the campfire under a starlit sky, this spot provides the perfect getaway. Amenities include fresh water access and well-maintained trails.`,
      price,
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
