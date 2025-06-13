-- Benutzer-Tabelle
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('STUDENT', 'TUTOR', 'ADMIN') DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aufgaben-Tabelle
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    database_schema TEXT NOT NULL, -- Das Schema der Datenbank, die für die Aufgabe verwendet wird
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lösungen-Tabelle
CREATE TABLE solutions (
    id SERIAL PRIMARY KEY,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    solution_query TEXT NOT NULL, -- Die SQL-Abfrage, die die Aufgabe löst
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bewertungen-Tabelle
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    solution_id INT REFERENCES solutions(id) ON DELETE CASCADE,
    reviewer_id INT REFERENCES users(id),
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Bewertung von 1 bis 5
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beispiel-Datenbanken-Tabelle
CREATE TABLE example_databases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    schema_definition TEXT NOT NULL, -- Das Schema der Beispiel-Datenbank
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);