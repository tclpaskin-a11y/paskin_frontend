# Paskin API Documentation

## Authentication

All protected API endpoints require **Bearer Token** authentication via the Authorization header:

```
Authorization: Bearer <accessToken>
```

The `accessToken` is stored in `localStorage` with the key `accessToken` after successful login.

---

## API Endpoints

### Base URL

```
https://api.paskin.co.in/api
```

---

## 1. Authentication Endpoints (No Bearer Token Required)

### Login

- **Method**: POST
- **Endpoint**: `/auth/login`
- **Body**:
  ```json
  {
    "identifier": "email@example.com or mobile",
    "password": "password"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "accessToken": "token",
    "refreshToken": "token",
    "user": { "id": "...", "name": "...", "email": "...", "mobile": "...", "role": "..." }
  }
  ```

### Signup

- **Method**: POST
- **Endpoint**: `/auth/signup`
- **Body**:
  ```json
  {
    "name": "User Name",
    "email": "email@example.com",
    "mobile": "9876543210",
    "password": "password"
  }
  ```

### Logout

- **Method**: POST
- **Endpoint**: `/auth/logout`
- **Body**: `{ "refreshToken": "token" }`

---

## 2. Blog Endpoints (Bearer Token Required)

### Get All Blogs

- **Method**: GET
- **Endpoint**: `/admin/blogs`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "blog": [
      {
        "_id": "id",
        "title": "Blog Title",
        "description": "Content",
        "images": ["url"],
        "createdBy": { "_id": "...", "name": "...", "email": "...", "role": "..." },
        "isPublished": true,
        "createdAt": "2026-05-12T...",
        "updatedAt": "2026-05-12T..."
      }
    ]
  }
  ```

### Create Blog (POST)

- **Method**: POST
- **Endpoint**: `/admin/blogs`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData
  ```
  title: "Baby Care Tips"
  description: "Full blog content yaha likho"
  media: <File>
  isPublished: true
  ```
- **Response**:
  ```json
  {
    "success": true,
    "blog": {
      "_id": "6a02b436a0771d3eee0a3242",
      "title": "Baby Care Tips",
      "description": "Full blog content yaha likho",
      "images": ["https://paskin-media-storage.s3.ap-south-1.amazonaws.com/..."],
      "createdBy": "69fb2594d5c57e1cafca3c69",
      "isPublished": true,
      "createdAt": "2026-05-12T05:01:42.037Z",
      "updatedAt": "2026-05-12T05:01:42.037Z"
    }
  }
  ```

### Update Blog (PUT)

- **Method**: PUT
- **Endpoint**: `/admin/blogs/{blogId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData (same as create)
- **Response**: Updated blog object

### Delete Blog (DELETE)

- **Method**: DELETE
- **Endpoint**: `/admin/blogs/{blogId}`
- **Headers**: `Authorization: Bearer <token>`

---

## 3. Product Endpoints (Bearer Token Required)

### Get All Products

- **Method**: GET
- **Endpoint**: `/admin/products`
- **Headers**: `Authorization: Bearer <token>`

### Get Single Product

- **Method**: GET
- **Endpoint**: `/admin/products/{productId}`
- **Headers**: `Authorization: Bearer <token>`

### Create Product (POST)

- **Method**: POST
- **Endpoint**: `/admin/products`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData
  ```
  name: "Product Name"
  description: "Description"
  price: 100
  category: "categoryId"
  images: <Files>
  stock: 50
  isActive: true
  ```

### Update Product (PUT)

- **Method**: PUT
- **Endpoint**: `/admin/products/{productId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData (same as create)

### Delete Product (DELETE)

- **Method**: DELETE
- **Endpoint**: `/admin/products/{productId}`
- **Headers**: `Authorization: Bearer <token>`

---

## 4. Category Endpoints (Bearer Token Required)

### Get All Categories

- **Method**: GET
- **Endpoint**: `/admin/categories`
- **Headers**: `Authorization: Bearer <token>`

### Get Single Category

- **Method**: GET
- **Endpoint**: `/admin/categories/{categoryId}`
- **Headers**: `Authorization: Bearer <token>`

### Create Category (POST)

- **Method**: POST
- **Endpoint**: `/admin/categories`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData
  ```
  name: "Category Name"
  description: "Description"
  image: <File>
  isActive: true
  ```

### Update Category (PUT)

- **Method**: PUT
- **Endpoint**: `/admin/categories/{categoryId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: FormData (same as create)

### Delete Category (DELETE)

- **Method**: DELETE
- **Endpoint**: `/admin/categories/{categoryId}`
- **Headers**: `Authorization: Bearer <token>`

---

## 5. Order Endpoints (Bearer Token Required)

### Get All Orders (Admin)

- **Method**: GET
- **Endpoint**: `/admin/orders`
- **Headers**: `Authorization: Bearer <token>`

### Get User Orders

- **Method**: GET
- **Endpoint**: `/orders`
- **Headers**: `Authorization: Bearer <token>`

### Get Single Order

- **Method**: GET
- **Endpoint**: `/admin/orders/{orderId}` or `/orders/{orderId}`
- **Headers**: `Authorization: Bearer <token>`

### Update Order Status (PUT)

- **Method**: PUT
- **Endpoint**: `/admin/orders/{orderId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "status": "shipped",
    "trackingNumber": "ABC123"
  }
  ```

### Delete Order (DELETE)

- **Method**: DELETE
- **Endpoint**: `/admin/orders/{orderId}`
- **Headers**: `Authorization: Bearer <token>`

---

## 6. Profile Endpoints (Bearer Token Required)

### Get Current User Profile

- **Method**: GET
- **Endpoint**: `/profile`
- **Headers**: `Authorization: Bearer <token>`

### Update User Profile (PUT)

- **Method**: PUT
- **Endpoint**: `/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "New Name",
    "email": "newemail@example.com",
    "mobile": "9876543210"
  }
  ```

### Change Password (POST)

- **Method**: POST
- **Endpoint**: `/profile/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "currentPassword": "oldPassword",
    "newPassword": "newPassword"
  }
  ```

### Add Address (POST)

- **Method**: POST
- **Endpoint**: `/profile/addresses`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "street": "123 Main St",
    "city": "City",
    "state": "State",
    "pincode": "123456",
    "isDefault": true
  }
  ```

### Update Address (PUT)

- **Method**: PUT
- **Endpoint**: `/profile/addresses/{addressId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as add address

### Delete Address (DELETE)

- **Method**: DELETE
- **Endpoint**: `/profile/addresses/{addressId}`
- **Headers**: `Authorization: Bearer <token>`

---

## 7. Cart Endpoints (Bearer Token Required)

### Get Cart

- **Method**: GET
- **Endpoint**: `/cart`
- **Headers**: `Authorization: Bearer <token>`

### Add To Cart (POST)

- **Method**: POST
- **Endpoint**: `/cart/items`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "productId": "productId",
    "quantity": 1
  }
  ```

### Update Cart Item (PUT)

- **Method**: PUT
- **Endpoint**: `/cart/items/{productId}`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "quantity": 2
  }
  ```

### Remove From Cart (DELETE)

- **Method**: DELETE
- **Endpoint**: `/cart/items/{productId}`
- **Headers**: `Authorization: Bearer <token>`

### Clear Cart (DELETE)

- **Method**: DELETE
- **Endpoint**: `/cart`
- **Headers**: `Authorization: Bearer <token>`

---

## Usage Example

```typescript
import { createBlog, getAllBlogs, deleteBlog } from "@/lib/api";

// Create a blog
const newBlog = await createBlog({
  title: "My Blog",
  description: "Content here",
  media: fileObject,
  isPublished: true,
});

// Get all blogs
const blogs = await getAllBlogs();

// Delete a blog
await deleteBlog(blogId);
```

---

## Error Handling

All API functions throw errors with descriptive messages. Handle them using try-catch:

```typescript
try {
  const blogs = await getAllBlogs();
} catch (error) {
  console.error(error.message);
  // Handle error
}
```

---

## Token Refresh

If you receive a 401 Unauthorized error, the token has expired. Use the refresh token to get a new access token:

**Endpoint**: POST `/auth/refresh-token`
**Body**:

```json
{
  "refreshToken": "refreshToken"
}
```

---

## Notes

- All endpoints require Bearer token authentication except login, signup, and logout
- FormData is used for endpoints that accept file uploads
- Timestamps are in ISO 8601 format
- IDs are MongoDB ObjectIDs (strings)
