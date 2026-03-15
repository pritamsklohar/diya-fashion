# Diya Fashion Frontend

Vite + React storefront and admin dashboard for the Diya Fashion platform.

**Tech Stack**
- React 19
- Vite 7
- Tailwind CSS 4
- Redux Toolkit + Redux Persist
- React Router
- Axios
- Radix UI (via shadcn tooling)
- Recharts (admin analytics)
- Lucide + React Icons
- Sonner (toast notifications)

**Key Features**
- Product listing and details
- Cart management
- User auth flows
- Orders + Razorpay payment
- Admin dashboard (users, orders, sales)

**Important Files**
- `frontend/src/main.jsx` - app entry
- `frontend/src/App.jsx` - route map
- `frontend/src/pages/` - screens (shop, auth, admin)
- `frontend/src/components/` - shared UI
- `frontend/src/redux/` - store, slices, persistence
- `frontend/src/lib/` - utilities
- `frontend/src/index.css` - Tailwind base + global styles

**Environment Variables**
Create a `.env` file in `frontend/`:
- `VITE_URL` (backend base URL, e.g. `http://localhost:8000`)
- `VITE_RAZORPAY_KEY_ID`

**Scripts**
- `npm install`
- `npm run dev` (local dev server)
- `npm run build`
- `npm run preview`
- `npm run lint`

**Notes**
- The backend must be running for API calls and payment verification.
- Razorpay uses `VITE_RAZORPAY_KEY_ID` on the client and server secrets stay in the backend.
