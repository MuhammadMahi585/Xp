import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price can't be negative"]
  },
  description: String,
  category: {
    type: String,
    enum: ["Headphones", "Keyboard", "mouse", "Handfrees","SSD","NVME","HardDrive","USB","laptopTables","AirBuds","others"],
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [String], 
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String 
    }]
},
 timestamps: true }); 

const Product = mongoose.model("Product", productSchema);
export default Product;