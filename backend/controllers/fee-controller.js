const FeeInvoice = require('../models/feeInvoiceSchema');
const Payment = require('../models/paymentSchema');
const Student = require('../models/studentSchema');

const money = (n) => Math.round(Number(n || 0) * 100) / 100;

const makeNumber = (prefix) => `${prefix}-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 90 + 10)}`;

const calculateStatus = (invoice) => {
  const paid = money(invoice.paidAmount);
  const total = money(invoice.totalAmount);
  if (paid >= total && total > 0) return 'Paid';
  if (paid > 0) return 'Partially Paid';
  if (new Date(invoice.dueDate) < new Date()) return 'Overdue';
  return 'Pending';
};

const populateInvoice = (query) => query
  .populate({ path: 'student', select: 'name rollNum sclassName', populate: { path: 'sclassName', select: 'sclassName' } });

exports.createInvoice = async (req, res) => {
  try {
    const { studentId, adminID, academicYear, term, lineItems = [], discount = 0, tax = 0, dueDate, notes = '' } = req.body;
    if (!studentId || !adminID || !academicYear || !dueDate || !Array.isArray(lineItems) || !lineItems.length) {
      return res.status(400).json({ message: 'studentId, adminID, academicYear, dueDate and at least one line item are required.' });
    }
    const student = await Student.findOne({ _id: studentId, school: adminID });
    if (!student) return res.status(404).json({ message: 'Student not found in this school.' });

    const normalizedItems = lineItems.map(item => ({
      title: String(item.title || '').trim(), description: String(item.description || ''), amount: money(item.amount)
    })).filter(item => item.title && item.amount >= 0);
    const subtotal = money(normalizedItems.reduce((sum, item) => sum + item.amount, 0));
    const totalAmount = money(Math.max(0, subtotal - Number(discount || 0) + Number(tax || 0)));

    const invoice = await FeeInvoice.create({
      invoiceNumber: makeNumber('INV'), student: studentId, school: adminID, academicYear,
      term: term || 'General', lineItems: normalizedItems, subtotal,
      discount: money(discount), tax: money(tax), totalAmount, dueDate, notes
    });
    const populated = await populateInvoice(FeeInvoice.findById(invoice._id));
    return res.status(201).json(populated);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.listInvoices = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, studentId, academicYear, from, to, limit = 200 } = req.query;
    const filter = { school: id };
    if (status && status !== 'All') filter.status = status;
    if (studentId) filter.student = studentId;
    if (academicYear) filter.academicYear = academicYear;
    if (from || to) { filter.dueDate = {}; if (from) filter.dueDate.$gte = new Date(from); if (to) filter.dueDate.$lte = new Date(to); }
    const invoices = await populateInvoice(FeeInvoice.find(filter).sort({ createdAt: -1 }).limit(Number(limit))).lean();
    const normalized = invoices.map(inv => ({ ...inv, status: calculateStatus(inv), balance: money(inv.totalAmount - inv.paidAmount) }));
    return res.json(normalized);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.getInvoice = async (req, res) => {
  try {
    const invoice = await populateInvoice(FeeInvoice.findOne({ _id: req.params.id, school: req.query.schoolId })).lean();
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
    invoice.status = calculateStatus(invoice); invoice.balance = money(invoice.totalAmount - invoice.paidAmount);
    const payments = await Payment.find({ invoice: invoice._id }).sort({ paidAt: -1 });
    return res.json({ invoice, payments });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.recordPayment = async (req, res) => {
  try {
    const { invoiceId, adminID, amount, method = 'Cash', transactionId = '', paidAt, remarks = '' } = req.body;
    const paymentAmount = money(amount);
    if (!invoiceId || !adminID || paymentAmount <= 0) return res.status(400).json({ message: 'invoiceId, adminID and a positive amount are required.' });
    const invoice = await FeeInvoice.findOne({ _id: invoiceId, school: adminID });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
    const balance = money(invoice.totalAmount - invoice.paidAmount);
    if (paymentAmount > balance + 0.01) return res.status(400).json({ message: `Payment exceeds the outstanding balance of ₹${balance.toFixed(2)}.` });

    const payment = await Payment.create({ receiptNumber: makeNumber('RCT'), invoice: invoice._id, student: invoice.student, school: adminID, amount: paymentAmount, method, transactionId, paidAt: paidAt || new Date(), remarks });
    invoice.paidAmount = money(invoice.paidAmount + paymentAmount);
    invoice.status = calculateStatus(invoice);
    await invoice.save();
    const populated = await Payment.findById(payment._id).populate('student', 'name rollNum').populate('invoice');
    return res.status(201).json(populated);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.listPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ school: req.params.id }).sort({ paidAt: -1 }).limit(Number(req.query.limit || 300))
      .populate('student', 'name rollNum').populate('invoice', 'invoiceNumber academicYear term totalAmount');
    return res.json(payments);
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.getStudentFees = async (req, res) => {
  try {
    const invoices = await populateInvoice(FeeInvoice.find({ student: req.params.id }).sort({ dueDate: -1 })).lean();
    const invoiceIds = invoices.map(x => x._id);
    const payments = await Payment.find({ invoice: { $in: invoiceIds } }).sort({ paidAt: -1 });
    const paymentMap = payments.reduce((acc, p) => { (acc[p.invoice] ||= []).push(p); return acc; }, {});
    return res.json(invoices.map(inv => ({ ...inv, status: calculateStatus(inv), balance: money(inv.totalAmount - inv.paidAmount), payments: paymentMap[inv._id] || [] })));
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

exports.report = async (req, res) => {
  try {
    const school = req.params.id;
    const { academicYear, from, to } = req.query;
    const filter = { school };
    if (academicYear) filter.academicYear = academicYear;
    if (from || to) { filter.createdAt = {}; if (from) filter.createdAt.$gte = new Date(from); if (to) filter.createdAt.$lte = new Date(to); }
    const invoices = await FeeInvoice.find(filter).lean();
    const paymentFilter = { school };
    if (from || to) { paymentFilter.paidAt = {}; if (from) paymentFilter.paidAt.$gte = new Date(from); if (to) paymentFilter.paidAt.$lte = new Date(to); }
    const payments = await Payment.find(paymentFilter).lean();
    const invoiced = money(invoices.reduce((s, i) => s + i.totalAmount, 0));
    const collected = money(payments.reduce((s, p) => s + p.amount, 0));
    const outstanding = money(Math.max(0, invoiced - collected));
    const overdue = money(invoices.filter(i => calculateStatus(i) === 'Overdue').reduce((s, i) => s + (i.totalAmount - i.paidAmount), 0));
    const byMethod = payments.reduce((acc, p) => { acc[p.method] = money((acc[p.method] || 0) + p.amount); return acc; }, {});
    const byMonth = {};
    payments.forEach(p => { const key = new Date(p.paidAt).toISOString().slice(0, 7); byMonth[key] = money((byMonth[key] || 0) + p.amount); });
    return res.json({ invoiceCount: invoices.length, paymentCount: payments.length, invoiced, collected, outstanding, overdue, collectionRate: invoiced ? money(collected / invoiced * 100) : 0, byMethod, byMonth });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};
