const mongoose = require('mongoose');

const feeLineItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  amount: { type: Number, required: true, min: 0 }
}, { _id: false });

const feeInvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'student', required: true, index: true },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true, index: true },
  academicYear: { type: String, required: true, trim: true },
  term: { type: String, default: 'General', trim: true },
  lineItems: { type: [feeLineItemSchema], default: [] },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  dueDate: { type: Date, required: true },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue'], default: 'Pending', index: true }
}, { timestamps: true });

module.exports = mongoose.model('feeInvoice', feeInvoiceSchema);
