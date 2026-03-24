# Authentication and Product Management API

This is a Node.js API built with Express, using MongoDB (Mongoose) for database and JWT for authentication. It supports admin and client roles, with product management features.

## Project Structure

- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Frontend**: Basic Angular JS app in `front_end/` folder

## Base URL
`http://localhost:3000/api`

## Seeded Admin
Admin user is auto-created on server start from `src/.env`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com
```

## JWT Header
For protected routes, send:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

## Authentication Routes

### 1) Client Register
`POST /api/auth/client/register`

Payload:
```json
{
  "username": "client1",
  "password": "Client@123",
  "email": "client1@mail.com"
}
```

### 2) Login (Admin or Client)
`POST /api/auth/login`

Payload:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Or client:
```json
{
  "username": "client1",
  "password": "Client@123"
}
```

### 3) Get Current User
`GET /api/auth/me` (protected)

No body.

### 4) Update Client Profile
`PUT /api/auth/client/profile` (protected, role = `client`)

Payload (send what you want to update):
```json
{
  "username": "client1_new",
  "email": "client1_new@mail.com",
  "password": "NewPass@123"
}
```

### 5) Delete Client Profile
`DELETE /api/auth/client/profile` (protected, role = `client`)

No body.

## Product Routes

### 1) Create Product
`POST /api/products` (protected, admin only?)

Payload:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "stock": 10
}
```

### 2) Get All Products
`GET /api/products`

No body.

## Frontend

A basic Angular JS frontend is located in the `../front_end/` folder (outside the project root). Open `index.html` in a browser to view.

## Installation & Running

1. Install dependencies: `npm install`
2. Set up `MONGODB_URI` in `src/.env` (and admin details).
3. Run the server: `npm run dev`
4. For frontend, open `front_end/index.html` in browser.

## Example cURL

### Register client
```bash
curl -X POST http://localhost:3000/api/auth/client/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"client1\",\"password\":\"Client@123\",\"email\":\"client1@mail.com\"}"
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"client1\",\"password\":\"Client@123\"}"
```

### Me
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Update profile
  "username": "client1",
  "password": "Client@123"
}
```

### 3) Get Current User
`GET /api/auth/me` (protected)

No body.

### 4) Update Client Profile
`PUT /api/auth/client/profile` (protected, role = `client`)

Payload (send what you want to update):
```json
{
  "username": "client1_new",
  "email": "client1_new@mail.com",
  "password": "NewPass@123"
}
```

### 5) Delete Client Profile
`DELETE /api/auth/client/profile` (protected, role = `client`)

No body.

## Example cURL

### Register client
```bash
curl -X POST http://localhost:3000/api/auth/client/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"client1\",\"password\":\"Client@123\",\"email\":\"client1@mail.com\"}"
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"client1\",\"password\":\"Client@123\"}"
```

### Me
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Update profile
```bash
curl -X PUT http://localhost:3000/api/auth/client/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"client1_new@mail.com\"}"
```

### Delete profile
```bash
curl -X DELETE http://localhost:3000/api/auth/client/profile \
  -H "Authorization: Bearer <token>"
```

## Test Status
End-to-end auth flow was executed successfully on March 5, 2026 for:
- admin login
- client register
- client login
- client `me`
- client update profile
- client delete profile
