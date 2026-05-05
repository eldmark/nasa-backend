-- Cleanup existing tables to ensure a fresh start
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS custom_planets;

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

CREATE TABLE custom_planets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hostname VARCHAR(255),
    discovery_method VARCHAR(255),
    disc_year INTEGER,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
