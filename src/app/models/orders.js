const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: {type: String},
      priceAtPurchase: { type: Number, required: true }, 
      quantity: { type: Number, min: 1 },
    }],
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: "Pakistan" },
      isDefault: { type: Boolean, default: true }
    },    
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    totalAmount: { type: Number, required: true },
    trackingNumber: String,
  }, { timestamps: true });

  const Orders = mongoose.models.Orders || mongoose.model("Orders", orderSchema);
  export default Orders;
  