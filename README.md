# Prop Firm Backend API

A RESTful backend API built with Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, and Role-Based Access Control.

## Features

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Authentication
* Role-Based Authorization (Admin/User)
* Protected Routes
* Firm Management CRUD APIs
* MongoDB Integration
* Environment Variable Configuration

---

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcrypt
* dotenv
* cookie-parser
* cors

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_TOKEN=your_secret_key
```

Start the server:

```bash
npm run dev
```

or

```bash
npm start
```

---

## Authentication APIs

### Register User

```http
POST /api/auth/register
```

### Login User

```http
POST /api/auth/login
```

Returns a JWT token used to access protected routes.

---

## User APIs

### Get Profile

```http
GET /api/user/profile
```

Protected Route

Headers:

```http
Authorization: <JWT_TOKEN>
```

---

## Admin APIs

### Admin Test Route

```http
GET /api/user/admin-test
```

Admin Access Required

---

## Firm APIs

### Create Firm

```http
POST /api/firms
```

Admin Access Required

### Get All Firms

```http
GET /api/firms/AllFirms
```

### Get Firm By ID

```http
GET /api/firms/:id
```

### Update Firm

```http
PUT /api/firms/:id
```

Admin Access Required

### Delete Firm

```http
DELETE /api/firms/:id
```

Admin Access Required

---

## Firm Schema

```json
{
  "name": "FundedNext Stellar Instant",
  "accountType": "Instant",
  "challengeFee": 549,
  "profitSplit": 80,
  "dailyDrawdown": 0,
  "overallDrawdown": 6,
  "drawdownType": "Trailing",
  "newsTrading": true,
  "weekendHolding": true,
  "payoutFrequency": "14 Days",
  "description": "Instant funded account"
}
```

---

## Security

* Passwords are hashed using bcrypt.
* Authentication handled using JWT.
* Role-based access control for admin routes.
* Environment variables protected using `.env`.

---

## Future Improvements

* Refresh Tokens
* Pagination
* Search & Filter Firms
* Swagger API Documentation
* Rate Limiting
* Email Verification
* Password Reset
* File Upload Support

---

## Author

Aryan Saurav
