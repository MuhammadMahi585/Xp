import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be a positive number"]
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Product category is required"],
    enum: {
      values: ["Laptops", "Desktops", "Accessories", "Components", "Other"],
      message: "{VALUE} is not a valid category"
    }
  },
  subcategory: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: [true, "Product stock is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  images: [{
    type: String,
    required: [true, "At least one product image is required"]
  }]
}, { 
  timestamps: true, // Correct way to enable timestamps
  versionKey: false // Disable the __v field
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text', category: 'text' });

// Create model if it doesn't exist, otherwise use existing model
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;