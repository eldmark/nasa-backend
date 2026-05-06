# NASA Explorer Backend API

A modular REST API built with Node.js and Express that proxies NASA data and manages a personal learning journal with favorites and custom planetary discoveries.

## Features

- **NASA Data Proxy**: APOD, Mars Weather, Exoplanets, Earth images, Asteroids, and TechPort projects.
- **Favorites Management**: Save any NASA item with personal learning notes to PostgreSQL.
- **Custom Planets**: Create and manage your own fictional planetary discoveries.
- **Advanced Querying**: Pagination, text search, sorting on all data endpoints.
- **Input Validation**: Server-side validation on all POST/PUT operations.
- **CORS Enabled**: Open to all origins for frontend integration.
- **Interactive Docs**: Swagger UI at `/api-docs` for endpoint exploration.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL 15+
- **Documentation**: Swagger/OpenAPI
- **Validation**: express-validator
- **Environment**: dotenv

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- NASA API Key (from [api.nasa.gov](https://api.nasa.gov))
- TechPort API Key (from [techport.nasa.gov](https://techport.nasa.gov))

## Installation

### Local Development

1. **Clone and install**:
   ```bash
   cd nasa-backend
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your keys and database URL
   ```

3. **Database setup**:
   ```bash
   psql -U postgres -d nasa_explorer -f init.sql
   ```

4. **Start server**:
   ```bash
   npm start
   # Server runs at http://localhost:3001
   ```

5. **View API docs**:
   - Visit `http://localhost:3001/api-docs`

### Docker Deployment

```bash
docker build -t nasa-backend .
docker run -e PORT=3001 -e DATABASE_URL=postgres://... -p 3001:3001 nasa-backend
```

### Render Deployment

1. Create a PostgreSQL instance in Render.
2. Create a Web Service pointing to this repo.
3. Set environment variables:
   - `DATABASE_URL` (from Render Postgres)
   - `NASA_API_KEY`
   - `TECHPORT_TOKEN`

## Environment Variables

```env
# Server
PORT=3001

# Database
DATABASE_URL=postgres://user:password@localhost:5432/nasa_explorer

# NASA APIs
NASA_API_KEY=your_nasa_api_key
TECHPORT_TOKEN=your_techport_token
```

---

## API Reference

### Base URL
- **Local**: `http://localhost:3001/api`
- **Production**: `https://nasa-backend-wenj.onrender.com/api`

### NASA Data Endpoints (Read-Only)

#### 1. Astronomy Picture of the Day
```http
GET /api/apod
```

**Response (200)**:
```json
{
  "data": {
    "title": "Comet ZTF Over the Berkshires",
    "date": "2023-01-15",
    "url": "https://apod.nasa.gov/apod/image/...",
    "explanation": "How does a comet develop a tail..."
  }
}
```

#### 2. Mars Weather (Insight Rover)
```http
GET /api/weather
```

**Response (200)**:
```json
{
  "data": {
    "sol": 1234,
    "date": "2023-01-15",
    "temperature_min": -65.4,
    "temperature_max": 0.1,
    "pressure": 731,
    "season": "Fall"
  }
}
```

#### 3. Exoplanet Archive
```http
GET /api/exoplanets
```

**Response (200)**:
```json
{
  "data": [
    {
      "name": "Kepler-452b",
      "host_star": "Kepler-452",
      "discovery_year": 2015,
      "planet_type": "Super-Earth",
      "distance_ly": 430
    }
  ]
}
```

#### 4. Earth Imagery (EPIC)
```http
GET /api/earth
```

**Response (200)**:
```json
{
  "data": [
    {
      "date": "2023-01-15",
      "image_url": "https://epic.gsfc.nasa.gov/archive/natural/...",
      "caption": "Natural color image of Earth"
    }
  ]
}
```

#### 5. Near-Earth Objects (Asteroids)
```http
GET /api/asteroids
```

**Response (200)**:
```json
{
  "data": [
    {
      "id": "2000433",
      "name": "Eros",
      "estimated_diameter": 8.4,
      "is_hazardous": false,
      "close_approach_date": "2023-02-14",
      "velocity": 24500
    }
  ]
}
```

#### 6. NASA TechPort Projects
```http
GET /api/tech
GET /api/projects
```

**Response (200)**:
```json
{
  "data": [
    {
      "id": 123456,
      "title": "Advanced Propulsion Research",
      "status": "Active Development",
      "organization": "NASA Glenn"
    }
  ]
}
```

---

### Favorites Management (Database-Backed)

#### Get All Favorites
```http
GET /api/favorites?type=apod&page=1&limit=10&q=search&sort=desc
```

**Query Parameters**:
- `type` (optional): Filter by type (apod, weather, earth, exoplanets, asteroids, tech)
- `q` (optional): Search in title and info
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page
- `sort` (optional, default: desc): Sort order (asc/desc) by created_at

**Response (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "type": "apod",
      "title": "Comet ZTF",
      "img_url": "https://...",
      "info": "2023-01-15",
      "learning_comment": "Amazing colors and composition",
      "created_at": "2023-01-20T10:30:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 42
  }
}
```

#### Save a Favorite
```http
POST /api/favorites
Content-Type: application/json

{
  "type": "apod",
  "item": {
    "id": "2023-01-15",
    "title": "Comet ZTF Over the Berkshires",
    "img": "https://apod.nasa.gov/apod/image/...",
    "info": "2023-01-15"
  }
}
```

**Response (201)**:
```json
{
  "id": 1,
  "type": "apod",
  "title": "Comet ZTF Over the Berkshires",
  "img_url": "https://...",
  "created_at": "2023-01-20T10:30:00Z"
}
```

**Validation Rules**:
- `type`: Required, must be one of: apod, weather, earth, exoplanets, asteroids, tech
- `item.title`: Required, max 500 chars
- `item.img`: Optional, valid URL

#### Update a Favorite
```http
PUT /api/favorites/1
Content-Type: application/json

{
  "title": "Updated title",
  "learning_comment": "I learned that this comet has a great tail"
}
```

**Response (200)**:
```json
{
  "id": 1,
  "type": "apod",
  "title": "Updated title",
  "learning_comment": "I learned that this comet has a great tail",
  "updated_at": "2023-01-20T11:00:00Z"
}
```

#### Delete a Favorite
```http
DELETE /api/favorites/1
```

**Response (200)**:
```json
{
  "message": "Favorite deleted successfully",
  "id": 1
}
```

---

### Custom Planets

#### Get All Custom Planets
```http
GET /api/custom-planets?page=1&limit=10&q=search
```

**Query Parameters**:
- `q` (optional): Search in name and description
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Response (200)**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Pandora",
      "hostname": "Alpha Centauri B",
      "discovery_method": "Transit Method",
      "disc_year": 2023,
      "description": "A fictional paradise planet...",
      "created_at": "2023-01-20T10:30:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25
  }
}
```

#### Create a Custom Planet
```http
POST /api/custom-planets
Content-Type: application/json

{
  "name": "Pandora",
  "hostname": "Alpha Centauri B",
  "discovery_method": "Transit Method",
  "disc_year": 2023,
  "description": "A paradise planet with bioluminescent flora"
}
```

**Response (201)**:
```json
{
  "id": 1,
  "name": "Pandora",
  "hostname": "Alpha Centauri B",
  "created_at": "2023-01-20T10:30:00Z"
}
```

**Validation Rules**:
- `name`: Required, max 255 chars
- `hostname`: Optional, max 255 chars
- `discovery_method`: Optional, max 255 chars
- `disc_year`: Optional, numeric
- `description`: Optional, text

#### Delete a Custom Planet
```http
DELETE /api/custom-planets/1
```

**Response (200)**:
```json
{
  "message": "Custom planet deleted successfully",
  "id": 1
}
```

---

## Error Handling

All endpoints return error responses in this format:

```json
{
  "error": "Invalid input",
  "details": ["Field 'type' is required"]
}
```

**Common Status Codes**:
- `200 OK`: Successful request
- `201 Created`: Resource created
- `400 Bad Request`: Validation error
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Database Schema

### Favorites Table
```sql
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  external_id VARCHAR(255),
  title TEXT NOT NULL,
  img_url TEXT,
  info TEXT,
  learning_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Custom Planets Table
```sql
CREATE TABLE custom_planets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hostname VARCHAR(255),
  discovery_method VARCHAR(255),
  disc_year INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Development

### Project Structure
```
src/
├── controllers/          # Business logic
│   ├── nasaController.js
│   ├── favoritesController.js
│   └── planetsController.js
├── routes/              # API endpoints
│   ├── nasaRoutes.js
│   ├── favoritesRoutes.js
│   └── planetsRoutes.js
├── middleware/          # Validation & auth
│   └── validator.js
├── db.js               # PostgreSQL pool
└── swagger.js          # API documentation
```

### Adding a New Endpoint

1. Create controller in `src/controllers/`
2. Define route in `src/routes/`
3. Add validation middleware in `src/middleware/validator.js`
4. Add Swagger documentation in route file
5. Mount route in `index.js`

### Testing Endpoints

**Using curl**:
```bash
curl -X GET http://localhost:3001/api/apod
curl -X POST http://localhost:3001/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"type":"apod","item":{"title":"...", "img":"..."}}'
```

**Using Postman**:
Import the Swagger spec at `http://localhost:3001/api-docs`

---

## License

MIT
