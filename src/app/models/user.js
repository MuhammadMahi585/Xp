import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password too short"]
  },
  type: {
    type: String,
    required: true,
    enum: ["customer", "admin"],
    default: "customer"
  },
  number: {
    type: String,        // Phone numbers are better stored as String
    required: true,
  },
  cart: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product" 
    },
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  }],
  addresses: [{
    type: {
      type: String,
      enum: ["home", "work", "other"],
      default: "home"
    },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "Pakistan" },
    isDefault: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;