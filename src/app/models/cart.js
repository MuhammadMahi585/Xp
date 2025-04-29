const { default: mongoose } = require("mongoose");

const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema({
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
  }, { timestamps: true });

  const Cart = mongoose.model("Cart",cartSchema)
  export default Cart;