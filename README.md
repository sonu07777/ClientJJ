# Customer Billing Management (React + .NET + MongoDB)

This project now includes:
- Frontend: React + TypeScript (`/src`)
- Backend: .NET 8 Web API (`/backend/BillingManagement.Api`)
- Database: MongoDB

Features implemented:
- Login page first (JWT auth)
- Roles: `Admin`, `Admin_Pro`
- 3 seeded users:
  - `admin1` / `Admin@123` (`Admin`)
  - `admin2` / `Admin@123` (`Admin`)
  - `adminpro` / `AdminPro@123` (`Admin_Pro`)
- Add customers
- Add products
- Record sales with paid amount
- Daily summary (sell, paid, pending)
- Pending amount by customer
- Monthly total summary only for `Admin_Pro`

## Backend setup

1. Start MongoDB locally:
```bash
mongod
```

2. Run API:
```bash
cd backend/BillingManagement.Api
dotnet restore
dotnet run
```

Default backend URL (local): `http://localhost:5099/api`

## Frontend setup

Run the frontend:
```bash
npm install
npm run dev
```

Optional env file:
```bash
# .env
VITE_API_BASE_URL=http://localhost:5099
```

`VITE_API_BASE_URL` should be the backend origin only, without `/api`,
because the frontend already calls paths like `/api/customers`.

## Deploy frontend on Render

This repository includes `render.yaml` for a Render Static Site.

Render settings:
- Service type: Static Site
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://YOUR-BACKEND-URL`
- Rewrite rule: source `/*`, destination `/index.html`

The `render.yaml` route rewrite sends all client-side routes to
`/index.html`, so direct links like `/home` work after refresh.

Before deploying, make sure your backend allows requests from your Render
frontend URL in CORS. If you use cookies, the backend cookies must be
cross-site compatible over HTTPS.

## Demo backend links to use now

Use this endpoint pattern in your frontend during demo:
- Login: `https://YOUR-DEMO-BACKEND/api/auth/login`
- Customers: `https://YOUR-DEMO-BACKEND/api/customers`
- Products: `https://YOUR-DEMO-BACKEND/api/products`
- Sales: `https://YOUR-DEMO-BACKEND/api/sales`
- Daily summary: `https://YOUR-DEMO-BACKEND/api/sales/daily-summary?date=2026-02-14`
- Pending customers: `https://YOUR-DEMO-BACKEND/api/sales/pending-customers`
- Monthly total (`Admin_Pro` only): `https://YOUR-DEMO-BACKEND/api/sales/monthly-total?year=2026&month=2`

Later, replace `YOUR-DEMO-BACKEND` with your original production backend link.
