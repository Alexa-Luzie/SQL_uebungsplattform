-- Beispiel: Datenbank für eine Aufgabenplattform

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email, password) VALUES
('Max Mustermann', 'max@example.com', 'passwort123'),
('Erika Musterfrau', 'erika@example.com', 'geheim456');