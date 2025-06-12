-- Tabelle für Orte
CREATE TABLE ort (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    plz VARCHAR(10) NOT NULL
);

-- Tabelle für Immobilien
CREATE TABLE immobilien (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ort_id INTEGER REFERENCES ort(id)
);

-- Tabelle für Makler
CREATE TABLE makler (
    id SERIAL PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    immobilien_id INTEGER REFERENCES immobilien(id)
);

-- Tabelle für Mieter
CREATE TABLE mieter (
    id SERIAL PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    ort_id INTEGER REFERENCES ort(id)
);

-- Beispiel-Daten für Orte
INSERT INTO ort (name, plz) VALUES
  ('Immostadt', '10001'),
  ('Wohnheim', '20002'),
  ('Hausen', '30003'),
  ('Villendorf', '40004');

-- Beispiel-Daten für Immobilien
INSERT INTO immobilien (name, ort_id) VALUES
  ('Sonnenresidenz', 1),
  ('Parkblick', 2),
  ('Stadtvilla', 3),
  ('Seeblick', 4);

-- Beispiel-Daten für Makler
INSERT INTO makler (vorname, nachname, immobilien_id) VALUES
  ('Julia', 'Hausmann', 1),
  ('Peter', 'Wohn', 2),
  ('Sabine', 'Makler', 3),
  ('Tom', 'Vermittler', 4),
  ('Lena', 'Schlüssel', 1),
  ('Paul', 'Grund', 2);

-- Beispiel-Daten für Mieter
INSERT INTO mieter (vorname, nachname, ort_id) VALUES
  ('Anna', 'Mieter', 1),
  ('Max', 'Wohnung', 2),
  ('Sophie', 'Haus', 3),
  ('Tom', 'Loft', 4),
  ('Eva', 'Penthaus', 1),
  ('Ben', 'Studio', 2);