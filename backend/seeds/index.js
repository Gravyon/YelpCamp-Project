import mongoose from "mongoose";
import cities from "./cities.js";
import { places, descriptors, images } from "./seedHelpers.js";
import Campground from "../models/campground.model.ts";
import User from "../models/user.model.ts";
import dotenv from "dotenv";
import { usernames } from "./users.js";
import bcrypt from "bcrypt";

dotenv.config();

const DATABASE = process.env.MONGO_DATABASE;
mongoose.connect(DATABASE);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // Clear existing data
  await Campground.deleteMany({});
  await User.deleteMany({});

  const createdUserIds = [];
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash("password123456789@!", salt);

  for (const username of usernames) {
    const user = new User({
      email: `${username.toLowerCase()}@test.com`,
      username: username,
      password: hashedPassword, // Manually hash it!
    });
    const savedUser = await user.save();
    createdUserIds.push(savedUser._id); // Save ID for later
  }

  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const cityData = cities[random1000];
    const shuffledImages = images.sort(() => 0.5 - Math.random());
    const selectedImages = shuffledImages.slice(0, 2);
    const randomUserIndex = Math.floor(Math.random() * createdUserIds.length);
    const randomAuthorId = createdUserIds[randomUserIndex];

    const camp = new Campground({
      author: randomAuthorId, // Ensure this User ID exists in your DB!
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
