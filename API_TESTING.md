# ThinkNest Blog API - Quick Testing Guide

## Base URL
```
http://localhost:5000/api/blogs
```

## Test Endpoints

### 1. Create a Blog Post
```bash
POST http://localhost:5000/api/blogs
Content-Type: application/json

{
  "title": "10 Tips for Better Sleep",
  "description": "Improve your sleep quality with these proven techniques",
  "content": "Getting quality sleep is essential for your health...",
  "category": "Health",
  "tags": ["sleep", "health", "wellness"],
  "featuredImage": "https://example.com/sleep.jpg"
}
```

### 2. Get All Blogs
```bash
GET http://localhost:5000/api/blogs
```

### 3. Get Single Blog by Slug
```bash
GET http://localhost:5000/api/blogs/10-tips-for-better-sleep
```

### 4. Update Blog
```bash
PUT http://localhost:5000/api/blogs/{blog_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

### 5. Delete Blog
```bash
DELETE http://localhost:5000/api/blogs/{blog_id}
```

## Testing with cURL

### Create Blog
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Healthy Morning Routine",
    "description": "Start your day right",
    "content": "Wake up early, exercise, eat healthy breakfast...",
    "category": "Lifestyle",
    "tags": ["morning", "health"],
    "featuredImage": "https://example.com/morning.jpg"
  }'
```

### Get All Blogs
```bash
curl http://localhost:5000/api/blogs
```

### Get Blog by Slug
```bash
curl http://localhost:5000/api/blogs/healthy-morning-routine
```

## Testing with Postman

1. Import the endpoints above
2. Set base URL: `http://localhost:5000`
3. For POST/PUT requests, set Headers:
   - `Content-Type: application/json`
4. Add request body in the "Body" tab (raw JSON)

## Expected Responses

### Success Response
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error"
}
```

## Notes
- Slug is auto-generated from title
- All blogs are sorted by latest first (createdAt DESC)
- Required fields: title, description, content, category
- Optional fields: tags, featuredImage
