const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, min: 1 },
      priceAtPurchase: { type: Number, required: true } // Price snapshot
    }],
    shippingAddress: {
      type: { type: String, enum: ["home", "work"], default: "home" },
      street: { type: String, required: true },
      city: { type: String, required: true },
      province: { 
        type: String, 
        enum: ["Punjab", "Sindh", "KPK", "Balochistan", "Islamabad"],
        required: true 
      },
      postalCode: { type: String, required: true },
      contactNumber: { 
        type: String, 
        validate: {
          validator: (v) => /^03\d{9}$/.test(v),
          message: "Invalid Pakistani mobile number"
        }
      }
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    totalAmount: { type: Number, required: true },
    trackingNumber: String,
    
    paymentIntent: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Payment" 
    }
  }, { timestamps: true });

  const Orders = mongoose.model("Orders",orderSchema)
export default Orders;
