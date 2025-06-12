-- Tabelle für Orte
CREATE TABLE ort (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    plz VARCHAR(10) NOT NULL
);

-- Tabelle für Universitäten
CREATE TABLE universitaet (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ort_id INTEGER REFERENCES ort(id)
);

-- Tabelle für Studenten
CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    universitaet_id INTEGER REFERENCES universitaet(id)
);

-- Tabelle für Professoren
CREATE TABLE professor (
    id SERIAL PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    universitaet_id INTEGER REFERENCES universitaet(id)
);

-- Beispiel-Daten für Orte
INSERT INTO ort (name, plz) VALUES
  ('Unistadt', '55555'),
  ('Campusdorf', '66666'),
  ('Lehrheim', '77777'),
  ('Forschingen', '88888');

-- Beispiel-Daten für Universitäten
INSERT INTO universitaet (name, ort_id) VALUES
  ('Technische Universität', 1),
  ('Hochschule Campusdorf', 2),
  ('Lehrheim Universität', 3),
  ('Forschungszentrum', 4);

-- Beispiel-Daten für Studenten
INSERT INTO student (vorname, nachname, universitaet_id) VALUES
  ('Lisa', 'Studios', 1),
  ('Tom', 'Bachelor', 2),
  ('Maria', 'Master', 3),
  ('Jan', 'Diplom', 4),
  ('Eva', 'Forscher', 1),
  ('Ben', 'Praktikant', 2);

-- Beispiel-Daten für Professoren
INSERT INTO professor (vorname, nachname, universitaet_id) VALUES
  ('Dr. Anna', 'Lehr', 1),
  ('Prof. Max', 'Wissen', 2),
  ('Dr. Sophie', 'Forschung', 3),
  ('Prof. Tom', 'Vortrag', 4),
  ('Dr. Lena', 'Seminar', 1),
  ('Prof. Paul', 'Projekt', 2);