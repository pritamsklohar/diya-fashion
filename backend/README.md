# Diya Fashion Backend

Express + MongoDB API for authentication, products, carts, orders, and admin dashboards.

**Tech Stack**
- Node.js + Express (ES modules)
- MongoDB + Mongoose
- JWT auth
- Razorpay for payments
- Cloudinary for image storage
- Nodemailer for email/OTP
- Multer for uploads

**Key Features**
- User auth: register, login, verify email/OTP, password reset
- Role-based access (`user`, `admin`)
- Product CRUD with image uploads
- Cart management
- Order creation + Razorpay verification
- Admin reports (sales, users, orders)

**Important Files**
- `backend/server.js` - app bootstrap, CORS, routes
- `backend/database/db.js` - MongoDB connection
- `backend/routes/*` - API route definitions
- `backend/controllers/*` - request handlers (business logic)
- `backend/middleware/isAuthenticated.js` - JWT auth + admin guard
- `backend/middleware/multer.js` - upload handling
- `backend/utils/cloudinary.js` - Cloudinary client
- `backend/config/razorpay.js` - Razorpay client

**Environment Variables**
Create a `.env` file in `backend/`:
- `PORT` (default `3000`)
- `MONGO_URI` (base URI; DB name `diya-fashion` is appended in code)
- `SECRET_KEY` (JWT secret)
- `MAIL_USER` / `MAIL_PASS` (SMTP creds for OTP/verification)
- `CLOUD_NAME` / `API_KEY` / `API_SECRET` (Cloudinary)
- `RAZORPAY_KEY_ID` / `RAZORPAY_SECRET`

**Scripts**
- `npm install`
- `npm run start` (nodemon)

**API Overview**
Base URL: `/api/v1`

- Users:  
  - `POST /user/register`  
  - `POST /user/verify`  
  - `POST /user/reverify`  
  - `POST /user/login`  
  - `POST /user/logout` (auth)  
  - `POST /user/forgot-password`  
  - `POST /user/verify-otp/:email`  
  - `POST /user/change-password/:email`  
  - `GET /user/all-user` (admin)  
  - `GET /user/get-user/:userId`  
  - `PUT /user/update/:id` (auth + upload)

- Products:  
  - `POST /product/add` (admin + upload)  
  - `GET /product/getallproducts`  
  - `DELETE /product/delete/:productId` (admin)  
  - `PUT /product/update/:productId` (admin + upload)

- Cart:  
  - `POST /cart/get` (auth)  
  - `POST /cart/add` (auth)  
  - `PUT /cart/update` (auth)  
  - `POST /cart/update` (auth)  
  - `DELETE /cart/remove` (auth)

- Orders:  
  - `POST /orders/create-order` (auth)  
  - `POST /orders/verify-payment` (auth)  
  - `GET /orders/myorder` (auth)  
  - `GET /orders/all` (admin)  
  - `GET /orders/user-order/:userId` (admin)  
  - `GET /orders/sales` (admin)

**Notes**
- CORS allows `http://localhost:5173` by default.
- `MONGO_URI` should not include a database name; `db.js` appends `/diya-fashion`.
