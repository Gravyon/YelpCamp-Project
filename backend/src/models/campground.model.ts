import mongoose from "mongoose";
import Review from "./review.model";
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: { type: String, required: [true, "Image is required"] },
  filename: { type: String },
});

const CampgroundSchema = new Schema({
  title: { type: String, required: [true, "Title is required"], trim: true },
  images: [ImageSchema],
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  description: { type: String, required: [true, "Description is required"] },
  location: { type: String, required: [true, "Location is required"] },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  geometry: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
});

CampgroundSchema.pre("findOneAndDelete", async function () {
  const query = this;
  const campground = await query.model.findOne(query.getFilter());
  if (campground) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

export default mongoose.model("Campground", CampgroundSchema);
