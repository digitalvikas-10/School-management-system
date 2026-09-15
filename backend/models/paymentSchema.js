const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true, index: true },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'feeInvoice', required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true, index: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true, index: true },
  amount: { type: Number, required: true, min: 0.01 },
  method: { type: String, enum: ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Other'], default: 'Cash' },
  transactionId: { type: String, default: '', trim: true },
  paidAt: { type: Date, default: Date.now },
  remarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('payment', paymentSchema);
