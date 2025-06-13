-- Erstelle die Tabelle authors
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(50)
);

-- Füge Beispieldaten für authors hinzu
INSERT INTO authors (name, birth_date, nationality) VALUES
('J.K. Rowling', '1965-07-31', 'British'),
('George R.R. Martin', '1948-09-20', 'American'),
('J.R.R. Tolkien', '1892-01-03', 'British'),
('Agatha Christie', '1890-09-15', 'British'),
('Stephen King', '1947-09-21', 'American');

-- Erstelle die Tabelle books
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT REFERENCES authors(id),
    genre VARCHAR(50),
    published_date DATE,
    copies_available INT DEFAULT 1
);

-- Füge Beispieldaten für books hinzu
INSERT INTO books (title, author_id, genre, published_date, copies_available) VALUES
('Harry Potter and the Philosopher\'s Stone', 1, 'Fantasy', '1997-06-26', 5),
('A Game of Thrones', 2, 'Fantasy', '1996-08-06', 3),
('The Hobbit', 3, 'Fantasy', '1937-09-21', 4),
('Murder on the Orient Express', 4, 'Mystery', '1934-01-01', 2),
('The Shining', 5, 'Horror', '1977-01-28', 3);

-- Erstelle die Tabelle members
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    join_date DATE NOT NULL,
    membership_type VARCHAR(50) DEFAULT 'Standard' -- Standard oder Premium
);

-- Füge Beispieldaten für members hinzu
INSERT INTO members (name, email, join_date, membership_type) VALUES
('Max Müller', 'max.mueller@example.com', '2022-01-15', 'Standard'),
('Anna Schmidt', 'anna.schmidt@example.com', '2021-03-10', 'Premium'),
('Peter Weber', 'peter.weber@example.com', '2020-07-01', 'Standard'),
('Lisa Meier', 'lisa.meier@example.com', '2019-11-20', 'Premium'),
('Tom Becker', 'tom.becker@example.com', '2023-05-12', 'Standard');

-- Erstelle die Tabelle loans
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    book_id INT REFERENCES books(id),
    member_id INT REFERENCES members(id),
    loan_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'Borrowed' -- Borrowed oder Returned
);

-- Füge Beispieldaten für loans hinzu
INSERT INTO loans (book_id, member_id, loan_date, return_date, status) VALUES
(1, 1, '2023-06-01', NULL, 'Borrowed'),
(2, 2, '2023-05-15', '2023-06-01', 'Returned'),
(3, 3, '2023-05-20', NULL, 'Borrowed'),
(4, 4, '2023-05-10', '2023-05-25', 'Returned'),
(5, 5, '2023-06-05', NULL, 'Borrowed');