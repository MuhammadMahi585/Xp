import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order reference is required"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"]
  },
  method: {
    type: String,
    enum: ["EasyPaisa", "JazzCash", "Bank", "Cash on Delivery"],
    required: [true, "Payment method is required"]
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [1, "Amount cannot be less than 1 PKR"]
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  // Gateway-specific fields
  gatewayDetails: {
    transactionId: String,          // JazzCash/EasyPaisa transaction ID
    accountNumber: String,          // Last 4 digits for cards/bank transfers
    mobileNumber: {                 // For JazzCash/EasyPaisa
      type: String,
      validate: {
        validator: (v) => /^03\d{9}$/.test(v), // Pakistani mobile format
        message: "Invalid Pakistani mobile number"
      }
    },
    bankName: String               // For bank transfers (HBL, UBL, etc.)
  },
  // Security & Verification
  verification: {
    otp: String,                   // SMS OTP for mobile payments
    verifiedAt: Date
  },
  // Audit Log
  ipAddress: String,               // Capture payer's IP
  deviceInfo: String,              // User agent/browser
  gatewayResponse: Object          // Raw response from payment provider
}, { 
  timestamps: true 
});

// Add indexes for faster queries
paymentSchema.index({ order: 1 });
paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;