# NASA Explorer Backend (Modular API)

This is a modular REST API built with Node.js and Express that acts as a proxy for NASA data and manages personal favorites and custom planetary discoveries.

## Features

- **NASA Data Proxy**: Access APOD, Weather, Earth, Exoplanets, Asteroids, and TechPort data.
- **Favorites Management**: Save items with learning comments in a PostgreSQL database.
- **Custom Planets**: Create and manage your own planetary discoveries.
- **Advanced Querying**: Pagination, search, and sorting supported on favorites and custom planets.
- **Robust Validation**: Server-side validation for all data entry.
- **API Documentation**: Interactive Swagger UI available at `/api-docs`.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Documentation**: Swagger/OpenAPI
- **Validation**: express-validator

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=3001
   NASA_API_KEY=your_api_key_here
   DATABASE_URL=postgres://user:password@localhost:5432/nasa_db
   ```

3. **Run the server**:
   ```bash
   npm start
   ```

4. **API Docs**:
   Visit `http://localhost:3001/api-docs` to see the interactive documentation.

## Endpoints

### NASA Proxy
- `GET /api/apod`: Astronomy Picture of the Day.
- `GET /api/weather`: Mars Insight Weather.
- `GET /api/exoplanets`: NASA Exoplanet Archive.
- `GET /api/earth`: EPIC Earth Images.
- `GET /api/asteroids`: Near Earth Objects.
- `GET /api/tech`: NASA TechPort projects.

### Favorites
- `GET /api/favorites`: List favorites (supports `q`, `page`, `limit`, `sort`, `type`).
- `POST /api/favorites`: Save a favorite.
- `PUT /api/favorites/:id`: Update title or learning comment.
- `DELETE /api/favorites/:id`: Remove from favorites.

### Custom Planets
- `GET /api/custom-planets`: List custom planets (supports `q`, `page`, `limit`).
- `POST /api/custom-planets`: Create a new planet.
- `DELETE /api/custom-planets/:id`: Delete a planet.
