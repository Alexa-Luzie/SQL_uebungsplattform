-- Erstelle die Tabelle employees
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE
);

-- Füge Beispieldaten hinzu
INSERT INTO employees (id, name, department, salary, hire_date) VALUES
(1, 'Max Müller', 'IT', 5000, '2020-01-15'),
(2, 'Anna Schmidt', 'HR', 4000, '2019-03-10'),
(3, 'Peter Weber', 'IT', 4500, '2021-07-01'),
(4, 'Lisa Meier', 'Finance', 5500, '2018-11-20'),
(5, 'Tom Becker', 'IT', 4800, '2022-05-12');