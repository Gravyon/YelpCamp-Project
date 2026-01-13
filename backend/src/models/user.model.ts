import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  email: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username cannot be blank!"],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, "Name must be at least 3 characters long!"],
    maxLength: [50, "Name cannot exceed 50 characters!"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be blank!"],
    minlength: [8, "Password must be at least 8 characters long!"],
    select: false,
  },
  email: {
    type: String,
    required: [true, "Email cannot be blank!"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: "Invalid email format!",
    },
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);
export default User;
export { IUser };
