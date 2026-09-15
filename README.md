# EduFlow — Premium School Management System

This version upgrades the original MERN School Management System with a modern SaaS-style UI while preserving the existing MERN architecture and role-based workflows.

## What's upgraded

### New premium UI
- EduFlow visual identity and modern landing page.
- Responsive sidebar + mobile navigation drawer.
- Sticky glass-style top bar.
- Global navigation/search field.
- Notification indicator.
- Persistent light/dark mode.
- Premium KPI cards, quick actions, activity feeds and schedules.
- Responsive dashboard grids and mobile layouts.
- Improved typography, spacing, shadows, borders and visual hierarchy.
- Existing legacy management screens remain available.

### Admin dashboard
- Live student, teacher and class counts from the existing Redux/API data.
- Premium KPI cards.
- Fee collection dashboard presentation.
- Campus schedule widget.
- Quick actions for students, teachers, classes and subjects.
- Recent activity feed.
- Attendance/academic-ready dashboard layout.
- Latest notices section.
- Existing student, teacher, class, subject, notice and complaint routes preserved.

### Teacher dashboard
- Class student count from the existing API.
- Lesson/session count.
- Assessment and teaching-hour overview.
- Daily schedule.
- Class pulse/progress widgets.
- Quick attendance/student actions.
- Activity and announcements.

### Student dashboard
- Enrolled subject count from the existing API.
- Overall attendance calculation from the existing student data.
- Attendance target indicator.
- Subject/learning snapshot.
- Assignment and performance dashboard presentation.
- Daily timetable.
- Activity and announcements.

### Developer experience
- `frontend/.env.example` added.
- `backend/.env.example` added.
- `UPGRADE_PROMPT.md` contains the reusable AI upgrade prompt.
- No new npm dependency is required for the premium UI; it reuses the project's existing React + Material UI + Recharts stack.

> Note: The fee, assignment, timetable, activity and some analytics values shown in the new dashboard are presentation/demo data until corresponding backend models and APIs are implemented. Existing live counts and attendance continue to come from the current backend.

## Requirements

- Node.js 18+ recommended
- npm
- MongoDB Community Server **or** MongoDB Atlas
- A modern browser

## 1. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URL=mongodb://127.0.0.1:27017/smsproject
SECRET_KEY=replace-with-a-long-random-secret
PORT=5000
```

Start the backend:

```bash
npm start
```

Backend: `http://localhost:5000`

## 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
```

Create/update `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start:

```bash
npm start
```

Frontend: `http://localhost:3000`

## 3. MongoDB

### Local MongoDB

Install MongoDB Community Server and make sure the MongoDB service is running. The default connection used above is:

```text
mongodb://127.0.0.1:27017/smsproject
```

### MongoDB Atlas

Create a cluster and put the Atlas connection string into `backend/.env` as `MONGO_URL`.

## 4. Production build

Frontend:

```bash
cd frontend
npm run build
```

Backend:

```bash
cd backend
npm start
```

## Important environment files

Do not commit real credentials.

- `backend/.env` — local secrets; create this yourself.
- `backend/.env.example` — safe template.
- `frontend/.env` — local API URL.
- `frontend/.env.example` — safe template.

## Suggested next production phase

The UI foundation is now ready for a deeper ERP upgrade. The highest-value backend additions would be:

1. Fees + invoices + receipts
2. Assignments + submissions
3. Timetable/calendar
4. Exams + report cards
5. Parent/guardian accounts
6. Notifications
7. Audit logs
8. Advanced analytics
9. CSV/PDF reports
10. Fine-grained RBAC

These should be implemented against real MongoDB models and APIs rather than dashboard-only mock values.

## Fees & Invoices module

The premium upgrade now includes a database-backed finance module:

- Create fee invoices with line items, discounts, tax, academic year and due date.
- Track Pending, Partially Paid, Paid and Overdue status.
- Record Cash, UPI, Card, Bank Transfer, Cheque and Other payments.
- Generate unique receipt numbers and print receipts from the browser.
- View payment history per invoice and per student.
- Admin collection dashboard with invoiced, collected, outstanding and overdue totals.
- Payment-method breakdown and CSV invoice report export.
- Students can view their own invoices, balances and payment history.

### New API endpoints

- `POST /Fees/InvoiceCreate`
- `GET /Fees/Invoices/:schoolId`
- `GET /Fees/Invoice/:invoiceId?schoolId=:schoolId`
- `POST /Fees/PaymentCreate`
- `GET /Fees/Payments/:schoolId`
- `GET /Fees/Student/:studentId`
- `GET /Fees/Report/:schoolId`
