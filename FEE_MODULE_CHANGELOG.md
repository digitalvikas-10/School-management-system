# Fees, Invoices & Payments Upgrade

## Backend
- Added `backend/models/feeInvoiceSchema.js`
- Added `backend/models/paymentSchema.js`
- Added `backend/controllers/fee-controller.js`
- Added fee routes to `backend/routes/route.js`
- Invoice creation calculates subtotal, discount, tax, total and payment status.
- Payment creation validates outstanding balance, updates invoice paid amount/status and creates a unique receipt number.
- Added invoice, payment, student fee and finance report endpoints.

## Frontend
- Added Admin `Fees & Invoices` workspace at `/Admin/fees`.
- Create invoices from existing students.
- Filter by academic year, status and student.
- Record payments with Cash, UPI, Card, Bank Transfer, Cheque or Other.
- Print system-generated receipts.
- View collection KPIs and payment-method reports.
- Export invoice report as CSV.
- Added Student `Fees` page at `/Student/fees` with invoice balances and payment history.
- Added navigation entries for both Admin and Student roles.

## Important
The payment workflow is intentionally gateway-agnostic. It records verified/manual payment references; it does not claim that an online UPI/card transaction was actually charged. A production payment gateway such as Razorpay/Stripe can be connected later to create payments only after gateway verification/webhook confirmation.
