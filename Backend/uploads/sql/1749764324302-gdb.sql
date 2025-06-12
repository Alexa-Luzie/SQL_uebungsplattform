-- Tabelle für Orte
CREATE TABLE ort (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    plz VARCHAR(10) NOT NULL
);

-- Tabelle für Gärtnereien
CREATE TABLE gaertnereien (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ort_id INTEGER REFERENCES ort(id)
);

-- Tabelle für Gärtner
CREATE TABLE gaertner (
    id SERIAL PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    gaertnerei_id INTEGER REFERENCES gaertnereien(id)
);

-- Tabelle für Kunden
CREATE TABLE kunden (
    id SERIAL PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    ort_id INTEGER REFERENCES ort(id)
);

-- Beispiel-Daten für Orte
INSERT INTO ort (name, plz) VALUES
  ('Musterstadt', '12345'),
  ('Blumental', '54321'),
  ('Rosendorf', '11111'),
  ('Tulpenheim', '22222');

-- Beispiel-Daten für Gärtnereien
INSERT INTO gaertnereien (name, ort_id) VALUES
  ('Blumenparadies', 1),
  ('Pflanzenwelt', 2),
  ('Rosentraum', 3),
  ('Tulpenzauber', 4);

-- Beispiel-Daten für Gärtner
INSERT INTO gaertner (vorname, nachname, gaertnerei_id) VALUES
  ('Anna', 'Grün', 1),
  ('Max', 'Blatt', 2),
  ('Sophie', 'Rose', 3),
  ('Tom', 'Tulpe', 4),
  ('Lena', 'Ast', 1),
  ('Paul', 'Wurzel', 2);

-- Beispiel-Daten für Kunden
INSERT INTO kunden (vorname, nachname, ort_id) VALUES
  ('Lisa', 'Rose', 1),
  ('Tom', 'Tulpe', 2),
  ('Maria', 'Blume', 3),
  ('Jan', 'Garten', 4),
  ('Eva', 'Knospe', 1),
  ('Ben', 'Stamm', 2);;